import type { LoginParams, RegisterParams } from "../types/user";

import { axiosInstance } from "../utils/request";

const request = axiosInstance(import.meta.env.VITE_API_USER_URL);

export async function login(data: LoginParams) {
  return await request.post("/user/login", data);
}

export async function register(data: RegisterParams) {
  return await request.post("/user/register", data);
}

export async function registerCaptcha(email: string) {
  return await request.get("/user/register-captcha", {
    params: {
      address: email,
    },
  });
}

export async function updatePassword(data: RegisterParams) {
  return await request.post("/user/update_password", data);
}

export async function updatePasswordCaptcha(email: string) {
  return await request.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}
