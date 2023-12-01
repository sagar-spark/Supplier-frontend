export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    userrole: "Vendor/Supplier"
  },

  // Inbound
  {
    component: 'CNavTitle',
    name: 'Inbound',
    userrole: "Vendor/Supplier"
  },
  {
    component: 'CNavItem',
    name: 'ASN',
    to: '/inbound/asn',
    icon: 'cil-blur',
    userrole: "Vendor/Supplier"
  },
  {
    component: 'CNavItem',
    name: 'New ASN',
    to: '/inbound/asn-create',
    icon: 'cil-bolt',
    userrole: "Vendor/Supplier"
  },
  {
    component: 'CNavItem',
    name: 'Approve GRN',
    to: '/inbound/grn-approve',
    icon: 'cil-arrow-thick-from-left',
    userrole: "Vendor/Supplier"
  },
  // Inventory

  {
    component: 'CNavTitle',
    name: 'INVENTORY MANAGEMENT',
    userrole: "Vendor/Supplier"
  },
  {
    component: 'CNavItem',
    name: 'Inventory',
    to: '/inventory/all',
    icon: 'cil-apps',
    userrole: "Vendor/Supplier"
  },
  // Order Processing
  {
    component: 'CNavTitle',
    name: 'ORDER PROCESSING',
    userrole: "Vendor/Supplier"
  },
  {
    component: 'CNavItem',
    name: 'All Orders',
    to: '/order-processing/all-orders',
    icon: 'cil-apps-settings',
    userrole: "Vendor/Supplier"
  },
  {
    component: 'CNavItem',
    name: 'Order Form',
    to: '/order-processing/order-form',
    icon: 'cil-cart',
    userrole: "Vendor/Supplier"
  },


  // Manage
  {
    component: 'CNavTitle',
    name: 'MANAGE',
    userrole: "Vendor/Supplier"
  },
  {
    component: 'CNavItem',
    name: 'Address',
    to: '/manage/address',
    icon: 'cil-address-book',
    userrole: "Vendor/Supplier"
  },
  {
    component: 'CNavItem',
    name: 'SKUs & Integrations',
    to: '/manage/integrations',
    icon: 'cil-link',
    userrole: "Vendor/Supplier"
  },
  {
    component: 'CNavItem',
    name: 'Retailer',
    to: '/manage/retailer',
    icon: 'cil-library-building',
    userrole: "Vendor/Supplier"
  },
  {
    component: 'CNavItem',
    name: 'Subscription & Invoices',
    to: '/manage/billing',
    icon: 'cil-money',
    userrole: "Vendor/Supplier"
  },
]
