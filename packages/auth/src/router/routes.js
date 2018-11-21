const routes = [
  {
    // failsafe
    path: '/',
    redirect: '/en'
  },
  {
    path: '/:locale',
    component: () => import('src/layouts/main'),
    redirect: '/:locale/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('src/pages/login')
      },
      {
        path: 'signup/utopian',
        name: 'signup.utopian',
        component: () => import('src/pages/signup/utopian')
      },
      {
        path: 'steem/connect',
        name: 'signup.connect',
        component: () => import('src/pages/steem/connect')
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    name: 'not-found',
    component: () => import('src/pages/404')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '/:locale/*',
    component: () => import('src/pages/404')
  })
}

export default routes
