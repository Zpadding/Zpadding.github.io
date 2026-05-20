import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/love520',
      name: 'Love520',
      component: () => import('../views/Love520.vue'),
    },
    {
      path: '/offduty',
      name: 'OffDuty',
      component: () => import('../views/OffDuty.vue'),
    },
  ],
})

export default router
