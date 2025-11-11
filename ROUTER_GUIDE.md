# Router Guide - Authentication & Route Management

## 📋 Overview

ระบบ Router มีการจัดการ Authentication Guard อัตโนมัติ โดยมีกฎพื้นฐานดังนี้:

### Default Behavior:
- **ทุก route จะต้อง authenticate โดย default** (ยกเว้นที่ระบุเป็นอย่างอื่น)
- ถ้าไม่ได้ login จะถูก redirect ไป `/login`
- ถ้า login แล้วพยายามเข้า login/register จะถูก redirect ไป `/dashboard`

---

## 🔐 Route Meta Options

### 1. `requiresAuth: true`
Routes ที่ต้อง login ก่อนถึงจะเข้าได้

```javascript
{
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/DashboardView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Dashboard'
  }
}
```

### 2. `requiresGuest: true`
Routes สำหรับ guest เท่านั้น (login, register)
- ถ้า login แล้วจะถูก redirect ไป `/dashboard`

```javascript
{
  path: '/login',
  name: 'Login',
  component: () => import('@/views/auth/login/LoginView.vue'),
  meta: {
    requiresGuest: true,
    title: 'Login'
  }
}
```

### 3. `public: true`
Routes ที่เข้าได้โดยไม่ต้อง login (เช่น About, Contact)

```javascript
{
  path: '/about',
  name: 'About',
  component: () => import('@/views/public/AboutView.vue'),
  meta: {
    public: true,
    title: 'About Us'
  }
}
```

### 4. **ไม่ระบุ meta** (Default)
ถ้าไม่ระบุ meta จะถือว่า **ต้อง authenticate** โดยอัตโนมัติ

```javascript
{
  path: '/sales',
  name: 'Sales',
  component: () => import('@/views/sales/SalesView.vue'),
  meta: {
    title: 'Sales' // จะต้อง login อัตโนมัติ
  }
}
```

---

## 📝 วิธีเพิ่ม Routes ใหม่

### ตัวอย่างที่ 1: เพิ่ม Protected Route (ต้อง Login)

```javascript
{
  path: '/sales',
  name: 'Sales',
  component: () => import('@/views/sales/SalesView.vue'),
  meta: {
    requiresAuth: true, // หรือไม่ต้องใส่ก็ได้ (default คือ require auth)
    title: 'Sales Management'
  }
}
```

### ตัวอย่างที่ 2: เพิ่ม Route พร้อม Nested Routes

```javascript
{
  path: '/reports',
  name: 'Reports',
  component: () => import('@/views/reports/ReportsView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Reports'
  },
  children: [
    {
      path: 'daily',
      name: 'DailyReport',
      component: () => import('@/views/reports/DailyReportView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Daily Report'
      }
    },
    {
      path: 'monthly',
      name: 'MonthlyReport',
      component: () => import('@/views/reports/MonthlyReportView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Monthly Report'
      }
    }
  ]
}
```

### ตัวอย่างที่ 3: เพิ่ม Public Route

```javascript
{
  path: '/help',
  name: 'Help',
  component: () => import('@/views/public/HelpView.vue'),
  meta: {
    public: true,
    title: 'Help Center'
  }
}
```

---

## 🛡️ Authentication Flow

### 1. ผู้ใช้ยังไม่ Login
```
User → /sales
→ Router Guard ตรวจพบไม่มี auth
→ Redirect to /login?redirect=/sales
→ User login สำเร็จ
→ Redirect กลับไป /sales
```

### 2. ผู้ใช้ Login แล้ว
```
User → /dashboard
→ Router Guard ตรวจพบมี auth
→ Allow access
```

### 3. ผู้ใช้ Login แล้วพยายามเข้า Login Page
```
User (logged in) → /login
→ Router Guard ตรวจพบ requiresGuest=true และมี auth
→ Redirect to /dashboard
```

---

## 🔄 Redirect After Login

หลัง login สำเร็จ ระบบจะ redirect ไปยัง:
1. หน้าที่ user พยายามเข้าก่อนหน้า (จาก `?redirect` parameter)
2. หรือ `/dashboard` (ถ้าไม่มี redirect parameter)

**ตัวอย่าง:**
```javascript
// ใน LoginView.vue
const redirect = router.currentRoute.value.query.redirect || '/dashboard'
router.push(redirect)
```

---

## 📊 Route Organization

แนะนำให้จัดกลุ่ม routes ตามหมวดหมู่:

```javascript
const routes = [
  // ========================================
  // Auth Routes (Guest Only)
  // ========================================
  { path: '/login', ... },
  { path: '/register', ... },

  // ========================================
  // Protected Routes (Require Authentication)
  // ========================================
  { path: '/dashboard', ... },
  { path: '/sales', ... },
  { path: '/inventory', ... },
  { path: '/reports', ... },

  // ========================================
  // Public Routes (No Authentication Required)
  // ========================================
  { path: '/about', ... },
  { path: '/help', ... },

  // ========================================
  // 404 Not Found
  // ========================================
  { path: '/:pathMatch(.*)*', ... }
]
```

---

## 🎯 Best Practices

### 1. ใช้ Lazy Loading
```javascript
component: () => import('@/views/sales/SalesView.vue')
```

### 2. ตั้งชื่อ Route ให้ชัดเจน
```javascript
name: 'SalesManagement', // ดี
name: 'Sales1',          // ไม่ดี
```

### 3. ใส่ Title เสมอ
```javascript
meta: {
  title: 'Sales Management' // จะแสดงเป็น "Sales Management - Jewelry POS System"
}
```

### 4. Comment Routes ที่ยังไม่ได้ใช้
```javascript
// Example: Sales Module (Coming Soon)
// {
//   path: '/sales',
//   name: 'Sales',
//   component: () => import('@/views/sales/SalesView.vue'),
//   meta: { requiresAuth: true, title: 'Sales' }
// },
```

---

## 🚨 Common Issues

### Issue 1: Route ไม่ทำงาน
**สาเหตุ:** ไม่ได้ uncomment route
**แก้ไข:** เอา `//` ออกจาก route definition

### Issue 2: ถูก redirect ไป login ตลอด
**สาเหตุ:** ไม่มี user data ใน localStorage
**แก้ไข:** Login ใหม่อีกครั้ง

### Issue 3: Page Title ไม่เปลี่ยน
**สาเหตุ:** ไม่ได้ใส่ `meta.title`
**แก้ไข:** เพิ่ม `title` ใน meta object

---

## 📚 ตัวอย่างการเพิ่ม Module ใหม่

### Step 1: สร้าง View Component

**ไฟล์:** `src/views/sales/SalesView.vue`

```vue
<template>
  <div class="sales-view">
    <h1>Sales Management</h1>
    <!-- Your content here -->
  </div>
</template>

<script setup>
// Your logic here
</script>

<style lang="scss" scoped>
.sales-view {
  padding: 2rem;
}
</style>
```

### Step 2: เพิ่ม Route

**ไฟล์:** `src/router/index.js`

```javascript
{
  path: '/sales',
  name: 'Sales',
  component: () => import('@/views/sales/SalesView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Sales Management'
  }
}
```

### Step 3: เพิ่ม Navigation Link (ถ้าต้องการ)

**ใน Navigation Component:**

```vue
<router-link to="/sales">Sales</router-link>
```

**หรือใช้ Programmatic Navigation:**

```javascript
router.push('/sales')
```

---

## 🔒 Future Enhancement: Role-Based Access Control

ในอนาคตสามารถเพิ่ม role-based permissions ได้:

```javascript
{
  path: '/admin',
  name: 'Admin',
  component: () => import('@/views/admin/AdminView.vue'),
  meta: {
    requiresAuth: true,
    roles: ['admin'], // เฉพาะ admin เท่านั้น
    title: 'Admin Panel'
  }
}
```

**Router Guard สำหรับ Roles:**

```javascript
router.beforeEach((to, from, next) => {
  // ... existing auth checks ...

  // Check role-based permissions
  if (to.meta.roles) {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!to.meta.roles.includes(user.role)) {
      next('/unauthorized')
      return
    }
  }

  next()
})
```

---

## 📞 Support

หากมีปัญหาหรือข้อสงสัยเกี่ยวกับ routing:
1. ตรวจสอบ Browser Console
2. ตรวจสอบว่า component ถูก import ถูกต้อง
3. ตรวจสอบว่า path ไม่ซ้ำกับ route อื่น
4. ตรวจสอบว่า meta options ถูกต้อง

---

**Last Updated:** 2025-11-01
**Version:** 1.0
