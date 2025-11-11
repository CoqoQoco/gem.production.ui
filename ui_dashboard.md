# UI Specification: Main Dashboard

## Overview
Dashboard หลังจาก Login สำเร็จ แสดงภาพรวมของระบบทั้งหมด 6 Modules พร้อม Navigation และข้อมูลสรุปสำคัญ

---

## Layout Structure

```
┌────────────────────────────────────────────────────────────────────┐
│  [Header - AppBar]                                                 │
│  [Logo] ระบบจัดการร้านจิวเวลรี่    [🔔] [👤 Admin ▼] [🚪]        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [Welcome Section]                                                 │
│  สวัสดี, คุณ Admin 👋                                             │
│  สาขาสำนักงานใหญ่ | วันนี้: ศุกร์ที่ 17 ตุลาคม 2568               │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [Quick Stats Cards - 4 cards in row]                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ 💰 ยอดขาย │ │ 📦 สินค้า │ │ 👥 ลูกค้า │ │ 💎 ออเดอร์│           │
│  │   วันนี้  │ │  คงเหลือ  │ │   วันนี้  │ │  รอดำเนิน │           │
│  │ 125,000฿ │ │   456    │ │    28    │ │     12   │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [Module Cards Grid - 2x3 or 3x2]                                 │
│                                                                    │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │ 👥 ข้อมูลหลัก       │  │ 📦 รับสินค้าเข้า     │               │
│  │ Master Data        │  │ Goods Receipt       │               │
│  │                    │  │                     │               │
│  │ - พนักงานขาย       │  │ - บันทึกรับสินค้า    │               │
│  │ - ไกด์             │  │ - โอนสินค้า         │               │
│  │ - คนขับ            │  │ - ตรวจสอบ Stock     │               │
│  │ - ข้อมูลสินค้า      │  │                     │               │
│  │ - ผู้ใช้งาน         │  │ [เข้าสู่ระบบ →]     │               │
│  │ [เข้าสู่ระบบ →]    │  └─────────────────────┘               │
│  └─────────────────────┘                                         │
│                                                                    │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │ 🛒 ขายหน้าร้าน      │  │ 🖨️ พิมพ์เอกสาร      │               │
│  │ Point of Sale      │  │ Documents           │               │
│  │                    │  │                     │               │
│  │ - ขายจิวเวลรี่      │  │ - ใบเสร็จย่อ        │               │
│  │ - ขาย Gift Shop    │  │ - ใบกำกับภาษี       │               │
│  │ - จัดการคิว         │  │ - VAT Refund        │               │
│  │ - ชำระเงิน 3 วิธี   │  │ - ใบรับประกัน       │               │
│  │ [เข้าสู่ระบบ →]    │  │ [เข้าสู่ระบบ →]     │               │
│  └─────────────────────┘  └─────────────────────┘               │
│                                                                    │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │ 💰 คำนวณคอมมิชชั่น  │  │ 📊 รายงาน           │               │
│  │ Commission         │  │ Reports             │               │
│  │                    │  │                     │               │
│  │ - คอมไกด์           │  │ - รายงานขาย         │               │
│  │ - คอม Sales        │  │ - Stock คงเหลือ     │               │
│  │ - คอม Marketing    │  │ - คอมมิชชั่น        │               │
│  │ - สรุปจ่ายเงิน      │  │ - Dashboard ผู้บริหาร│               │
│  │ [เข้าสู่ระบบ →]    │  │ [เข้าสู่ระบบ →]     │               │
│  └─────────────────────┘  └─────────────────────┘               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 1. Header (AppBar)

### Layout
- **Height:** 64px
- **Background:** White
- **Border Bottom:** 1px solid var(--gray-200)
- **Shadow:** var(--shadow-sm)
- **Position:** Sticky top
- **Z-index:** 1000

### Components

#### Logo & Brand
- **Logo Size:** 40px × 40px
- **Position:** Left
- **Brand Text:** "ระบบจัดการร้านจิวเวลรี่"
- **Font Size:** var(--text-lg) = 18px
- **Font Weight:** var(--font-semibold) = 600
- **Color:** var(--primary-600)

#### Notification Bell
- **Icon:** `pi pi-bell`
- **Size:** 24px
- **Color:** var(--gray-600)
- **Badge:** แสดงจำนวนแจ้งเตือน (Mock: 3)
- **PrimeVue Component:** `<Button>` with badge overlay

```vue
<Button 
  icon="pi pi-bell" 
  text 
  rounded
  @click="toggleNotificationPanel"
>
  <Badge value="3" severity="danger" />
</Button>
```

#### User Menu
- **PrimeVue Component:** `<Avatar>` + `<Menu>`
- **Avatar:** แสดงชื่อย่อ (เช่น "AD" สำหรับ Admin)
- **Background:** var(--primary-500)
- **Color:** White
- **Size:** 40px

**Dropdown Menu Items:**
```javascript
const userMenuItems = [
  {
    label: 'โปรไฟล์',
    icon: 'pi pi-user',
    command: () => router.push('/profile')
  },
  {
    label: 'ตั้งค่า',
    icon: 'pi pi-cog',
    command: () => router.push('/settings')
  },
  {
    separator: true
  },
  {
    label: 'ออกจากระบบ',
    icon: 'pi pi-sign-out',
    command: () => handleLogout()
  }
]
```

---

## 2. Welcome Section

### Design
- **Background:** Linear gradient
  ```css
  background: linear-gradient(135deg, 
    rgba(245, 133, 17, 0.05) 0%, 
    rgba(98, 125, 152, 0.05) 100%);
  ```
- **Padding:** 32px 24px
- **Border Radius:** var(--radius-xl) = 16px
- **Margin:** 24px 0

### Content
**Greeting:**
- **Text:** "สวัสดี, คุณ {userName} 👋"
- **Font Size:** var(--text-3xl) = 30px
- **Font Weight:** var(--font-bold) = 700
- **Color:** var(--gray-900)

**Subtitle:**
- **Text:** "{branchName} | {currentDateThai}"
- **Font Size:** var(--text-base) = 16px
- **Color:** var(--gray-600)
- **Icon:** `pi pi-map-marker` สำหรับสาขา

---

## 3. Quick Stats Cards

### Layout
- **Grid:** 4 columns (responsive: 2 cols on tablet, 1 col on mobile)
- **Gap:** var(--space-4) = 16px
- **Margin Bottom:** var(--space-6) = 24px

### Stats Items

**1. ยอดขายวันนี้ (Today's Sales)**
- **Icon:** 💰
- **Value:** "125,000 ฿"
- **Change:** "+12.5%" (สีเขียว)

**2. สินค้าคงเหลือ (Stock Available)**
- **Icon:** 📦
- **Value:** "456 ชิ้น"
- **Change:** "-8 ชิ้น" (สีส้ม)

**3. ลูกค้าวันนี้ (Today's Customers)**
- **Icon:** 👥
- **Value:** "28 คน"
- **Change:** "+5 คน" (สีเขียว)

**4. ออเดอร์รอดำเนินการ (Pending Orders)**
- **Icon:** 💎
- **Value:** "12 รายการ"
- **Change:** "2 รายการ" (สีส้ม)

---

## 4. Module Cards Grid

### Layout
- **Grid:** 3 columns on desktop (2 cols on tablet, 1 col on mobile)
- **Gap:** var(--space-6) = 24px
- **Margin Top:** var(--space-8) = 32px

### Module Card Design

#### Card Container
- **Background:** White
- **Border:** 2px solid var(--gray-200)
- **Border Radius:** var(--radius-2xl) = 16px
- **Padding:** 32px
- **Height:** 320px
- **Shadow:** var(--shadow-md)

---

## 5. Module Details

### Module 1: ข้อมูลหลัก (Master Data)
```javascript
{
  id: 'master-data',
  icon: 'pi pi-database',
  iconEmoji: '👥',
  title: 'ข้อมูลหลัก',
  subtitle: 'Master Data Management',
  features: [
    'พนักงานขาย (Salesperson)',
    'ไกด์ (Guide)',
    'คนขับรถ (Driver)',
    'ข้อมูลสินค้าจิวเวลรี่',
    'ข้อมูลสาขา',
    'ผู้ใช้งานระบบ'
  ],
  route: '/master-data',
  accentColor: '#3b82f6'
}
```

### Module 2: รับสินค้าเข้า Stock (Goods Receipt)
```javascript
{
  id: 'goods-receipt',
  icon: 'pi pi-box',
  iconEmoji: '📦',
  title: 'รับสินค้าเข้า Stock',
  subtitle: 'Goods Receipt & Warehouse',
  features: [
    'บันทึกรับสินค้าเข้า',
    'รับสินค้าจากฝ่ายผลิต',
    'โอนสินค้าระหว่างสาขา',
    'ตรวจสอบ Stock คงเหลือ',
    'รายงานการเคลื่อนไหว Stock'
  ],
  route: '/goods-receipt',
  accentColor: '#f97316'
}
```

### Module 3: ขายหน้าร้าน (Point of Sale)
```javascript
{
  id: 'pos',
  icon: 'pi pi-shopping-cart',
  iconEmoji: '🛒',
  title: 'ขายหน้าร้าน',
  subtitle: 'Point of Sale (POS)',
  features: [
    'ขายจิวเวลรี่ + ระบุ Location',
    'ขาย Gift Shop',
    'จัดการคิวไกด์',
    'ชำระเงิน 3 วิธี',
    'พิมพ์ใบเสร็จทันที'
  ],
  route: '/pos',
  accentColor: '#10b981'
}
```

### Module 4: พิมพ์เอกสาร (Documents)
```javascript
{
  id: 'documents',
  icon: 'pi pi-print',
  iconEmoji: '🖨️',
  title: 'พิมพ์เอกสาร',
  subtitle: 'Document Printing',
  features: [
    'ใบส่งของ/ใบเสร็จแบบย่อ (A5)',
    'ใบกำกับภาษีแบบเต็ม',
    'VAT Refund + Passport',
    'ใบรับประกันสินค้า',
    'Export PDF'
  ],
  route: '/documents',
  accentColor: '#8b5cf6'
}
```

### Module 5: คำนวณคอมมิชชั่น (Commission)
```javascript
{
  id: 'commission',
  icon: 'pi pi-money-bill',
  iconEmoji: '💰',
  title: 'คำนวณคอมมิชชั่น',
  subtitle: 'Commission Calculation',
  features: [
    'คอมมิชชั่นไกด์รายวัน',
    'คอมมิชชั่น Sales',
    'คอมมิชชั่น Marketing',
    'คอมมิชชั่นหัวหน้าไกด์',
    'สรุปรายการจ่ายเงิน'
  ],
  route: '/commission',
  accentColor: '#eab308'
}
```

### Module 6: รายงาน (Reports)
```javascript
{
  id: 'reports',
  icon: 'pi pi-chart-bar',
  iconEmoji: '📊',
  title: 'รายงาน',
  subtitle: 'Reports & Analytics',
  features: [
    'รายงานขายรายวัน-เดือน-ปี',
    'รายงาน Stock คงเหลือ',
    'รายงานคอมมิชชั่นทุกประเภท',
    'Dashboard สำหรับผู้บริหาร',
    'Export Excel/PDF'
  ],
  route: '/reports',
  accentColor: '#ef4444'
}
```

---

## 6. Responsive Design

### Desktop (> 1280px)
- Module Grid: 3 columns
- Stats Cards: 4 columns

### Tablet (768px - 1280px)
- Module Grid: 2 columns
- Stats Cards: 2 columns

### Mobile (< 768px)
- Module Grid: 1 column
- Stats Cards: 1 column

---

## 7. Vue Component Structure

```vue
<template>
  <div class="dashboard-layout">
    <!-- Header/AppBar -->
    <AppHeader 
      :user="currentUser"
      :notifications="notifications"
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <div class="dashboard-content">
      <!-- Welcome Section -->
      <WelcomeSection 
        :user="currentUser"
        :branch="currentBranch"
      />

      <!-- Quick Stats -->
      <div class="stats-grid">
        <StatsCard 
          v-for="stat in quickStats"
          :key="stat.id"
          :stat="stat"
        />
      </div>

      <!-- Modules Grid -->
      <div class="modules-grid">
        <ModuleCard
          v-for="module in modules"
          :key="module.id"
          :module="module"
          @click="navigateToModule(module.route)"
        />
      </div>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { quickStats, modules, notifications } from '@/utils/mockData'

const router = useRouter()
const toast = useToast()

const currentUser = ref({
  name: 'Admin',
  fullName: 'ผู้ดูแลระบบ',
  role: 'admin',
  avatar: 'AD',
  branch: 'สาขาสำนักงานใหญ่'
})

const navigateToModule = (route) => {
  router.push(route)
}

const handleLogout = () => {
  localStorage.removeItem('user')
  toast.add({
    severity: 'success',
    summary: 'สำเร็จ',
    detail: 'ออกจากระบบเรียบร้อยแล้ว',
    life: 2000
  })
  setTimeout(() => {
    router.push('/login')
  }, 500)
}

onMounted(() => {
  const user = localStorage.getItem('user')
  if (!user) {
    router.push('/login')
  }
})
</script>
```

---

**Created by:** Full Stack Developer  
**Last Updated:** October 17, 2025  
**Version:** 1.0