import axios from "@/utils/request";
import _ from "lodash";
import path from "path-browserify";
const baseURL = '/email';

export function emailRegiserSendCode(email: string) {
  return axios.post(path.join(baseURL, '/register'), { email })
}

export function emailRegiserVerifyCode(email: any, token: string = "", emailCode: string = "") {
  if (email.email) {
    token = email.token;
    emailCode = email.emailCode;
    email = email.email;
  }
  return axios.post(path.join(baseURL, '/register/verify'), { email, token, emailCode })
}