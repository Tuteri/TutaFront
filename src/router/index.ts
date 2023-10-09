import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import MyView from '@/views/my/MyView.vue'
import { Local } from '../utils/storage'
const router = createRouter({
  // 打包移动端app必须使用hash路由模式
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        tabbar: true,
      }
    },
    {
      path: '/my',
      name: 'my',
      component: MyView,
      meta: {
        tabbar: true,
      }
    },
    {
      path: '/chat/:id?',
      name: 'chat',
      component: () => import('@/views/chat/ChatView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/RegisterView.vue'),
      meta: {
        tabbar: true,
        auth: false,
      }
    }, {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginView.vue'),
      meta: {
        tabbar: true,
        auth: false,
      }
    },
  ]
})
router.beforeEach((to, from, next) => {
  const authToken = Local.getString("token")
  const toAuth = to.meta.auth;
  if (authToken) {
    if (toAuth === false) {
      // 访问无需认证页面 重定向到首页
      router.push("/");
      return;
    }
  } else {
    if (toAuth !== false) {
      router.push("/login")
      return;
    }
  }
  next();
})
export default router
