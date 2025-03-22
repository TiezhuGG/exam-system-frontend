import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import { ElMessage } from "element-plus";

interface ResponseData<T = any> {
  code?: number;
  message?: string;
  data: T;
}

export const axiosInstance = (url: string) => {
  const request: AxiosInstance = axios.create({
    baseURL: url,
    timeout: 3000,
  });

  const requestInterceptor = (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  };

  const requestErrorInterceptor = (error: any) => {
    return Promise.reject(error);
  };

  const responseInterceptor = (response: AxiosResponse<ResponseData>) => {
    const newToken = response.headers["token"];
    if (newToken) {
      localStorage.setItem("token", newToken);
    }

    if (response.status === 201 || response.status === 200) {
      return response;
    } else {
      return Promise.reject("Error");
    }
  };

  const responseErrorInterceptor = (error: any) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    const { data } = error.response;

    if (data.statusCode === 401) {
      ElMessage.error(data.message);

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else {
      return Promise.reject(error);
    }
  };

  request.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

  request.interceptors.response.use(
    responseInterceptor,
    responseErrorInterceptor
  );

  return request;
};
