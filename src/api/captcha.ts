import axios from "@/utils/request";
import path from "path-browserify";
const baseURL = '/captcha';

export function getCaptcha() {
  return axios.get(baseURL);
}
export function verCaptcha(token: string, captcha: string) {
  return axios.post(baseURL, { token, captcha });
}