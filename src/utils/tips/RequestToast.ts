import { showLoadingToast, showSuccessToast, showFailToast, closeToast, showToast, ToastOptions } from "vant";
import router from "/@/router";
const publicToast: ToastOptions = {
  forbidClick: true,
  loadingType: "spinner"
}
export default class RequestToast {
  api: Function;
  data: any;
  loadingToast = true;
  successToast = true;
  failToast = true;
  loadingMessage = "加载中...";
  successMessage = "";
  failMessage = "";
  failMessageFromResponse = true;
  constructor(api: Function) {
    this.api = api;
  }

  sendRequest = (data: any = {}): Promise<any> => {
    this.data = data;
    if (this.loadingToast) {
      showLoadingToast({
        ...publicToast,
        message: this.loadingMessage,
        duration: 0,
      })
    }
    return this.api(this.data).then((res: any) => {
      this.closeRequestToast();
      if (this.successToast) {
        showSuccessToast({
          ...publicToast,
          message: this.successMessage,
        })
      }
      return Promise.resolve(res);
    }).catch((res: any) => {
      this.closeRequestToast();
      if (this.failToast) {
        showFailToast({
          ...publicToast,
          message: this.failMessageFromResponse ? res : this.failMessage,
        })
      }
      return Promise.reject(res);
    })
  }
  closeRequestToast = () => {
    closeToast();
  }
  push = (path: string, time = 1000) => {
    setTimeout(() => {
      router.push(path)
    }, time)
  }
}