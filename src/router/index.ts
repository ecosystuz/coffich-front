
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

 const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LayoutDefault',
      component: () => import('@/layouts/LDefault.vue'),
      children: [
        {
            path: '/',
            name: 'Home',
            alias: ['Home', 'Main'],
            component: ()=> import('@/views/HomeView.vue')
        },
          {
          path: '/location',
          name:'location',
          alias:'location',
          component: ()=> import('@/components/location/Brandesmap.vue')
        },
        {
          path: '/Meny',
          name: 'Meny',
          alias: 'Meny',
          component: ()=> import('@/components/Meny/Breakmeny.vue')
        },
        {
          path: '/contact',
          name:'contact',
          alias:'contact',
          component: ()=> import('@/components/Aloqa/Aloqa.vue')
        },
        {
          path:'/News',
          name:'News',
          alias:'News',
          component: ()=> import('@/components/yangiliklar/News.vue')
        }
      ]
    }
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 } 
    }
  }
})


export default router