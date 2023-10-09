import { getAppVersion } from "../api/system";
import store from '@/stores/index'
import { useSystemStore } from "../stores/system";
declare const plus: any;
const systemStore = useSystemStore(store);
// export const getAddressBook = () => {
//   return new Promise((resolve, reject) => {
//     plusLisenter(() => {
//       plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, (addressbook: any) => {
//         // 查找联系人
//         addressbook.find(["displayName", "phoneNumbers"], function (contacts: any) {
//           console.log("contacts" + JSON.stringify(contacts));


//           resolve(JSON.stringify(contacts));
//         }, function () {
//           reject("获取联系人失败")
//         }, {
//           multiple: true
//         });
//       })
//     })
//   })

// }

// 移动端更新事件
export const applicationUpdateEvent = () => {
  if (systemStore.plusReady) {
    getAppVersion().then(res => {
      if (res.data.link) {
        alert("有新版本，请更新");
        plus.runtime.openURL(import.meta.env.VITE_AXIOS_BASE_URL + res.data.link, function (res: any) {
          console.log('openURL', JSON.stringify(res))
        });
      }
    })
  }

}
export const webviewBack = () => {
  webviewEvent(() => {
    //等待plus ready后再调用5+ API：
    let first: any = null;
    const webview = plus.webview.currentWebview();
    plus.key.addEventListener('backbutton', () => {
      webview.canBack((e: any) => {
        if (e.canBack) {
          webview.back();
        } else {
          //首次按键，提示‘再按一次退出应用’
          if (!first) {
            //获取第一次点击的时间戳
            first = new Date().getTime();
            //通过H5+ API 调用Android 上的toast 提示框
            plus.nativeUI.toast("再按一次退出应用", {
              duration: 'short'
            });
            setTimeout(() => {
              first = null;
            }, 1000);
          } else {
            if (new Date().getTime() - first < 1000) {
              //获取第二次点击的时间戳, 两次之差 小于 1000ms 说明1s点击了两次,
              plus.runtime.quit(); //退出应用
              // webview.close(); //hide,quit
            }
          }
        }
      })
    });
  })
}
export const setNavigatorStyle = (mode: string) => {
  systemStore.plusReady ? setNavStyle(mode) : plusLisenter(() => {
    setNavStyle(mode)
  })
}
const setNavStyle = (mode: string) => {
  plus.navigator.setStatusBarBackground('#00000000');
  plus.navigator.setStatusBarStyle('light');
  let bgcolor = "#FFFFFF";
  let style = 'dark';
  if (mode === 'dark') {
    bgcolor = '#1c1c1e';
    style = 'light';
  }
  plus.navigator.setStatusBarBackground(bgcolor);
  plus.navigator.setStatusBarStyle(style);
}
export const webviewEvent = (fn: Function) => {
  if (systemStore.plusReady) {
    fn();
  } else {
    plusLisenter(fn)
  }
}
// 移动端事件监听器
export const plusLisenter = (fn: Function = () => { }) => {
  document.addEventListener('plusready', function () {
    fn();
    systemStore.setPlusReady(true);
  }, false);
}
plusLisenter();