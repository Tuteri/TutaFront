import axios from "@/utils/request";
import path from "path-browserify";
import { queryString } from "../utils/common";
const baseURL = '/user/window'


export function getChatWindow() {
  return axios.get(baseURL);
}
export function getChatWindowById(id: string) {
  return axios.get(path.join(baseURL, id ));
}
export function postChatWindow(data: any) {
  return axios.post(baseURL, data);
}
export function putChatWindow(data: any) {
  return axios.put(baseURL, data);
}
export function delChatWindow(id: string) {
  return axios.delete(path.join(baseURL, id ));
}