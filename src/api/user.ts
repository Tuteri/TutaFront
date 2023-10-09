import axios from "@/utils/request";
import path from "path-browserify";
const baseURL = '/user'
export function sendMessage(data: any) {
  return axios.post(path.join(baseURL, 'message'), data);
}
export function userLogin(data: any) {
  return axios.post(path.join(baseURL, "/login"), data)
}
export function userRegister(data: any) {
  return axios.post(path.join(baseURL, "/register"), data)
}