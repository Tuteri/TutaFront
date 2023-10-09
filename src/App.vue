<template>
  <van-config-provider :theme="theme">
    <suspense>
      <router-view v-slot="{ Component }">
        <transition :name="aniName">
          <keep-alive :exclude="'ChatView,RegisterView,LoginView'">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </suspense>
  </van-config-provider>
</template>
<script setup lang="ts">
import type { ConfigProviderTheme } from 'vant';
import { applicationUpdateEvent, setNavigatorStyle, webviewBack } from './utils/plus';
import { getSystemConfig } from './api/system';
import { useSystemStore } from './stores/system';
const router = useRouter();
const systemStore = useSystemStore();
const theme = ref<ConfigProviderTheme>('dark')
const aniName = ref('fade');

// 监听系统主题颜色变化
const darkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
const handleDarkMode = () => {
  if (darkMode && darkMode.matches) {
    theme.value = 'dark'
  } else {
    theme.value = 'light'
  }
  setNavigatorStyle(theme.value);
}
darkMode && darkMode.addEventListener("change", handleDarkMode)
handleDarkMode();
webviewBack();

// 获取系统配置
getSystemConfig().then(res => {
  systemStore.setConfig(res.data);

  if (res.data.version != import.meta.env.VITE_APP_VERSION) {
    // 获取应用更新
    applicationUpdateEvent();
  }
});

router.beforeEach((to, from, next) => {
  if (to.meta.tabbar) {
    aniName.value = "";
  } else {
    aniName.value = "fade"
  }
  next();
})
</script>
<style lang="scss">
.markdown-body {

  code.hljs {
    padding: 0 !important;
  }

  .code-block-header {
    position: absolute;
    top: 5px;
    right: 0;
    width: 100%;
    padding: 0 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #b3b3b3;

    .code-block-header__copy {
      cursor: pointer;
      margin-left: 0.5rem;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }
  }
}

.flex {
  display: flex;
}

.flex-row-reverse {
  flex-direction: row-reverse;
}

.van-config-provider {
  height: 100%;
}

.fade-enter-active {
  transition: all .1s linear;
}

.fade-leave-active {
  transition: none
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(50vw);
}
</style>
