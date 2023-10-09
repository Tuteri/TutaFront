import Axios from "axios";
import { Local } from "./storage";
import router from "@/router";
import { formatHumpLineTransfer } from "./common";
import { showNotify } from 'vant';
// base url
export const baseURL = import.meta.env.VITE_AXIOS_BASE_URL + (import.meta.env.VITE_PROXY_AXIOS_BASE_PATH || "/");
export const headers = () => {
  const token = Local.getString('token')
  if (token) {
    return {
      Authentication: token,
      Role: "user"
    }
  }
  return {}
}
const axios = Axios.create({
  baseURL,
  headers: {
    Role: "user"
  },
});
// 请求拦截
axios.interceptors.request.use(
  (config: any) => {
    if (config.headers) {
      const token = Local.getString('token')
      if (token) {
        config.headers.Authentication = token;
      }
    }
    return config;
  },
  (error) => { }
);

// 响应拦截
axios.interceptors.response.use(
  (response: any) => {
    let { data } = response;
    // 非正常响应
    if (data.code !== 200) {
      showNotify({
        message: data.message,
        type: "warning"
      });
      // 未登录状态
      // if (data.code === 401) {
      //   // router.push('/login')
      // }
      return Promise.reject(data.message);
    }
    // 键名下划线转为小驼峰命名法
    return formatHumpLineTransfer(data);
  },
  (error) => {
    let msg = 'error';
    if (error.response.status === 500) {
      msg = '服务器内部错误，请稍后再试'
    }
    showNotify({
      message: msg,
      type: "danger"
    })
    return Promise.reject(error);
  }
);

export default axios;
