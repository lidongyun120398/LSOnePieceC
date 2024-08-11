import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type { DYRequestConfig, DYRequestInterceptors } from "./type";

import { ElLoading } from "element-plus";
import { LoadingInstance } from "element-plus/lib/components/loading/src/loading";

import { refreshToken } from "../main/user";

const DEFAULT_LOADING = true;

interface PendingTask {
  config: AxiosRequestConfig;
  resolve: (...args: any) => any;
}

const queue: PendingTask[] = [];

let refreshing = false;

//当传入的baseURL或者其他信息有变化的时候，通过创建两个实例的方法完成请求
class DYRequest {
  instance: AxiosInstance;
  interceptors?: DYRequestInterceptors;
  showLoading: boolean;
  loading?: LoadingInstance;

  constructor(config: DYRequestConfig) {
    this.instance = axios.create(config);
    this.showLoading = config.showLoading ?? DEFAULT_LOADING;
    this.interceptors = config.interceptors;

    //从config取出的拦截器是对应的实例的拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch,
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch,
    );

    //添加所有的实例都有的拦截器
    this.instance.interceptors.request.use(
      (config) => {
        if (config.headers) {
          config.headers[`accpet-encoding`] = "gzip";
        }
        //添加loading
        if (this.showLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: "正在请求数据...",
            background: "rgba(0,0,0,0.5)",
          });
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      },
    );

    this.instance.interceptors.response.use(
      (res) => {
        //将loading移除
        // setTimeout(() => {
        //   this.loading?.close()
        // }, 1000)
        this.loading?.close();

        const data = res.data;
        if (data.returnCode === "-1001") {
          throw new Error("错误");
        } else {
          return data;
        }
      },
      async (err) => {
        const { data, config } = err.response;

        if (refreshing) {
          return new Promise((resolve) => {
            queue.push({
              config,
              resolve,
            });
          });
        }

        if (data.statusCode === 401 && !config.url.includes("/refresh")) {
          refreshing = true;

          const res = await refreshToken();

          if (res.code === 200) {
            queue.forEach(({ config, resolve }) => {
              resolve(this.instance(config));
            });

            return this.instance(config);
          } else {
            alert(data || "登录过期，请重新登录");
          }
        } else {
          return err.response;
        }
      },
    );
  }
  request<T = any>(config: DYRequestConfig<T>): Promise<T> {
    return new Promise((resolve) => {
      //1.单个请求对请求config的处理
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }

      //2.判断是否需要显示loading
      if (config.showLoading === false) {
        this.showLoading = config.showLoading;
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          //1.单个请求对数据的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }

          //2.再将showLoading设置为true，这样不影响下一个请求
          this.showLoading = DEFAULT_LOADING;

          //3.将结果resolve返回出去
          resolve(res);
        })
        .catch((err) => {
          //再将showLoading设置为true，这样不影响下一个请求
          this.showLoading = DEFAULT_LOADING;
          return Promise.reject(err);
        });
    });
  }
  get<T = any>(config: DYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "GET" });
  }
  post<T = any>(config: DYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "POST" });
  }
  delete<T = any>(config: DYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE" });
  }
  patch<T = any>(config: DYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "PATCH" });
  }
}

//拦截器的作用：封装一些公有逻辑

export default DYRequest;
