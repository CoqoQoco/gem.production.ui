# UI Specification: Authentication Module

## Overview
Authentication module ประกอบด้วย 2 หน้าหลัก:
1. Login Page (หน้าเข้าสู่ระบบ)
2. Register Page (หน้าลงทะเบียน)

---

## 1. Login Page

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              [LOGO/BRAND]                       │
│         ระบบจัดการร้านจิวเวลรี่                  │
│                                                 │
│     ┌─────────────────────────────────┐        │
│     │  [Card - Login Form]            │        │
│     │                                 │        │
│     │  เข้าสู่ระบบ                    │        │
│     │                                 │        │
│     │  อีเมล/ชื่อผู้ใช้               │        │
│     │  [________________]             │        │
│     │                                 │        │
│     │  รหัสผ่าน                       │        │
│     │  [________________] [👁]        │        │
│     │                                 │        │
│     │  □ จดจำการเข้าสู่ระบบ          │        │
│     │                                 │        │
│     │  [     เข้าสู่ระบบ     ]       │        │
│     │                                 │        │
│     │  ยังไม่มีบัญชี? [ลงทะเบียน]    │        │
│     │  [ลืมรหัสผ่าน?]                │        │
│     └─────────────────────────────────┘        │
│                                                 │
│            © 2025 Gem Production               │
└─────────────────────────────────────────────────┘
```

### Design Specifications

#### Container
- **Background:** Gradient overlay ทับด้วยรูปภาพจิวเวลรี่แบบ blur
  ```css
  background: linear-gradient(135deg, rgba(245, 133, 17, 0.9) 0%, rgba(98, 125, 152, 0.9) 100%),
              url('jewelry-background.jpg');
  background-size: cover;
  ```
- **Min Height:** 100vh
- **Display:** Flex center (both horizontal & vertical)

#### Login Card
- **Width:** 400px (max-width: 90vw for mobile)
- **Background:** White with subtle shadow
- **Border Radius:** var(--radius-2xl) = 16px
- **Padding:** 48px 40px
- **Shadow:** var(--shadow-xl)

#### Logo/Brand Section
- **Logo Size:** 80px × 80px
- **Brand Name:** 
  - Font Size: var(--text-2xl) = 24px
  - Font Weight: var(--font-bold) = 700
  - Color: var(--primary-600)
  - Margin Bottom: var(--space-8) = 32px

#### Form Title
- **Text:** "เข้าสู่ระบบ"
- **Font Size:** var(--text-3xl) = 30px
- **Font Weight:** var(--font-semibold) = 600
- **Color:** var(--gray-900)
- **Margin Bottom:** var(--space-6) = 24px
- **Text Align:** Center

#### Input Fields

**Username/Email Input:**
- **Label:** "อีเมล หรือ ชื่อผู้ใช้"
- **Placeholder:** "กรุณากรอกอีเมลหรือชื่อผู้ใช้"
- **PrimeVue Component:** `<InputText>`
- **Props:**
  ```vue
  <InputText 
    v-model="loginForm.username"
    type="text"
    placeholder="กรุณากรอกอีเมลหรือชื่อผู้ใช้"
    class="w-full"
    :class="{ 'p-invalid': errors.username }"
  />
  ```
- **Icon:** `pi pi-user` (แสดงด้านซ้ายของ input)
- **Validation:**
  - Required
  - Error Message: "กรุณากรอกอีเมลหรือชื่อผู้ใช้"

**Password Input:**
- **Label:** "รหัสผ่าน"
- **Placeholder:** "กรุณากรอกรหัสผ่าน"
- **PrimeVue Component:** `<Password>`
- **Props:**
  ```vue
  <Password 
    v-model="loginForm.password"
    placeholder="กรุณากรอกรหัสผ่าน"
    :feedback="false"
    toggleMask
    class="w-full"
    :class="{ 'p-invalid': errors.password }"
  />
  ```
- **Icon:** `pi pi-lock`
- **Toggle Visibility:** แสดงปุ่ม show/hide password
- **Validation:**
  - Required
  - Min Length: 6
  - Error Message: "กรุณากรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"

#### Remember Me Checkbox
- **PrimeVue Component:** `<Checkbox>`
- **Label:** "จดจำการเข้าสู่ระบบ"
- **Margin Top:** var(--space-4) = 16px
```vue
<div class="flex align-items-center">
  <Checkbox 
    v-model="loginForm.rememberMe" 
    :binary="true" 
    inputId="rememberMe"
  />
  <label for="rememberMe" class="ml-2">จดจำการเข้าสู่ระบบ</label>
</div>
```

#### Login Button
- **PrimeVue Component:** `<Button>`
- **Text:** "เข้าสู่ระบบ"
- **Width:** 100%
- **Height:** 48px
- **Background:** var(--primary-500)
- **Color:** White
- **Icon:** `pi pi-sign-in`
- **Margin Top:** var(--space-6) = 24px
```vue
<Button 
  label="เข้าสู่ระบบ" 
  icon="pi pi-sign-in"
  class="w-full mt-6"
  :loading="isLoading"
  @click="handleLogin"
/>
```

#### Secondary Links
**Register Link:**
- **Text:** "ยังไม่มีบัญชี? ลงทะเบียนที่นี่"
- **Color:** var(--primary-500)
- **Hover:** var(--primary-600)
- **Font Size:** var(--text-sm) = 14px
- **Position:** Center, below button

**Forgot Password Link:**
- **Text:** "ลืมรหัสผ่าน?"
- **Color:** var(--gray-600)
- **Hover:** var(--primary-500)
- **Font Size:** var(--text-sm) = 14px
- **Position:** Center, below register link

---

## 2. Register Page

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              [LOGO/BRAND]                       │
│         ระบบจัดการร้านจิวเวลรี่                  │
│                                                 │
│     ┌─────────────────────────────────┐        │
│     │  [Card - Register Form]         │        │
│     │                                 │        │
│     │  ลงทะเบียนเข้าใช้งาน            │        │
│     │                                 │        │
│     │  ชื่อ-นามสกุล                   │        │
│     │  [________________]             │        │
│     │                                 │        │
│     │  อีเมล                          │        │
│     │  [________________]             │        │
│     │                                 │        │
│     │  ชื่อผู้ใช้                      │        │
│     │  [________________]             │        │
│     │                                 │        │
│     │  เบอร์โทรศัพท์                  │        │
│     │  [________________]             │        │
│     │                                 │        │
│     │  สาขา                           │        │
│     │  [▼ เลือกสาขา____]             │        │
│     │                                 │        │
│     │  บทบาท                         │        │
│     │  [▼ เลือกบทบาท___]             │        │
│     │                                 │        │
│     │  รหัสผ่าน                       │        │
│     │  [________________] [👁]        │        │
│     │  [Progress Bar - Strength]      │        │
│     │                                 │        │
│     │  ยืนยันรหัสผ่าน                 │        │
│     │  [________________] [👁]        │        │
│     │                                 │        │
│     │  [     ลงทะเบียน     ]          │        │
│     │                                 │        │
│     │  มีบัญชีแล้ว? [เข้าสู่ระบบ]     │        │
│     └─────────────────────────────────┘        │
│                                                 │
│            © 2025 Gem Production               │
└─────────────────────────────────────────────────┘
```

### Design Specifications

#### Register Card
- **Width:** 480px (max-width: 90vw for mobile)
- **Other styles:** Same as Login Card
- **Padding:** 40px 32px (slightly less for more fields)

#### Form Title
- **Text:** "ลงทะเบียนเข้าใช้งาน"
- **Font Size:** var(--text-3xl) = 30px
- **Other styles:** Same as Login

#### Input Fields

**Full Name:**
- **Label:** "ชื่อ-นามสกุล"
- **Placeholder:** "กรุณากรอกชื่อ-นามสกุล"
- **Icon:** `pi pi-user`
- **Validation:**
  - Required
  - Min Length: 3
  - Thai/English characters only

**Email:**
- **Label:** "อีเมล"
- **Placeholder:** "example@email.com"
- **Icon:** `pi pi-envelope`
- **Validation:**
  - Required
  - Valid email format
  - Unique (check with API later)

**Username:**
- **Label:** "ชื่อผู้ใช้"
- **Placeholder:** "ชื่อผู้ใช้สำหรับเข้าสู่ระบบ"
- **Icon:** `pi pi-id-card`
- **Validation:**
  - Required
  - Min Length: 4
  - Alphanumeric + underscore only
  - Unique

**Phone Number:**
- **Label:** "เบอร์โทรศัพท์"
- **Placeholder:** "0XX-XXX-XXXX"
- **Icon:** `pi pi-phone`
- **PrimeVue Component:** `<InputMask>` with mask="099-999-9999"
- **Validation:**
  - Required
  - Thai phone format (10 digits)

**Branch Selection:**
- **Label:** "สาขา"
- **PrimeVue Component:** `<Dropdown>`
- **Placeholder:** "เลือกสาขา"
- **Options (Mock Data):**
  ```javascript
  branches: [
    { value: 1, label: 'สาขาสำนักงานใหญ่ (กรุงเทพ)' },
    { value: 2, label: 'สาขาเชียงใหม่' },
    { value: 3, label: 'สาขาภูเก็ต' }
  ]
  ```

**Role Selection:**
- **Label:** "บทบาท"
- **PrimeVue Component:** `<Dropdown>`
- **Placeholder:** "เลือกบทบาท"
- **Options (Mock Data):**
  ```javascript
  roles: [
    { value: 'sales', label: 'พนักงานขาย (Sales)' },
    { value: 'guide', label: 'ไกด์ (Guide)' },
    { value: 'driver', label: 'คนขับรถ (Driver)' },
    { value: 'warehouse', label: 'พนักงานคลังสินค้า' },
    { value: 'manager', label: 'ผู้จัดการ (Manager)' },
    { value: 'admin', label: 'ผู้ดูแลระบบ (Admin)' }
  ]
  ```

**Password:**
- **Label:** "รหัสผ่าน"
- **Placeholder:** "สร้างรหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
- **PrimeVue Component:** `<Password>`
- **Props:** `strongRegex` for password strength
- **Show Strength Meter:** Yes (built-in PrimeVue)
- **Validation:**
  - Required
  - Min Length: 8
  - Must contain: uppercase, lowercase, number

**Confirm Password:**
- **Label:** "ยืนยันรหัสผ่าน"
- **Placeholder:** "กรอกรหัสผ่านอีกครั้ง"
- **Validation:**
  - Required
  - Must match password
  - Error Message: "รหัสผ่านไม่ตรงกัน"

#### Register Button
- **Text:** "ลงทะเบียน"
- **Icon:** `pi pi-user-plus`
- **Background:** var(--primary-500)
- **Width:** 100%
- **Height:** 48px

#### Back to Login Link
- **Text:** "มีบัญชีแล้ว? เข้าสู่ระบบที่นี่"
- **Style:** Same as Register link in Login page

---

## 3. Validation & Error Handling

### Error Display
**PrimeVue Component:** `<InlineMessage>`
```vue
<InlineMessage 
  v-if="errors.username" 
  severity="error"
  class="w-full mt-2"
>
  {{ errors.username }}
</InlineMessage>
```

### Toast Notifications
**PrimeVue Component:** `<Toast>`
- **Success Message:** "เข้าสู่ระบบสำเร็จ"
- **Error Message:** "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
- **Position:** top-right
- **Life:** 3000ms

---

## 4. Responsive Design

### Mobile (< 768px)
- Card width: 90vw
- Padding: 32px 24px
- Font sizes: Reduce by 10%
- Button height: 44px

### Tablet (768px - 1024px)
- Card width: 500px
- Default spacing

### Desktop (> 1024px)
- Card width: 480px (register), 400px (login)
- Default spacing

---

## 5. Component State Management

### Vue 3 Composition API Structure
```vue
<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()

// Login Form State
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// Register Form State
const registerForm = reactive({
  fullName: '',
  email: '',
  username: '',
  phone: '',
  branchId: null,
  roleId: null,
  password: '',
  confirmPassword: ''
})

// UI State
const isLoading = ref(false)
const errors = reactive({})

// Mock Data
const branches = ref([...])
const roles = ref([...])

// Validation
const validateLogin = () => {
  // Validation logic
}

const validateRegister = () => {
  // Validation logic
}

// Handlers
const handleLogin = async () => {
  if (!validateLogin()) return
  
  isLoading.value = true
  
  // Mock API call (2 seconds delay)
  setTimeout(() => {
    isLoading.value = false
    toast.add({
      severity: 'success',
      summary: 'สำเร็จ',
      detail: 'เข้าสู่ระบบสำเร็จ',
      life: 3000
    })
    router.push('/dashboard')
  }, 2000)
}

const handleRegister = async () => {
  if (!validateRegister()) return
  
  isLoading.value = true
  
  // Mock API call
  setTimeout(() => {
    isLoading.value = false
    toast.add({
      severity: 'success',
      summary: 'สำเร็จ',
      detail: 'ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ',
      life: 3000
    })
    router.push('/login')
  }, 2000)
}
</script>
```

---

## 6. Mock Users for Testing

```javascript
// Mock user credentials for testing
const mockUsers = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    fullName: 'ผู้ดูแลระบบ',
    branch: 'สำนักงานใหญ่'
  },
  {
    username: 'sales01',
    password: 'sales123',
    role: 'sales',
    fullName: 'สมชาย ใจดี',
    branch: 'สาขากรุงเทพ'
  },
  {
    username: 'manager01',
    password: 'manager123',
    role: 'manager',
    fullName: 'สมหญิง จิตรดี',
    branch: 'สาขาเชียงใหม่'
  }
]
```

---

## 7. Animation & Transitions

### Page Transition
```vue
<template>
  <Transition name="fade">
    <div class="auth-page">
      <!-- Content -->
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### Form Input Animation
- Focus: Scale(1.01) + Shadow increase
- Error: Shake animation
- Success: Green border pulse

---

## Notes for Claude Code
1. ใช้ Vue 3 Composition API (`<script setup>`)
2. Import PrimeVue components ที่จำเป็น
3. สร้าง validation functions แยกเป็น composable
4. Mock API calls ด้วย setTimeout (2 seconds)
5. ใช้ PrimeVue Toast สำหรับ notifications
6. เก็บ user session ใน localStorage (ถ้าเลือก Remember Me)
7. Redirect ไป /dashboard หลัง login สำเร็จ
8. ใช้ router.push() สำหรับ navigation
9. Clear form หลัง register สำเร็จ
10. Show loading state ขณะ processing

---

## 8. Accessibility Features
- **Tab Navigation:** ทุก input/button สามารถ navigate ด้วย Tab key
- **Enter Key:** กด Enter ใน input สุดท้ายจะ submit form
- **Focus Management:** Auto focus ที่ first input เมื่อเข้าหน้า
- **Screen Reader:** ใส่ aria-label ทุก input
- **Error Announcements:** Announce errors ด้วย aria-live

---

## 9. Security Considerations (Mock Implementation)
- **Password Masking:** Default hide, มีปุ่ม toggle
- **Client-side Validation:** Validate ก่อน submit
- **XSS Prevention:** ใช้ v-model แทน v-html
- **CSRF Token:** (จะใส่ใน Phase ที่มี API)

---

**Created by:** Full Stack Developer  
**Last Updated:** October 17, 2025  
**Version:** 1.0