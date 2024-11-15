import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/HomePage.vue';
import Admin from '../components/admin.vue';
import Login from '../components/login.vue';
import Product from '@/components/product.vue';
import Activity from '../components/activity.vue';
import store from '../store/vuex'; // Vuex store
import product_detail from '@/components/product_detail.vue';
import add_product from '@/components/add_product.vue';
import userlike from '@/components/userlike.vue';
import usercart from '@/components/usercart.vue';
import userorder from '@/components/userorder.vue';
import checkout from '@/components/checkout.vue';
import about from '@/components/about.vue';
import add_activity from '@/components/add_activity.vue';
import add_ann from '@/components/add_ann.vue';

const routes = [
  { path: '/', name: 'Home', component: Product },
  { path: '/login', name: 'Login', component: Login },
  { path: '/product', name: 'product', component: Product },
  { path: '/activity', name: 'activity', component: Activity },
  { path: '/about', name: 'about', component: about },
  { 
    path: '/admin', 
    name: 'Admin', 
    component: Admin, 
    meta: { requiresAuth: true, role: 'employee' } // 需要員工身份才能訪問 
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: product_detail,
    props: route => ({ productId: parseInt(route.params.id) }) 
  },
  {
    path:'/add_product',
    name: 'add_product',
    component:add_product,
    meta: { requiresAuth: true, role: 'employee' }
  },
  {
    path:'/add_activity',
    name: 'add_activity',
    component:add_activity,
    meta: { requiresAuth: true, role: 'employee' }
  },
  {
    path:'/add_ann',
    name: 'add_ann',
    component:add_ann,
    meta: { requiresAuth: true, role: 'employee' }
  },
  {
    path:'/like',
    name:'userlike',
    component: userlike
  },
  {
    path:'/cart',
    name:'usercart',
    component: usercart
  },
  {
    path:'/userorder',
    name:'userorder',
    component: userorder
  },
  {
    path:'/checkout',
    name:'checkout',
    component: checkout
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守衛
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 檢查是否已登入
    if (!store.getters.isAuthenticated) {
      next({ name: 'Login' });
    } else {
      // 檢查角色
      const role = store.getters.role;
      if (to.meta.role && to.meta.role !== role) {
        next({ name: 'Home' }); // 如果角色不符合，跳轉到首頁
      } else {
        next(); // 符合條件，放行
      }
    }
  } else {
    next(); // 不需要驗證的頁面，直接放行
  }
});

export default router;
