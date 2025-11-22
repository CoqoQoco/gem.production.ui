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

### 1.1. `skipPermissionCheck: true`
Routes ที่ต้อง login แต่ไม่ต้องเช็ค permission (เข้าได้ทุกคนที่ login แล้ว)
- เหมาะสำหรับหน้า Profile, Settings ส่วนตัว
- ยังคงต้อง authenticate แต่ไม่ต้องมี permission เฉพาะ

```javascript
{
  path: '/profile',
  name: 'Profile',
  component: () => import('@/views/setting/profile/profile-index.vue'),
  meta: {
    requiresAuth: true,
    skipPermissionCheck: true, // Allow all authenticated users
    title: 'Profile'
  }
}
```

### 2. `requiresGuest: true`
Routes สำหรับ guest เท่านั้น (login, register)
- ถ้า login แล้วจะถูก redirect ไป `/dashboard`
- **ไม่ต้องกำหนด permission** เพราะเป็น unauthenticated route

```javascript
{
  path: '/login',
  name: 'Login',
  component: () => import('@/views/auth/login/LoginView.vue'),
  meta: {
    requiresGuest: true,
    title: 'Login'
    // ไม่ต้องใส่ permission
  }
}
```

### 3. `public: true`
Routes ที่เข้าได้โดยไม่ต้อง login (เช่น About, Contact)
- **ไม่ต้องกำหนด permission** เพราะทุกคนสามารถเข้าถึงได้

```javascript
{
  path: '/about',
  name: 'About',
  component: () => import('@/views/public/AboutView.vue'),
  meta: {
    public: true,
    title: 'About Us'
    // ไม่ต้องใส่ permission
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

## 🛡️ Authentication & Permission Flow

### 1. ผู้ใช้ยังไม่ Login (Unauthenticated)
```
User → /sales
→ Router Guard ตรวจพบไม่มี auth
→ Redirect to /login?redirect=/sales
→ User login สำเร็จ
→ Redirect กลับไป /sales (ถ้ามี permission)
→ หรือ Redirect ไป /dashboard (ถ้าไม่มี permission)
```

### 2. ผู้ใช้ Login แล้ว แต่ไม่มี Permission
```
User (logged in) → /sales
→ Router Guard ตรวจพบมี auth
→ เช็ค permission สำหรับ route "Sales"
→ ไม่พบ "Sales" ใน user.roles[].routerAllow
→ Redirect to /dashboard
```

### 3. ผู้ใช้ Login แล้ว และมี Permission
```
User (logged in) → /sales
→ Router Guard ตรวจพบมี auth
→ เช็ค permission สำหรับ route "Sales"
→ พบ "Sales" ใน user.roles[].routerAllow
→ Allow access
```

### 4. ผู้ใช้เข้า Route ที่ skipPermissionCheck
```
User (logged in) → /profile
→ Router Guard ตรวจพบมี auth
→ Route มี skipPermissionCheck=true
→ ข้าม permission check
→ Allow access (ทุกคนที่ login แล้ว)
```

### 5. ผู้ใช้ Login แล้วพยายามเข้า Login Page
```
User (logged in) → /login
→ Router Guard ตรวจพบ requiresGuest=true และมี auth
→ Redirect to /dashboard
```

### 6. ผู้ใช้เข้า Public Route
```
User (ไม่ว่าจะ login หรือไม่) → /about
→ Router Guard ตรวจพบ public=true
→ Allow access (ไม่เช็ค auth และ permission)
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

## 🚨 Common Issues & Troubleshooting

### Issue 1: Route ไม่ทำงาน
**สาเหตุ:** ไม่ได้ uncomment route
**แก้ไข:** เอา `//` ออกจาก route definition

### Issue 2: ถูก redirect ไป login ตลอด
**สาเหตุ:** ไม่มี user data ใน localStorage
**แก้ไข:** Login ใหม่อีกครั้ง

### Issue 3: Login แล้วแต่ถูก redirect ไป dashboard ทันที
**สาเหตุ:** User ไม่มี permission สำหรับ route นั้น
**แก้ไข:**
1. ตรวจสอบ user roles ใน localStorage
2. ตรวจสอบว่า route name มีอยู่ใน `user.roles[].routerAllow` หรือไม่
3. อัปเดต role permissions ในระบบจัดการสิทธิ์

### Issue 4: Page Title ไม่เปลี่ยน
**สาเหตุ:** ไม่ได้ใส่ `meta.title`
**แก้ไข:** เพิ่ม `title` ใน meta object

### Issue 5: Menu ใน Sidebar ไม่แสดง
**สาเหตุ:** User ไม่มี permission สำหรับ route นั้น
**แก้ไข:**
- ตรวจสอบว่า route name มีใน `routerAllow` หรือไม่
- หรือใช้ `skipPermissionCheck: true` ถ้าต้องการให้ทุกคนเข้าได้

### Issue 6: ต้องการให้ route เข้าได้โดยไม่ต้อง permission
**วิธีแก้:**
- ใช้ `skipPermissionCheck: true` สำหรับ routes ที่ต้อง login แต่ไม่ต้องเช็ค permission
- ใช้ `public: true` สำหรับ routes ที่ไม่ต้อง login เลย

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

## 🔒 Permission Management

### หลักการจัดการ Permission

**Routes ที่ต้องกำหนด Permission (ต้องมีใน routerAllow):**
- ✅ Routes ที่มี `requiresAuth: true` แบบปกติ (Protected routes)
- ✅ Routes ที่ไม่ระบุ meta (Default protected routes)

**Routes ที่ไม่ต้องกำหนด Permission (ไม่ต้องมีใน routerAllow):**
- ❌ Routes ที่มี `public: true` (เข้าได้โดยไม่ต้อง login)
- ❌ Routes ที่มี `requiresGuest: true` (Login, Register pages)
- ❌ Routes ที่มี `skipPermissionCheck: true` (ต้อง login แต่ไม่ต้องเช็ค permission)

### Permission System คืออะไร?

Permission ถูกเก็บไว้ใน **user roles** ภายใต้ field `routerAllow` ซึ่งเป็น array ของ route names ที่ user สามารถเข้าถึงได้

**โครงสร้างข้อมูล User:**
```javascript
{
  "userId": 1,
  "username": "john.doe",
  "roles": [
    {
      "roleId": 1,
      "roleName": "Admin",
      "routerAllow": [
        "Dashboard",
        "Sales",
        "Inventory",
        "Reports",
        "AccountManagement"
      ]
    }
  ]
}
```

**การทำงาน:**
1. เมื่อ user พยายามเข้า route ระบบจะเช็คว่า route name นั้นมีอยู่ใน `routerAllow` หรือไม่
2. ถ้ามี → อนุญาตให้เข้าได้
3. ถ้าไม่มี → redirect ไป `/dashboard`

**ตัวอย่าง:**
- User มี `["Dashboard", "Sales"]` ใน routerAllow
- สามารถเข้า `/dashboard` และ `/sales` ได้
- แต่เข้า `/inventory` ไม่ได้ (จะถูก redirect ไป `/dashboard`)

### วิธีจัดการ Permission

**1. ผ่าน Admin Panel:**
- ไปที่ `/setting/adjust-role-router`
- เลือก Role ที่ต้องการแก้ไข
- เลือก Routes ที่ต้องการให้ role นั้นเข้าถึงได้
- บันทึก

**2. ผ่าน Database/API:**
- อัปเดต field `routerAllow` ใน role object
- ใส่ route names ที่ต้องการอนุญาต

### ตัวอย่างการใช้งาน

```javascript
// ✅ ต้องกำหนด permission
{
  path: '/sales',
  name: 'Sales',
  component: () => import('@/views/sales/SalesView.vue'),
  meta: {
    requiresAuth: true,
    permission: 'sales.view', // ต้องมี permission
    title: 'Sales Management'
  }
}

// ❌ ไม่ต้องกำหนด permission (Public)
{
  path: '/about',
  name: 'About',
  component: () => import('@/views/public/AboutView.vue'),
  meta: {
    public: true,
    title: 'About Us'
    // ไม่ต้องใส่ permission
  }
}

// ❌ ไม่ต้องกำหนด permission (Guest only)
{
  path: '/login',
  name: 'Login',
  component: () => import('@/views/auth/login/LoginView.vue'),
  meta: {
    requiresGuest: true,
    title: 'Login'
    // ไม่ต้องใส่ permission
  }
}

// ❌ ไม่ต้องกำหนด permission (Skip permission check)
{
  path: '/profile',
  name: 'Profile',
  component: () => import('@/views/setting/profile/profile-index.vue'),
  meta: {
    requiresAuth: true,
    skipPermissionCheck: true, // ต้อง login แต่ไม่เช็ค permission
    title: 'Profile'
    // ไม่ต้องใส่ permission
  }
}
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
    permission: 'admin.access', // กำหนด permission เพราะเป็น protected route
    title: 'Admin Panel'
  }
}
```

**Router Guard สำหรับ Roles:**

```javascript
router.beforeEach((to, from, next) => {
  // ... existing auth checks ...

  // Check role-based permissions (เฉพาะ protected routes)
  if (to.meta.roles && !to.meta.public && !to.meta.requiresGuest) {
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

## 📖 สรุปตารางเปรียบเทียบ Route Types

| Route Type | Authentication | Permission Check | Use Case | ตัวอย่าง |
|------------|----------------|------------------|----------|----------|
| **Protected Route** | ✅ Required | ✅ Required | หน้าที่ต้องการควบคุมสิทธิ์เข้าถึง | Dashboard, Sales, Inventory |
| **Skip Permission Route** | ✅ Required | ❌ Skip | หน้าส่วนตัวที่ทุกคนที่ login เข้าได้ | Profile, Personal Settings |
| **Public Route** | ❌ Not Required | ❌ Skip | หน้าที่ทุกคนเข้าได้ | About, Help, Landing Page |
| **Guest Route** | ❌ Redirect if authenticated | ❌ Skip | หน้า Login/Register | Login, Register, Forgot Password |

### เลือกใช้ Route Type อย่างไร?

```
ต้องการให้ login ก่อนหรือไม่?
├─ ไม่ → ใช้ public: true
└─ ใช่
   ├─ ต้องการเช็ค permission หรือไม่?
   │  ├─ ไม่ → ใช้ skipPermissionCheck: true
   │  └─ ใช่ → ใช้ requiresAuth: true (และกำหนด permission)
   └─ เป็นหน้า login/register?
      └─ ใช่ → ใช้ requiresGuest: true
```

---

## 🔧 Debugging Tips

### 1. ตรวจสอบ Authentication Status
```javascript
// ใน Browser Console
console.log('User:', localStorage.getItem('user'))
console.log('Token:', localStorage.getItem('token-gem'))
```

### 2. ตรวจสอบ User Permissions
```javascript
// ใน Browser Console
const user = JSON.parse(localStorage.getItem('user'))
const permissions = user.roles.flatMap(role => role.routerAllow)
console.log('User Permissions:', permissions)
```

### 3. ตรวจสอบ Router Guard Logs
เปิด Browser Console และดู logs ที่ขึ้นต้นด้วย `[Router Guard]`

```
[Router Guard] Navigating from /dashboard to /sales
[Router Guard] Authenticated: true
[Router Guard] Route meta: { requiresAuth: true, title: 'Sales' }
[Router Guard] Protected route and authenticated with valid permission, allowing access
```

### 4. ตรวจสอบว่า Route มีอยู่จริงหรือไม่
```javascript
// ใน Browser Console
import router from '@/router'
console.log(router.getRoutes().map(r => r.name))
```

---

**Last Updated:** 2025-11-22
**Version:** 2.0
