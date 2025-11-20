# Sidebar Permission Update Guide

## Overview
การอัพเดต sidebar ให้แสดงเฉพาะเมนูที่ user มีสิทธิ์เข้าถึง โดยใช้ `v-if` กับ permission helper functions

## Pattern สำหรับแต่ละประเภทเมนู

### 1. Single Menu Item (ไม่มี submenu)
```vue
<!-- Before -->
<router-link
  to="/dashboard"
  class="nav-item"
  active-class="active"
  @click="closeSidebar"
>
  <i class="pi pi-home"></i>
  <span>{{ t('dashboard.menu.dashboard') }}</span>
</router-link>

<!-- After - เพิ่ม v-if -->
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
```

**Router Name ที่ต้องเช็ค:**
- Dashboard → `'Dashboard'`
- Customers → `'Customers'`
- Products → `'Products'`
- Profile → `'Profile'`

### 2. Parent Menu with Submenu
```vue
<!-- Before -->
<div class="nav-group">
  <a href="#" class="nav-item" @click.prevent="toggleSubmenu('sales')">
    <i class="pi pi-shopping-cart"></i>
    <span>{{ t('dashboard.menu.sales') }}</span>
    <i class="pi pi-chevron-down submenu-icon"></i>
  </a>
  <transition name="submenu-slide">
    <div v-if="openSubmenu === 'sales'" class="submenu">
      <!-- submenu items -->
    </div>
  </transition>
</div>

<!-- After - เพิ่ม v-if กับ parent -->
<div v-if="hasAccessibleChildren(['SalesOrder', 'Quotation', 'Invoice'])" class="nav-group">
  <a href="#" class="nav-item" @click.prevent="toggleSubmenu('sales')">
    <i class="pi pi-shopping-cart"></i>
    <span>{{ t('dashboard.menu.sales') }}</span>
    <i class="pi pi-chevron-down submenu-icon"></i>
  </a>
  <transition name="submenu-slide">
    <div v-if="openSubmenu === 'sales'" class="submenu">
      <!-- submenu items with individual v-if -->
    </div>
  </transition>
</div>
```

**Parent Menus และ Children:**
- **Sales** → `['SalesOrder', 'Quotation', 'Invoice']`
- **Inventory** → `['StockList', 'StockIn', 'StockOut', 'StockTransfer']`
- **Reports** → `['DailyReport', 'MonthlyReport', 'SalesReport', 'InventoryReport']`
- **Worker Data** → `['GuideList', 'SalesList', 'DriverList']`
- **Settings** → `['AccountManagement', 'AdjustRoleRouter', 'SystemSettings']`

### 3. Submenu Items
```vue
<!-- Before -->
<router-link
  to="/sales/orders"
  class="submenu-item"
  active-class="active"
  @click="closeSidebar"
>
  <i class="pi pi-circle-fill"></i>
  <span>{{ t('dashboard.menu.salesOrder') }}</span>
  <span class="badge">Soon</span>
</router-link>

<!-- After - เพิ่ม v-if -->
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
```

## รายชื่อ Router Names ทั้งหมด

### Main Routes
- `Dashboard`
- `Customers`
- `Products`
- `Profile`

### Sales Module
- `SalesOrder`
- `Quotation`
- `Invoice`

### Inventory Module
- `StockList`
- `StockIn`
- `StockOut`
- `StockTransfer`

### Reports Module
- `DailyReport`
- `MonthlyReport`
- `SalesReport`
- `InventoryReport`

### Worker Data Module
- `GuideList`
- `SalesList`
- `DriverList`

### Settings Module
- `AccountManagement`
- `AdjustRoleRouter`
- `SystemSettings`

## ขั้นตอนการ Apply

1. **เริ่มจาก Single Items:**
   - เพิ่ม `v-if="canAccess('RouteName')"` ให้กับ Dashboard, Customers, Products, Profile

2. **ทำ Parent Menus:**
   - เพิ่ม `v-if="hasAccessibleChildren([...])"` ให้กับ div.nav-group
   - ใส่ array ของ children route names

3. **ทำ Submenu Items:**
   - เพิ่ม `v-if="canAccess('RouteName')"` ให้กับแต่ละ submenu item
   - ใช้ router name ที่ตรงกับใน routes definition

4. **ทดสอบ:**
   - Login ด้วย user ที่มี permissions ต่างกัน
   - ตรวจสอบว่าเห็นเฉพาะเมนูที่มีสิทธิ์

## ตัวอย่างที่เสร็จสมบูรณ์

### Inventory Module (ครบทุกส่วน)
```vue
<div v-if="hasAccessibleChildren(['StockList', 'StockIn', 'StockOut', 'StockTransfer'])" class="nav-group">
  <a href="#" class="nav-item" @click.prevent="toggleSubmenu('inventory')">
    <i class="pi pi-box"></i>
    <span>{{ t('dashboard.menu.inventory') }}</span>
    <i class="pi pi-chevron-down submenu-icon" :class="{ 'rotate': openSubmenu === 'inventory' }"></i>
  </a>
  <transition name="submenu-slide">
    <div v-if="openSubmenu === 'inventory'" class="submenu">
      <router-link
        v-if="canAccess('StockList')"
        to="/inventory/stock-list"
        class="submenu-item"
        active-class="active"
        @click="closeSidebar"
      >
        <i class="pi pi-circle-fill"></i>
        <span>{{ t('dashboard.menu.stockList') }}</span>
        <span class="badge">Soon</span>
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
```

## หมายเหตุ

- **Dashboard** แนะนำให้แสดงเสมอ (ทุกคนควรเข้าถึงได้)
- **Parent Menu** จะซ่อนถ้าไม่มี children ที่เข้าถึงได้เลย
- **Submenu Items** แสดง/ซ่อนแบบอิสระตาม permission แต่ละอัน
- ถ้า parent menu แสดง แต่ submenu ทุกอันถูกซ่อน parent จะแสดงแต่ไม่มี dropdown

## สรุป Pattern

```vue
<!-- Pattern 1: Single Item -->
<router-link v-if="canAccess('RouteName')" ... />

<!-- Pattern 2: Parent with Children -->
<div v-if="hasAccessibleChildren(['Child1', 'Child2'])" class="nav-group">
  <!-- parent -->
  <div v-if="openSubmenu === 'menu'" class="submenu">
    <router-link v-if="canAccess('Child1')" ... />
    <router-link v-if="canAccess('Child2')" ... />
  </div>
</div>
```
