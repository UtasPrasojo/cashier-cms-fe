import HomeView from '@/views/home/index.vue'
import CartView from '@/views/cart/cart-view/index.vue'
import CartPayment from '@/views/cart/cart-payment/index.vue'
import AddCategory from '@/views/add-category/index.vue'
import AddProduct from '@/views/add-product/index.vue'
import UserView from '@/views/user/index.vue'
import UserCreateView from '@/views/user/create.vue'
import UserUpdateView from '@/views/user/update.vue'

import ExampleLayout from '@/layouts/ExampleLayout.vue';

// middleware
import AuthMiddleware from '@/middleware/auth.middleware.js';

export default [{
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home',
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
    {
    path: '/cart-view',
    name: 'cart.view',
    component: CartView,
    meta: {
      title: 'Cart View',
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
    {
    path: '/cart-payment',
    name: 'cart.payment',
    component: CartPayment,
    meta: {
      title: 'Cart Payment',
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
     {
    path: '/add-category',
    name: 'add.category',
    component: AddCategory,
    meta: {
      title: 'Add category',
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: '/add-product',
    name: 'add.product',
    component: AddProduct,
    meta: {
      title: 'Add product',
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    meta: {
      title: 'User',
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: '/user/create',
    name: 'user.create',
    component: UserCreateView,
    meta: {
      title: 'User Create',
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: '/user/update',
    name: 'user.update',
    component: UserUpdateView,
    meta: {
      title: 'User Update',
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  }
]
