import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { isProd, loadEnv } from '/@/utils/vite'
import type { ConfigEnv, ProxyOptions, UserConfig } from 'vite'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite'
const { resolve } = require("path");
const pathResolve = (dir: string): any => {
  return resolve(__dirname, '.', dir)
}

// https://vitejs.dev/config/
const viteConfig = ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_PORT, VITE_OPEN, VITE_BASE_PATH, VITE_BUILD_DIR, VITE_PROXY_AXIOS_BASE_PATH, VITE_PROXY_AXIOS_BASE_URL } = loadEnv(mode)

  const alias: Record<string, string> = {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
    '/@': pathResolve('./src/'),
    assets: pathResolve('./src/assets'),
    'vue-i18n': isProd(mode) ? 'vue-i18n/dist/vue-i18n.cjs.prod.js' : 'vue-i18n/dist/vue-i18n.cjs.js',
  }

  let proxy: Record<string, string | ProxyOptions> = {}
  if (VITE_PROXY_AXIOS_BASE_URL) {
    proxy = {};
    proxy[VITE_PROXY_AXIOS_BASE_PATH] = {
      target: VITE_PROXY_AXIOS_BASE_URL,
      changeOrigin: true,
    };
  }

  return {
    base: VITE_BASE_PATH,
    build: {
      outDir: VITE_BUILD_DIR,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // 分包配置
            vue: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
            vant: ['vant'],
            markdown: ['highlight.js', 'markdown-it', '@traptitech/markdown-it-katex'],
            viewport: ['lib-flexible', 'postcss-pxtorem']
          }
        }
      }
    },
    plugins: [
      vue(),
      Components({
        resolvers: [VantResolver()],
      }),
      AutoImport({
        imports:['vue','vue-router'],
        dirs:['./src/api'],
        dts:"./src/auto-imports.d.ts"
      })
    ],
    resolve: {
      alias
    },
    server: {
      port: VITE_PORT,
      open: VITE_OPEN,
      host: "0.0.0.0",
      proxy,
    }

  }
}
export default viteConfig;
