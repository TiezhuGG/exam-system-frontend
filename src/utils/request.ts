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

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_EXAM_URL,
  timeout: 3000,
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    console.log("response interceptor", response);

    const newToken = response.headers["token"];
    if (newToken) {
      localStorage.setItem("token", newToken);
    }

    if (response.status === 201 || response.status === 200) {
      return response;
    } else {
      return Promise.reject("Error");
    }
  },
  (error) => {
    console.log("响应Error", error);
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
  }
);

export default request;
