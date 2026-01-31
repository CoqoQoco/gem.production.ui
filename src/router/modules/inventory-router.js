/**
 * Inventory Routes Module
 * Routes for inventory management features
 */

const inventoryRoutes = [
  {
    path: '/inventory',
    name: 'Inventory',
    redirect: '/inventory/summary',
    meta: {
      requiresAuth: true,
      title: 'Inventory Management'
    }
  },
  {
    path: '/inventory/summary',
    name: 'StockSummary',
    component: () => import('@/views/stock/summary/stock-summary-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Stock Summary'
    }
  },
  {
    path: '/inventory/stock-list',
    name: 'StockList',
    component: () => import('@/views/stock/list-inventory/inventory-index.vue'),
    meta: {
      requiresAuth: true,
      title: 'Stock List'
    }
  },
  {
    path: '/inventory/stock-in',
    name: 'StockIn',
    component: () => import('@/views/common/coming-soon-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Stock In'
    }
  },
  {
    path: '/inventory/stock-out',
    name: 'StockOut',
    component: () => import('@/views/common/coming-soon-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Stock Out'
    }
  },
  {
    path: '/inventory/stock-transfer',
    name: 'StockTransfer',
    component: () => import('@/views/common/coming-soon-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Stock Transfer'
    }
  },
  {
    path: '/inventory/goods-receipt',
    name: 'GoodsReceipt',
    component: () => import('@/views/goods-receipt/goods-receipt/goods-receipt-index.vue'),
    meta: {
      requiresAuth: true,
      title: 'Manual Goods Receipt'
    }
  },
  {
    path: '/inventory/mass-update-gold-price',
    name: 'MassUpdateGoldPrice',
    component: () => import('@/views/stock/mass-update-gold-price/mass-update-gold-price-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mass Update Gold Price'
    }
  },
  {
    path: '/inventory/mass-upload-image',
    name: 'MassUploadImage',
    component: () => import('@/views/stock/mass-upload-image/mass-upload-image-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mass Upload Product Image'
    }
  },
  {
    path: '/inventory/update-product',
    name: 'UpdateProduct',
    component: () => import('@/views/stock/update-product/update-product-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Update Product'
    }
  }
]

export default inventoryRoutes
