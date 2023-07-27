import type { AxiosRequestConfig, AxiosResponse } from "axios";

export interface DYRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorCatch?: (error: any) => any;
  responseInterceptor?: (res: T) => T;
  responseInterceptorCatch?: (error: any) => any;
}

export interface DYRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: DYRequestInterceptors<T>;
  showLoading?: boolean;
}
