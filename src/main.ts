import './assets/css/main.scss'
import 'vant/es/notify/style';
import 'vant/es/dialog/style';
import 'vant/es/toast/style';
import 'vant/es/image-preview/style';
// import '@vant/touch-emulator';
import { createApp } from 'vue'
import store from '@/stores/index'

import App from './App.vue'
import router from './router'
import { getSystemConfig } from './api/system';

const app = createApp(App)

app.use(store)
app.use(router)
app.mount('#app')


// haptics-feedback 触感反馈添加class
app.directive('hf', {
  mounted(el) {
    el.classList.add("van-haptics-feedback");
  }
});
