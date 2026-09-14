import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/preview',
      component: () => import('@/pages/previewPage/PreviewPage.vue'),
    },
    {
      path: '/edit',
      component: () => import('@/edit/ScreenEditor.vue'),
    },
    {
      path: '/screen',
      component: () => import('@/pages/screenPage/ScreenPage.vue'),
    },
    {
      path: '/',
      redirect: '/edit',
    },
  ],
})

export default router
