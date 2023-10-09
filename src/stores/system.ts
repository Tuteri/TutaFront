import { defineStore } from "pinia";
import { Local } from "../utils/storage";

export const useSystemStore = defineStore('system', {
  state() {
    return {
      config: {},
      plusReady: false, // 移动端 h5+ 加载完成
      mobile: false,     // 移动端设备
    }
  },
  actions: {
    setConfig(payload: any) {
      this.config = payload;
    },
    setPlusReady(payload: boolean) {
      this.plusReady = payload;
    }
  },
  getters: {
  }
})