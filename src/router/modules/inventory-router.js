/**
 * Inventory Routes Module
 * Routes for inventory management features
 */

const inventoryRoutes = [
  {
    path: '/inventory',
    name: 'Inventory',
    redirect: '/inventory/stock-list',
    meta: {
      requiresAuth: true,
      title: 'Inventory Management'
    }
  },
  {
    path: '/inventory/stock-list',
    name: 'StockList',
    component: () => import('@/views/common/coming-soon-view.vue'),
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
  }
]

export default inventoryRoutes
