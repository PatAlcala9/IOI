
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/main', component: () => import('pages/Main.vue') },
      { path: '/camera', component: () => import('pages/Camera.vue') },
      { path: '/map', component: () => import('pages/Map.vue') },
      { path: '/docs', component: () => import('pages/Documentation/Page1.vue') },
      { path: '/docs/2', component: () => import('pages/Documentation/Page2.vue') },
      { path: '/docs/3', component: () => import('pages/Documentation/Page3.vue') },
      { path: '/mobile', component: () => import('pages/Description/Mobile.vue') },
      { path: '/info/tech', component: () => import('pages/Description/Technical.vue') },
      { path: '/info/secs', component: () => import('pages/Description/Security.vue') },
      { path: '/info/secs2', component: () => import('pages/Description/Security2.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
