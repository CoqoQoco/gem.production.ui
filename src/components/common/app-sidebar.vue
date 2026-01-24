<template>
  <div>
    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>
    </transition>

    <!-- Sidebar -->
    <transition name="slide">
      <aside v-if="isOpen" class="app-sidebar">
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <img src="@/assets/images/logo.png" alt="Logo" class="brand-logo" />
            <h2 class="brand-title">{{ t('dashboard.brandName') }}</h2>
          </div>
          <button class="close-btn" @click="closeSidebar" :aria-label="t('common.close')">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Sidebar Navigation -->
        <nav class="sidebar-nav">
          <!-- Dashboard -->
          <router-link
            v-if="canAccess('Dashboard')"
            to="/dashboard"
            class="nav-item"
            active-class="active"
            @click="closeSidebar"
          >
            <i class="pi pi-home"></i>
            <span>{{ t('dashboard.menu.dashboard') }}</span>
          </router-link>

          <!-- Divider -->
          <div class="nav-divider">
            <span>{{ t('dashboard.menu.modules') }}</span>
          </div>

          <!-- Sales Module with Submenu -->
          <div v-if="hasAccessibleChildren(['SalesOrder', 'Quotation', 'Invoice'])" class="nav-group">
            <a href="#" class="nav-item" @click.prevent="toggleSubmenu('sales')">
              <i class="pi pi-shopping-cart"></i>
              <span>{{ t('dashboard.menu.sales') }}</span>
              <i class="pi pi-chevron-down submenu-icon" :class="{ 'rotate': openSubmenu === 'sales' }"></i>
            </a>
            <transition name="submenu-slide">
              <div v-if="openSubmenu === 'sales'" class="submenu">
                <router-link
                  v-if="canAccess('SalesOrder')"
                  to="/sales/orders"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.salesOrder') }}</span>
                  <span class="badge">Soon</span>
                </router-link>
                <router-link
                  v-if="canAccess('Quotation')"
                  to="/sales/quotation"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.quotation') }}</span>
                  <span class="badge">Soon</span>
                </router-link>
                <router-link
                  v-if="canAccess('Invoice')"
                  to="/sales/invoice"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.invoice') }}</span>
                  <span class="badge">Soon</span>
                </router-link>
              </div>
            </transition>
          </div>

          <!-- Inventory Module with Submenu -->
          <div v-if="hasAccessibleChildren(['StockSummary', 'GoodsReceipt', 'UpdateProduct', 'MassUpdateGoldPrice', 'StockList', 'StockIn', 'StockOut', 'StockTransfer'])" class="nav-group">
            <a href="#" class="nav-item" @click.prevent="toggleSubmenu('inventory')">
              <i class="pi pi-box"></i>
              <span>{{ t('dashboard.menu.inventory') }}</span>
              <i class="pi pi-chevron-down submenu-icon" :class="{ 'rotate': openSubmenu === 'inventory' }"></i>
            </a>
            <transition name="submenu-slide">
              <div v-if="openSubmenu === 'inventory'" class="submenu">
                <router-link
                  v-if="canAccess('StockSummary')"
                  to="/inventory/summary"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.stockSummary') || 'ภาพรวม Stock' }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('StockList')"
                  to="/inventory/stock-list"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.stockList') }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('GoodsReceipt')"
                  to="/inventory/goods-receipt"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.goodsReceipt') || 'บันทึกรับสินค้า' }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('UpdateProduct')"
                  to="/inventory/update-product"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.updateProduct') || 'แก้ไขสินค้า' }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('MassUpdateGoldPrice')"
                  to="/inventory/mass-update-gold-price"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.massUpdateGoldPrice') || 'ปรับราคาทอง' }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('StockIn')"
                  to="/inventory/stock-in"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.stockIn') }}</span>
                  <span class="badge">Soon</span>
                </router-link>
                <router-link
                  v-if="canAccess('StockOut')"
                  to="/inventory/stock-out"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.stockOut') }}</span>
                  <span class="badge">Soon</span>
                </router-link>
                <router-link
                  v-if="canAccess('StockTransfer')"
                  to="/inventory/stock-transfer"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.stockTransfer') }}</span>
                  <span class="badge">Soon</span>
                </router-link>
              </div>
            </transition>
          </div>

          <!-- Reports Module with Submenu -->
          <div v-if="hasAccessibleChildren(['DailyReport', 'MonthlyReport', 'SalesReport', 'InventoryReport'])" class="nav-group">
            <a href="#" class="nav-item" @click.prevent="toggleSubmenu('reports')">
              <i class="pi pi-chart-bar"></i>
              <span>{{ t('dashboard.menu.reports') }}</span>
              <i class="pi pi-chevron-down submenu-icon" :class="{ 'rotate': openSubmenu === 'reports' }"></i>
            </a>
            <transition name="submenu-slide">
              <div v-if="openSubmenu === 'reports'" class="submenu">
                <router-link
                  v-if="canAccess('DailyReport')"
                  to="/reports/daily"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.dailyReport') }}</span>
                  <span class="badge">Soon</span>
                </router-link>
                <router-link
                  v-if="canAccess('MonthlyReport')"
                  to="/reports/monthly"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.monthlyReport') }}</span>
                  <span class="badge">Soon</span>
                </router-link>
                <router-link
                  v-if="canAccess('SalesReport')"
                  to="/reports/sales"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.salesReport') }}</span>
                  <span class="badge">Soon</span>
                </router-link>
                <router-link
                  v-if="canAccess('InventoryReport')"
                  to="/reports/inventory"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.inventoryReport') }}</span>
                  <span class="badge">Soon</span>
                </router-link>
              </div>
            </transition>
          </div>

          <!-- Customers Module (No Submenu) -->
          <router-link
            v-if="canAccess('Customers')"
            to="/customers"
            class="nav-item"
            active-class="active"
            @click="closeSidebar"
          >
            <i class="pi pi-users"></i>
            <span>{{ t('dashboard.menu.customers') }}</span>
            <!-- <span class="badge">Soon</span> -->
          </router-link>

          <!-- Products Module (No Submenu) -->
          <router-link
            v-if="canAccess('Products')"
            to="/products"
            class="nav-item"
            active-class="active"
            @click="closeSidebar"
          >
            <i class="pi pi-tag"></i>
            <span>{{ t('dashboard.menu.products') }}</span>
            <span class="badge">Soon</span>
          </router-link>

          <!-- Divider -->
          <div class="nav-divider">
            <span>{{ t('dashboard.menu.settings') }}</span>
          </div>

          <!-- Worker Data Module with Submenu -->
          <div v-if="hasAccessibleChildren(['GuideList', 'SalesList', 'DriverList'])" class="nav-group">
            <a href="#" class="nav-item" @click.prevent="toggleSubmenu('workerData')">
              <i class="pi pi-id-card"></i>
              <span>{{ t('dashboard.menu.workerData') }}</span>
              <i class="pi pi-chevron-down submenu-icon" :class="{ 'rotate': openSubmenu === 'workerData' }"></i>
            </a>
            <transition name="submenu-slide">
              <div v-if="openSubmenu === 'workerData'" class="submenu">
                <router-link
                  v-if="canAccess('GuideList')"
                  to="/worker-data/guides"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.guideList') }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('SalesList')"
                  to="/worker-data/sales"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.salesList') }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('DriverList')"
                  to="/worker-data/drivers"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.driverList') }}</span>
                </router-link>
              </div>
            </transition>
          </div>

          <!-- Master Data Module with Submenu -->
          <div v-if="hasAccessibleChildren(['BranchManagement', 'GemManagement', 'GoldManagement', 'GoldSizeManagement', 'GemShapeManagement', 'ProductTypeManagement'])" class="nav-group">
            <a href="#" class="nav-item" @click.prevent="toggleSubmenu('masterData')">
              <i class="pi pi-database"></i>
              <span>{{ t('dashboard.menu.masterData') || 'ข้อมูลหลัก' }}</span>
              <i class="pi pi-chevron-down submenu-icon" :class="{ 'rotate': openSubmenu === 'masterData' }"></i>
            </a>
            <transition name="submenu-slide">
              <div v-if="openSubmenu === 'masterData'" class="submenu">
                <router-link
                  v-if="canAccess('BranchManagement')"
                  to="/setting/master-data/branch"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('branch.title') || 'จัดการสาขา' }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('GemManagement')"
                  to="/setting/master-data/gem"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('gem.title') || 'จัดการข้อมูลพลอย' }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('GoldManagement')"
                  to="/setting/master-data/gold"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('gold.title') || 'จัดการข้อมูลทอง' }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('GoldSizeManagement')"
                  to="/setting/master-data/gold-size"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('goldSize.title') || 'จัดการข้อมูลขนาดทอง' }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('GemShapeManagement')"
                  to="/setting/master-data/gem-shape"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('gemShape.title') || 'จัดการข้อมูลรูปร่างพลอย' }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('ProductTypeManagement')"
                  to="/setting/master-data/product-type"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('productType.title') || 'จัดการประเภทสินค้า' }}</span>
                </router-link>
              </div>
            </transition>
          </div>

          <!-- Settings Module with Submenu -->
          <div v-if="hasAccessibleChildren(['AccountManagement', 'AdjustRoleRouter', 'SystemSettings'])" class="nav-group">
            <a href="#" class="nav-item" @click.prevent="toggleSubmenu('settings')">
              <i class="pi pi-cog"></i>
              <span>{{ t('dashboard.settings') }}</span>
              <i class="pi pi-chevron-down submenu-icon" :class="{ 'rotate': openSubmenu === 'settings' }"></i>
            </a>
            <transition name="submenu-slide">
              <div v-if="openSubmenu === 'settings'" class="submenu">
                <router-link
                  v-if="canAccess('AccountManagement')"
                  to="/setting/account"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('account.title') || 'จัดการบัญชีผู้ใช้' }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('AdjustRoleRouter')"
                  to="/setting/adjust-role-router"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('roleRouter.title') || 'จัดการสิทธิ์เข้าถึงหน้า' }}</span>
                </router-link>
                <router-link
                  v-if="canAccess('SystemSettings')"
                  to="/setting/system"
                  class="submenu-item"
                  active-class="active"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill"></i>
                  <span>{{ t('dashboard.menu.systemSettings') || 'ตั้งค่าระบบ' }}</span>
                  <span class="badge">Soon</span>
                </router-link>
              </div>
            </transition>
          </div>

          <!-- Profile -->
          <router-link
            v-if="canAccess('Profile')"
            to="/profile"
            class="nav-item"
            active-class="active"
            @click="closeSidebar"
          >
            <i class="pi pi-user"></i>
            <span>{{ t('dashboard.profile') }}</span>
            <span class="badge">Soon</span>
          </router-link>
        </nav>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <p class="version">Version 1.0.0</p>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { hasRouterPermission, getUserRouterPermissions } from '@/utils/permissionHelper'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const { t } = useI18n()
const toast = useToast()
const router = useRouter()

// Submenu state
const openSubmenu = ref(null)

// Get user permissions
const userPermissions = computed(() => getUserRouterPermissions())

// Helper function to check permission
// Automatically allows public and guest-only routes
const canAccess = (routeName) => {
  // Find the route by name to get its meta information
  const route = router.getRoutes().find(r => r.name === routeName)

  // If route not found, deny access
  if (!route) return false

  // Check permission with route meta
  // This will automatically return true for public and guest routes
  return hasRouterPermission(routeName, route.meta)
}

// Check if parent menu has any accessible children
const hasAccessibleChildren = (routeNames) => {
  if (!routeNames || routeNames.length === 0) return false
  return routeNames.some(name => canAccess(name))
}

const toggleSubmenu = (menuName) => {
  openSubmenu.value = openSubmenu.value === menuName ? null : menuName
}

const closeSidebar = () => {
  emit('close')
  // Reset submenu when closing sidebar
  openSubmenu.value = null
}

const comingSoon = () => {
  toast.add({
    severity: 'info',
    summary: t('common.comingSoon'),
    detail: t('common.featureInDevelopment'),
    life: 3000
  })
}
</script>

<style lang="scss" scoped>
// Overlay
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1100;
  backdrop-filter: blur(2px);
}

// Sidebar
.app-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1200;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 85%;
    max-width: 320px;
  }
}

// Sidebar Header
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #efe9c9;
  background: linear-gradient(135deg, rgba(239, 233, 201, 0.1) 0%, rgba(239, 233, 201, 0.1) 100%);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;

  .brand-logo {
    height: 36px;
    width: auto;
    object-fit: contain;
  }

  .brand-title {
    font-size: 18px;
    font-weight: 700;
    color: #e7de99;
    margin: 0;
  }
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  i {
    font-size: 18px;
    color: #6b7280;
  }

  &:hover {
    background-color: #f3f4f6;
  }
}

// Sidebar Navigation
.sidebar-nav {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.nav-group {
  margin-bottom: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 8px;
  text-decoration: none;
  color: #374151;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;

  i {
    font-size: 18px;
    color: #6b7280;
    width: 20px;
    transition: color 0.2s;
  }

  span {
    flex: 1;
  }

  .submenu-icon {
    font-size: 14px;
    margin-left: auto;
    transition: transform 0.3s ease;

    &.rotate {
      transform: rotate(180deg);
    }
  }

  .badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    background-color: #dbeafe;
    color: #1e40af;
    border-radius: 12px;
  }

  &:hover {
    background-color: rgba(239, 233, 201, 0.1);
    color: #e7de99;

    i {
      color: #e7de99;
    }
  }

  &.active {
    background-color: rgba(239, 233, 201, 0.2);
    color: #e7de99;
    font-weight: 600;

    i {
      color: #e7de99;
    }
  }
}

// Submenu
.submenu {
  padding-left: 12px;
  margin: 4px 0;
  overflow: hidden;
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px 10px 28px;
  margin-bottom: 2px;
  border-radius: 8px;
  text-decoration: none;
  color: #6b7280;
  font-size: 14px;
  font-weight: 400;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    background-color: #d1d5db;
    border-radius: 50%;
    transition: all 0.2s;
  }

  i.pi-circle-fill {
    font-size: 6px;
    color: #d1d5db;
    width: auto;
  }

  span {
    flex: 1;
  }

  .badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    background-color: #e0e7ff;
    color: #3730a3;
    border-radius: 10px;
  }

  &:hover {
    background-color: rgba(239, 233, 201, 0.08);
    color: #e7de99;
    padding-left: 32px;

    &::before {
      background-color: #e7de99;
      width: 6px;
      height: 6px;
    }

    i.pi-circle-fill {
      color: #e7de99;
    }
  }

  &.active {
    background-color: rgba(239, 233, 201, 0.15);
    color: #e7de99;
    font-weight: 500;

    &::before {
      background-color: #e7de99;
      width: 6px;
      height: 6px;
    }

    i.pi-circle-fill {
      color: #e7de99;
    }
  }
}

// Submenu Transition
.submenu-slide-enter-active {
  transition: all 0.3s ease-out;
}

.submenu-slide-leave-active {
  transition: all 0.25s ease-in;
}

.submenu-slide-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.submenu-slide-enter-to {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

.submenu-slide-leave-from {
  opacity: 1;
  max-height: 500px;
}

.submenu-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.nav-divider {
  margin: 16px 0 8px 0;
  padding: 0 16px;

  span {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

// Sidebar Footer
.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #efe9c9;
  background: linear-gradient(135deg, rgba(239, 233, 201, 0.05) 0%, rgba(239, 233, 201, 0.05) 100%);

  .version {
    font-size: 12px;
    color: #e7de99;
    text-align: center;
    margin: 0;
    font-weight: 500;
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: transform 0.3s ease-out;
}

.slide-leave-active {
  transition: transform 0.25s ease-in;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

// Scrollbar styling
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;

  &:hover {
    background: #9ca3af;
  }
}
</style>
