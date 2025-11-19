# Adjust Role Router Feature

## Overview
Feature สำหรับจัดการสิทธิ์การเข้าถึง Router สำหรับแต่ละ Role ในระบบ

## Location
- **View**: `src/views/setting/adjust-role-router/adjust-role-router-view.vue`
- **Store**: `src/stores/api/role-api.js`
- **Utility**: `src/utils/routerHelper.js`
- **Route**: `/setting/adjust-role-router`

---

## Features

### 1. Role Selection
- ดึงรายการ Roles ทั้งหมดจาก API
- Filter เฉพาะ Active roles
- แสดงข้อมูล Role ที่เลือก (Name, Description, Level, Status)

### 2. Router List
- ดึง Routes ทั้งหมดจาก Vue Router อัตโนมัติ
- จัดกลุ่ม Routes ตาม Module
- แสดง Route Name, Title, และ Path
- Checkbox สำหรับเลือก Router แต่ละตัว

### 3. Bulk Actions
- **Select All** - เลือก Router ทั้งหมด
- **Deselect All** - ยกเลิกทั้งหมด
- **Toggle Module** - เลือก/ยกเลิกทั้ง Module

### 4. Save & Validation
- ตรวจสอบการเปลี่ยนแปลง
- แสดงจำนวน Router ที่เลือก
- Confirm ก่อน Cancel หากมีการเปลี่ยนแปลง
- บันทึกเป็น JSON array ไปยัง API

---

## Usage Flow

1. **เลือก Role**
   - เลือก Role จาก Dropdown
   - ระบบจะโหลดข้อมูล Role และ Router Permissions ปัจจุบัน

2. **ปรับแต่ง Router Permissions**
   - เลือก/ยกเลิก Router แต่ละตัว
   - หรือเลือกทั้ง Module
   - ระบบจะแสดงจำนวน Router ที่เลือก

3. **บันทึก**
   - กดปุ่ม "บันทึก"
   - ระบบจะส่งข้อมูลไป API
   - แสดง Toast notification

---

## API Integration

### role-api.js Store

#### listRoles()
```javascript
const result = await roleApiStore.listRoles({ isActiveOnly: true })
// Returns: { success, data: [], totalRecords, message }
```

#### getRole(roleId)
```javascript
const result = await roleApiStore.getRole(1)
// Returns: { 
//   success, 
//   data: {
//     roleId, roleName, description, level, 
//     isActive, isSystemRole, routerAllow: []
//   }
// }
```

#### updateRole(roleId, data)
```javascript
const result = await roleApiStore.updateRole(1, {
  routerAllow: ['Dashboard', 'AccountManagement', 'AdjustRoleRouter']
})
// Returns: { success, message }
```

---

## Router Helper Utility

### getAllRoutes()
ดึง Routes ทั้งหมดจาก Vue Router
```javascript
import { getAllRoutes } from '@/utils/routerHelper'

const routes = getAllRoutes()
// Returns: Array of route objects
```

### getRoutesForDisplay()
ดึง Routes จัดกลุ่มตาม Module สำหรับแสดงผล
```javascript
import { getRoutesForDisplay } from '@/utils/routerHelper'

const modules = getRoutesForDisplay()
// Returns: [
//   {
//     module: 'Dashboard',
//     routes: [{ name, path, title, ... }]
//   },
//   ...
// ]
```

---

## Component Structure

```vue
<template>
  <!-- Step 1: Select Role -->
  <div class="adjust-section">
    <Dropdown v-model="selectedRoleId" />
    <RoleInfo />
  </div>

  <!-- Step 2: Select Routers -->
  <div class="adjust-section">
    <SelectionToolbar />
    <RouterModules>
      <ModuleGroup>
        <ModuleCheckbox />
        <RouteCheckbox />
      </ModuleGroup>
    </RouterModules>
  </div>

  <!-- Step 3: Save -->
  <div class="adjust-section">
    <SaveButton />
    <CancelButton />
  </div>
</template>
```

---

## Data Flow

```
1. Mount
   ↓
2. Load Roles from API
   ↓
3. Load Routers from Vue Router
   ↓
4. User selects Role
   ↓
5. Load Role Details (including current routerAllow)
   ↓
6. User adjusts Router selections
   ↓
7. User clicks Save
   ↓
8. Send updated routerAllow to API
   ↓
9. Show success/error message
```

---

## State Management

### Data Properties
```javascript
data() {
  return {
    // Role data
    roleList: [],           // All roles from API
    selectedRoleId: null,   // Selected role ID
    selectedRole: null,     // Selected role object
    originalRouters: [],    // Original router permissions
    
    // Router data
    routerModules: [],      // Grouped routers
    selectedRouters: [],    // Currently selected routers
    totalRouters: 0,        // Total router count
    
    // Loading states
    isLoadingRoles: false,
    isLoadingRoleDetail: false,
    isSaving: false
  }
}
```

### Computed Properties
```javascript
computed: {
  hasChanges() {
    // Compare selectedRouters with originalRouters
  }
}
```

---

## Styling

Uses template styles from:
- `list-page-templete/index-view.scss`
- `list-page-templete/search-view.scss`
- `list-page-templete/data-table-view.scss`

Custom styles for:
- `.adjust-section` - Section containers
- `.role-selector` - Role dropdown area
- `.router-selection` - Router checkbox area
- `.module-group` - Module grouping
- `.save-section` - Save button area

---

## Example Usage

### Access the Page
```
http://localhost:5173/setting/adjust-role-router
```

### Example Workflow
1. Select "Administrator" role
2. System shows current permissions: 15 routers
3. Add "Reports" module (3 routers)
4. Total now: 18 routers
5. Click "บันทึก"
6. Success message shown

---

## Benefits

✅ **Automatic Router Discovery** - No manual router list maintenance
✅ **Module Grouping** - Easy to manage by feature area
✅ **Bulk Actions** - Quick selection/deselection
✅ **Change Detection** - Prevents accidental data loss
✅ **Real-time Validation** - Shows selected count
✅ **Clean Architecture** - Separation of concerns

---

## Future Enhancements

- [ ] Search/Filter routers
- [ ] Clone permissions from another role
- [ ] History of permission changes
- [ ] Export/Import role permissions
- [ ] Visual route tree structure

---

**Last Updated:** 2025-11-19
**Version:** 1.0
