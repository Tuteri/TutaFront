import axios from "@/utils/request";
import path from "path-browserify";
const baseURL = '/common/system';

export const getSystemConfig = () => {
  return axios.get(path.join(baseURL, "/config"))
}
export const getAppVersion = () => {
  return axios.get(path.join(baseURL, "/version"))
}