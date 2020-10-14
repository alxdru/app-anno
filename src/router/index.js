import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import NoPermission from '../views/NoPermission.vue';
import Annotate from '../components/tabs/Annotate.vue';
import Extractors from '../components/tabs/Extractors.vue';
import ListDocuments from '../components/tabs/ListDocuments.vue';
import Statistics from '../components/tabs/Statistics.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'annotate',
        name: 'Annotate',
        component: Annotate,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'extractors',
        name: 'Extractors',
        component: Extractors,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'documents',
        name: 'List of Documents',
        component: ListDocuments,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: Statistics,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/no-auth',
    name: 'NoPermission',
    component: NoPermission,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresAuth: false,
    },
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = new VueRouter({
  routes,
});

/**
 * Route guard for authorizations.
 * Let user access app resources only if he is logged in
 * and his/her jwt token is stored into localStorage.
 */

router.beforeEach((to, from, next) => {
  console.log(to);
  console.log(from);
  console.log(next);
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log(to.matched.some((record) => record.meta.requiresAuth));
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath },
      });
    } else {
      next();
    }
  } else if (localStorage.getItem('jwt') != null && localStorage.getItem('isAuthenticated')) {
    next({
      path: '/',
      params: { nextUrl: '/' },
    });
  } else if (to.fullPath.includes('access_token') && localStorage.getItem('isAuthenticated')) {
    const uriParams = new URLSearchParams(to.fullPath.replace('/', '?'));
    const accessToken = uriParams.get('access_token');
    window.localStorage.setItem('jwt', accessToken);
    next({
      path: '/',
      params: { nextUrl: '/' },
    });
  } else {
    next();
  }
});
export default router;
