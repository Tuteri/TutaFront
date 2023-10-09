import axios from "@/utils/request";
import path from "path-browserify";
import { queryString } from "../utils/common";
const baseURL = '/user/order'

export function getOrder() {
  return axios.get(baseURL);
}
export function getOrderById(orderNo: string) {
  return axios.get(queryString(baseURL, { orderNo }));
}
export function postOrder(data: any) {
  return axios.post(baseURL, data);
}
export function putOrder(data: any) {
  return axios.put(baseURL, data);
}
export function delOrder(orderNo: string) {
  return axios.delete(queryString(baseURL, { orderNo }));
}