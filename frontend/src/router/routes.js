const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/pretraga-filmova',
    children: [
      { path: 'pretraga-filmova', component: () => import('pages/PretragaFilmova.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', component: () => import('pages/RegistracijaPage.vue') },
      { path: 'mylists', component: () => import('pages/MojeListe.vue') },
      { path: 'film/:naziv', name: 'OpisFilma', component: () => import('pages/OpisFilma.vue') }
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, admin: true },
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('pages/AdminIndexPage.vue') },
      { path: 'manage-movies', name: 'manage-movies', component: () => import('pages/ManageMoviesPage.vue') },
      { path: 'manage-comments', name: 'manage-comments', component: () => import('pages/ManageCommentsPage.vue') },
      { path: 'logout', name: 'admin-logout', component: () => import('pages/LogoutPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
