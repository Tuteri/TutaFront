import axios from "@/utils/request";
import type { ChatMessage } from "@/utils/interface/interface";
import path from 'path-browserify'
import { queryString } from "../utils/common";
const baseURL = '/chat'
export const chatSend = (data: ChatMessage[]) => {
  return axios.post(path.join(baseURL, 'send'), data)
}

// 检测当前环境
const url = import.meta.env.DEV ? path.join(import.meta.env.VITE_PROXY_AXIOS_BASE_PATH) : path.join(import.meta.env.VITE_AXIOS_BASE_URL);
// gpt
export const chatEventSource = (param: any, event: any = {}): EventSource => {

  const eventSource = new EventSource(queryString(path.join(url, baseURL, "/sse"), param));
  eventSource.onopen = (e) => {
    event.onopen && event.onopen(e);
  }
  eventSource.onmessage = (e) => {
    event.onmessage && event.onmessage(e);
  }
  eventSource.onerror = (e) => {
    event.onerror && event.onerror(e)
    eventSource.close();
  }
  return eventSource;
}
// ernie
export const ErnieChatEventSource = (param: any, event: any = {}): EventSource => {

  const eventSource = new EventSource(queryString(path.join(url, "/ernie/chat"), param));
  eventSource.onopen = (e) => {
    event.onopen && event.onopen(e);
  }
  eventSource.onmessage = (e) => {
    event.onmessage && event.onmessage(e);
  }
  eventSource.onerror = (e) => {
    event.onerror && event.onerror(e)
    eventSource.close();
  }
  return eventSource;
}
// v1
export const v1ChatSSE = (param: any, event: any = {}): EventSource => {

  const eventSource = new EventSource(queryString(path.join(url, "/v1/chat/completion"), param));
  eventSource.onopen = (e) => {
    event.onopen && event.onopen(e);
  }
  eventSource.onmessage = (e) => {
    event.onmessage && event.onmessage(e);
  }
  eventSource.onerror = (e) => {
    event.onerror && event.onerror(e)
    eventSource.close();
  }
  return eventSource;
}
// v1 停止响应
export const v1ChatStop = (token: string) => {
  return axios.get(queryString("/v1/chat/close", { token }))
}