//service的统一出口
import DYRequest from "./request";
import { BASE_URL, TIME_OUT } from "./request/config";

import localCache from "@/utils/cache";

const dyRequest = new DYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      //携带token的拦截
      const token = localCache.getCache("token");
      if (token) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    requestInterceptorCatch: (error) => {
      return Promise.reject(error);
    },
    responseInterceptor: (res) => {
      return res;
    },
    responseInterceptorCatch: async (error) => {
      return Promise.reject(error);
    },
  },
});

export default dyRequest;
