import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import Register from '../components/Register.vue'
import TrainingPlan from '../components/TrainingPlan.vue'
import DietManagement from '../components/DietManagement.vue'
import BodyData from '../components/BodyData.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: HelloWorld,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/training',
    name: 'Training',
    component: TrainingPlan,
    meta: { requiresAuth: true }
  },
  {
    path: '/diet',
    name: 'Diet',
    component: DietManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/body',
    name: 'Body',
    component: BodyData,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  
  // 如果已登录且访问登录页，重定向到训练计划页
  if (isLoggedIn && (to.path === '/' || to.path === '/register')) {
    next('/training')
    return
  }
  
  // 如果未登录且需要认证，重定向到登录页
  if (!isLoggedIn && to.meta.requiresAuth) {
    next('/')
    return
  }
  
  next()
})

export default router 