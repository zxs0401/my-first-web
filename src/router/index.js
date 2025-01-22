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
    component: HelloWorld
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
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
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/my-first-web/' : '/'),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router 