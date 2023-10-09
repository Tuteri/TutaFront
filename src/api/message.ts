import axios from "@/utils/request";
import path from "path-browserify";
import { queryString } from "../utils/common";
const baseURL = '/user/message'


export function getChatMessage(data: any) {
  return axios.get(queryString(baseURL, data));
}
export function postChatMessage(data: any) {
  return axios.post(baseURL, data);
}
export function putChatMessage(data: any) {
  return axios.put(baseURL, data);
}
export function delChatMessage(id: string) {
  return axios.delete(path.join(baseURL, id));
}
export function clearHistoryChatMessage(id: string) {
  return axios.delete(path.join(baseURL, "/clearhistory", id));
}