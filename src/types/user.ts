export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  captcha: string;
}

export interface updatePasswordParams {
  username: string;
  email: string;
  captcha: string;
  password: string;
  confirmPassword: string;
}
