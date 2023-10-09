import axios from "@/utils/request";
import path from 'path-browserify'
import { queryString } from "../utils/common";
const baseURL = '/images'
export const imageGenerations = (data: any) => {
  return axios.post(path.join(baseURL, 'generations'), data)
}
