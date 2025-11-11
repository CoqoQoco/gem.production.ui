# UI Specification: Reusable Components

## 1. AppHeader Component

### Purpose
Header bar สำหรับทุกหน้าหลัง login

### Props
```typescript
interface AppHeaderProps {
  user: {
    name: string
    fullName: string
    role: string
    avatar: string
    branch: string
  }
  notifications: Array<Notification>
}
```

### Template
```vue
<template>
  <div class="app-header">
    <div class="header-left">
      <img src="/logo.png" alt="Logo" class="header-logo" />
      <span class="header-brand">ระบบจัดการร้านจิวเวลรี่</span>
    </div>
    
    <div class="header-right">
      <!-- Notification Bell -->
      <Button 
        icon="pi pi-bell" 
        text 
        rounded
        @click="toggleNotifications"
        class="p-button-rounded p-button-text"
      >
        <Badge v-if="unreadCount > 0" :value="unreadCount" severity="danger" />
      </Button>
      
      <!-- User Menu -->
      <div class="user-menu">
        <Avatar 
          :label="user.avatar"
          shape="circle"
          style="background-color: var(--primary-500); color: white"
          @click="toggleUserMenu"
        />
        <span class="user-name">{{ user.fullName }}</span>
        <i class="pi pi-angle-down"></i>
      </div>
      
      <!-- Logout Button -->
      <Button 
        label="ออกจากระบบ"
        icon="pi pi-sign-out"
        severity="danger"
        outlined
        @click="$emit('logout')"
      />
    </div>
    
    <!-- Notification Panel -->
    <OverlayPanel ref="notificationPanel">
      <div class="notification-panel">
        <h4>การแจ้งเตือน</h4>
        <div v-for="notif in notifications" :key="notif.id" class="notification-item">
          <i class="pi pi-info-circle"></i>
          <div>
            <p>{{ notif.message }}</p>
            <small>{{ notif.time }}</small>
          </div>
        </div>
      </div>
    </OverlayPanel>
    
    <!-- User Menu Panel -->
    <Menu ref="userMenuPanel" :model="userMenuItems" :popup="true" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['user', 'notifications'])
const emit = defineEmits(['logout'])

const notificationPanel = ref()
const userMenuPanel = ref()

const unreadCount = computed(() => props.notifications?.length || 0)

const userMenuItems = [
  {
    label: 'โปรไฟล์',
    icon: 'pi pi-user',
    command: () => console.log('Profile')
  },
  {
    label: 'ตั้งค่า',
    icon: 'pi pi-cog',
    command: () => console.log('Settings')
  },
  {
    separator: true
  },
  {
    label: 'ออกจากระบบ',
    icon: 'pi pi-sign-out',
    command: () => emit('logout')
  }
]

const toggleNotifications = (event) => {
  notificationPanel.value.toggle(event)
}

const toggleUserMenu = (event) => {
  userMenuPanel.value.toggle(event)
}
</script>

<style scoped>
.app-header {
  height: 64px;
  background: white;
  border-bottom: 1px solid var(--gray-200);
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo {
  width: 40px;
  height: 40px;
}

.header-brand {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-600);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-menu:hover {
  background: var(--gray-100);
}

.user-name {
  font-weight: 500;
  color: var(--gray-900);
}

.notification-panel {
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid var(--gray-200);
}

.notification-item:last-child {
  border-bottom: none;
}
</style>
```

---

## 2. StatsCard Component

### Purpose
Card แสดงสถิติแบบ Quick Stats

### Props
```typescript
interface StatsCardProps {
  stat: {
    id: string
    icon: string
    label: string
    value: string
    change: string
    trend: 'up' | 'down' | 'neutral'
    accentColor?: string
  }
}
```

### Template
```vue
<template>
  <div class="stats-card" @click="$emit('click')">
    <div class="stats-icon-container" :style="{ background: accentBg }">
      <span class="stats-icon">{{ stat.icon }}</span>
    </div>
    
    <div class="stats-content">
      <p class="stats-label">{{ stat.label }}</p>
      <h3 class="stats-value">{{ stat.value }}</h3>
      
      <div class="stats-change" :class="`trend-${stat.trend}`">
        <i :class="trendIcon"></i>
        <span>{{ stat.change }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['stat'])
const emit = defineEmits(['click'])

const accentBg = computed(() => {
  return props.stat.accentColor 
    ? `${props.stat.accentColor}15` 
    : 'var(--primary-50)'
})

const trendIcon = computed(() => {
  switch(props.stat.trend) {
    case 'up': return 'pi pi-arrow-up'
    case 'down': return 'pi pi-arrow-down'
    default: return 'pi pi-minus'
  }
})
</script>

<style scoped>
.stats-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stats-icon-container {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.stats-icon {
  font-size: 32px;
}

.stats-label {
  font-size: 14px;
  color: var(--gray-600);
  margin-bottom: 8px;
}

.stats-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 8px;
}

.stats-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}

.trend-up {
  color: var(--success);
}

.trend-down {
  color: var(--error);
}

.trend-neutral {
  color: var(--gray-500);
}
</style>
```

---

## 3. ModuleCard Component

### Purpose
Card สำหรับแสดง Module ต่างๆ ใน Dashboard

### Props
```typescript
interface ModuleCardProps {
  module: {
    id: string
    icon: string
    iconEmoji: string
    title: string
    subtitle: string
    description: string
    features: string[]
    route: string
    color: string
    accentColor: string
  }
}
```

### Template
```vue
<template>
  <div class="module-card" @click="$emit('navigate', module.route)">
    <div class="module-header">
      <div class="module-icon-container" :style="{ background: accentBg }">
        <i :class="module.icon" :style="{ color: module.accentColor }"></i>
        <!-- or -->
        <span class="module-emoji">{{ module.iconEmoji }}</span>
      </div>
      
      <h3 class="module-title">{{ module.title }}</h3>
      <p class="module-subtitle">{{ module.subtitle }}</p>
    </div>
    
    <div class="module-body">
      <p class="module-description">{{ module.description }}</p>
      
      <ul class="module-features">
        <li v-for="(feature, index) in module.features" :key="index">
          <i class="pi pi-check-circle" :style="{ color: module.accentColor }"></i>
          <span>{{ feature }}</span>
        </li>
      </ul>
    </div>
    
    <div class="module-footer">
      <Button 
        label="เข้าสู่ระบบ"
        icon="pi pi-arrow-right"
        iconPos="right"
        outlined
        class="w-full"
        :style="{ 
          borderColor: module.accentColor, 
          color: module.accentColor 
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['module'])
const emit = defineEmits(['navigate'])

const accentBg = computed(() => `${props.module.accentColor}15`)
</script>

<style scoped>
.module-card {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  padding: 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.module-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary-500);
  box-shadow: var(--shadow-xl);
}

.module-icon-container {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.module-icon-container i {
  font-size: 32px;
}

.module-emoji {
  font-size: 36px;
}

.module-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 4px;
}

.module-subtitle {
  font-size: 14px;
  color: var(--gray-500);
  margin-bottom: 16px;
}

.module-description {
  font-size: 14px;
  color: var(--gray-700);
  margin-bottom: 16px;
}

.module-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  flex-grow: 1;
}

.module-features li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--gray-700);
}

.module-features li i {
  margin-top: 2px;
  flex-shrink: 0;
}

.module-footer {
  margin-top: auto;
}
</style>
```

---

## 4. WelcomeSection Component

### Purpose
Section ต้อนรับผู้ใช้ในหน้า Dashboard

### Props
```typescript
interface WelcomeSectionProps {
  user: {
    fullName: string
  }
  branch: {
    name: string
  }
}
```

### Template
```vue
<template>
  <div class="welcome-section">
    <div class="welcome-content">
      <h1 class="welcome-title">
        สวัสดี, คุณ{{ user.fullName }} 👋
      </h1>
      <p class="welcome-subtitle">
        <i class="pi pi-map-marker"></i>
        <span>{{ branch.name }}</span>
        <span class="separator">|</span>
        <i class="pi pi-calendar"></i>
        <span>{{ currentDate }}</span>
      </p>
    </div>
    
    <div class="welcome-actions">
      <Button 
        label="ดูรายงานวันนี้"
        icon="pi pi-chart-line"
        outlined
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['user', 'branch'])

const currentDate = computed(() => {
  const date = new Date()
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return date.toLocaleDateString('th-TH', options)
})
</script>

<style scoped>
.welcome-section {
  background: linear-gradient(135deg, 
    rgba(245, 133, 17, 0.05) 0%, 
    rgba(98, 125, 152, 0.05) 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 8px;
}

.welcome-subtitle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: var(--gray-600);
}

.separator {
  color: var(--gray-400);
}

@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
```

---

## 5. PageHeader Component

### Purpose
Header สำหรับหน้า Sub-pages พร้อม Breadcrumb

### Props
```typescript
interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ label: string, to?: string }>
  actions?: boolean
}
```

### Template
```vue
<template>
  <div class="page-header">
    <div class="page-header-top">
      <Breadcrumb v-if="breadcrumbs" :model="breadcrumbs" />
    </div>
    
    <div class="page-header-content">
      <div class="page-header-text">
        <h1 class="page-title">{{ title }}</h1>
        <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
      </div>
      
      <div v-if="$slots.actions" class="page-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['title', 'subtitle', 'breadcrumbs'])
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

.page-header-top {
  margin-bottom: 16px;
}

.page-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 16px;
  color: var(--gray-600);
}

.page-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 768px) {
  .page-header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .page-actions {
    width: 100%;
  }
}
</style>
```

---

## 6. EmptyState Component

### Purpose
แสดงเมื่อไม่มีข้อมูล

### Props
```typescript
interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
}
```

### Template
```vue
<template>
  <div class="empty-state">
    <i :class="icon || 'pi pi-inbox'" class="empty-icon"></i>
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="description" class="empty-description">{{ description }}</p>
    
    <Button 
      v-if="actionLabel"
      :label="actionLabel"
      icon="pi pi-plus"
      @click="$emit('action')"
      class="mt-4"
    />
  </div>
</template>

<script setup>
defineProps(['icon', 'title', 'description', 'actionLabel'])
defineEmits(['action'])
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: var(--gray-400);
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: var(--gray-600);
  max-width: 400px;
}
</style>
```

---

## 7. LoadingSpinner Component

### Purpose
แสดง Loading state

### Props
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
}
```

### Template
```vue
<template>
  <div class="loading-spinner">
    <ProgressSpinner 
      :style="{ width: spinnerSize, height: spinnerSize }"
      strokeWidth="4"
      fill="transparent"
      animationDuration="1s"
    />
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium'
  },
  text: String
})

const spinnerSize = computed(() => {
  switch(props.size) {
    case 'small': return '32px'
    case 'large': return '64px'
    default: return '48px'
  }
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.loading-text {
  margin-top: 16px;
  font-size: 14px;
  color: var(--gray-600);
}
</style>
```

---

## 8. ConfirmDialog Component

### Purpose
Dialog สำหรับยืนยันการกระทำ

### Usage
```vue
<script setup>
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()

const handleDelete = () => {
  confirm.require({
    message: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?',
    header: 'ยืนยันการลบ',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'ใช่, ลบเลย',
    rejectLabel: 'ยกเลิก',
    acceptClass: 'p-button-danger',
    accept: () => {
      // Delete logic
    }
  })
}
</script>

<template>
  <ConfirmDialog />
  <Button label="ลบ" @click="handleDelete" severity="danger" />
</template>
```

---

## 9. DataTable Component Wrapper

### Purpose
Wrapper สำหรับ PrimeVue DataTable พร้อม features พื้นฐาน

### Template
```vue
<template>
  <div class="data-table-wrapper">
    <DataTable
      :value="data"
      :loading="loading"
      :paginator="paginator"
      :rows="rows"
      :totalRecords="totalRecords"
      :lazy="lazy"
      @page="onPage"
      @sort="onSort"
      @filter="onFilter"
      filterDisplay="row"
      :globalFilterFields="globalFilterFields"
      responsiveLayout="scroll"
      stripedRows
      showGridlines
      :resizableColumns="true"
      columnResizeMode="expand"
    >
      <template #header>
        <div class="table-header">
          <span class="table-title">{{ title }}</span>
          <div class="table-actions">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText 
                v-model="filters['global'].value"
                placeholder="ค้นหา..." 
              />
            </span>
            <Button 
              v-if="showAdd"
              label="เพิ่มข้อมูล"
              icon="pi pi-plus"
              @click="$emit('add')"
            />
          </div>
        </div>
      </template>
      
      <template #empty>
        <EmptyState 
          title="ไม่พบข้อมูล"
          description="ยังไม่มีข้อมูลในตารางนี้"
        />
      </template>
      
      <template #loading>
        <LoadingSpinner text="กำลังโหลดข้อมูล..." />
      </template>
      
      <slot></slot>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  data: Array,
  loading: Boolean,
  title: String,
  paginator: {
    type: Boolean,
    default: true
  },
  rows: {
    type: Number,
    default: 10
  },
  totalRecords: Number,
  lazy: Boolean,
  showAdd: Boolean,
  globalFilterFields: Array
})

const emit = defineEmits(['page', 'sort', 'filter', 'add'])

const filters = ref({
  global: { value: null }
})

const onPage = (event) => emit('page', event)
const onSort = (event) => emit('sort', event)
const onFilter = (event) => emit('filter', event)
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-900);
}

.table-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
```

---

## 10. FormField Component

### Purpose
Wrapper สำหรับ form fields พร้อม label และ validation

### Template
```vue
<template>
  <div class="form-field" :class="{ 'has-error': error }">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <slot></slot>
    
    <small v-if="error" class="p-error">{{ error }}</small>
    <small v-else-if="hint" class="form-hint">{{ hint }}</small>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  inputId: String,
  required: Boolean,
  error: String,
  hint: String
})
</script>

<style scoped>
.form-field {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--gray-900);
  font-size: 14px;
}

.required-mark {
  color: var(--error);
  margin-left: 4px;
}

.form-hint {
  display: block;
  margin-top: 4px;
  color: var(--gray-600);
  font-size: 12px;
}

.has-error .form-label {
  color: var(--error);
}
</style>
```

### Usage Example
```vue
<FormField 
  label="ชื่อผู้ใช้" 
  inputId="username"
  :required="true"
  :error="errors.username"
  hint="ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร"
>
  <InputText 
    id="username"
    v-model="form.username"
    :class="{ 'p-invalid': errors.username }"
  />
</FormField>
```

---

## 11. ActionButtons Component

### Purpose
ปุ่มสำหรับ actions ทั่วไป (Edit, Delete, View)

### Template
```vue
<template>
  <div class="action-buttons">
    <Button 
      v-if="showView"
      icon="pi pi-eye"
      severity="info"
      text
      rounded
      v-tooltip.top="'ดูรายละเอียด'"
      @click="$emit('view')"
    />
    
    <Button 
      v-if="showEdit"
      icon="pi pi-pencil"
      severity="warning"
      text
      rounded
      v-tooltip.top="'แก้ไข'"
      @click="$emit('edit')"
    />
    
    <Button 
      v-if="showDelete"
      icon="pi pi-trash"
      severity="danger"
      text
      rounded
      v-tooltip.top="'ลบ'"
      @click="$emit('delete')"
    />
  </div>
</template>

<script setup>
defineProps({
  showView: {
    type: Boolean,
    default: true
  },
  showEdit: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: true
  }
})

defineEmits(['view', 'edit', 'delete'])
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}
</style>
```

---

## Component Library Summary

### Import Map
```javascript
// components/index.js
export { default as AppHeader } from './AppHeader.vue'
export { default as StatsCard } from './StatsCard.vue'
export { default as ModuleCard } from './ModuleCard.vue'
export { default as WelcomeSection } from './WelcomeSection.vue'
export { default as PageHeader } from './PageHeader.vue'
export { default as EmptyState } from './EmptyState.vue'
export { default as LoadingSpinner } from './LoadingSpinner.vue'
export { default as DataTableWrapper } from './DataTableWrapper.vue'
export { default as FormField } from './FormField.vue'
export { default as ActionButtons } from './ActionButtons.vue'
```

### Global Registration (Optional)
```javascript
// main.js
import { 
  AppHeader, 
  StatsCard, 
  ModuleCard,
  // ... other components
} from './components'

app.component('AppHeader', AppHeader)
app.component('StatsCard', StatsCard)
app.component('ModuleCard', ModuleCard)
// ...
```

---

**Created by:** Full Stack Developer  
**Last Updated:** October 17, 2025  
**Version:** 1.0Overview
รวม Reusable Components ที่ใช้ร่วมกันทั้งระบบ เพื่อความสม่ำเสมอและง่ายต่อการ maintain

---

## 