import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import PrintLayout from '@/layouts/PrintLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/pages/login',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
      },

      // Inbound

      {
        path: '/inbound/asn',
        name: 'Advance Shipment Notice (ASN)',
        component: () => import('@/views/supplier/inbound/AsnAll.vue'),
      },

      {
        path: '/inbound/asn-create',
        name: 'New ASN (Advance Shipment Notice)',
        component: () => import('@/views/supplier/inbound/AsnCreate.vue'),
      },

      {
        path: '/inbound/grn-approve',
        name: 'Approve GRN (Goods Received Note)',
        component: () => import('@/views/supplier/inbound/GrnApprove.vue'),
      },

      // Inventory

      {
        path: '/inventory/all',
        name: 'Stock Transfer',
        component: () => import('@/views/supplier/inventory/Inventory.vue'),
      },

      // Orders

      {
        path: '/order-processing/all-orders',
        name: 'Orders',
        component: () => import('@/views/supplier/order_processing/Orders.vue'),
      },
      {
        path: '/order-processing/order-form',
        name: 'Order Form',
        component: () => import('@/views/supplier/order_processing/OrderForm.vue'),
      },


      // Manage

      {
        path: '/manage/getting-started',
        name: 'Getting started',
        component: () => import('@/views/supplier/manage/GettingStarted.vue'),
      },
      {
        path: '/manage/address',
        name: 'Manage Address',
        component: () => import('@/views/supplier/manage/Address.vue'),
      },
      {
        path: '/manage/retailer',
        name: 'Manage Retailer',
        component: () => import('@/views/supplier/manage/Retailer.vue'),
      },
      {
        path: '/manage/integrations',
        name: 'Manage Integrations',
        component: () => import('@/views/supplier/manage/Integrations.vue'),
      },
      {
        path: '/manage/billing',
        name: 'Manage Billing',
        component: () => import('@/views/supplier/manage/Billing.vue'),
      },

    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ],
  },
  {
    path: '/print',
    name: 'Print area',
    component: PrintLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'sku-barcode',
        name: 'Print SKU barcode',
        component: () => import('@/views/supplier/print/SKUs.vue') 
      },
      {
        path: 'asn-view',
        name: 'View ASN',
        component: () => import('@/views/supplier/print/AsnView.vue') 
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
