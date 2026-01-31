# Style Guide - Gem UI Project

## 🎨 CSS/SCSS Styling Standards

---

## 📋 General Styling Principles

### 1. **ใช้ List Page Template สำหรับหน้า List Page**

**การ Import:**
```scss
@import '@/assets/styles/components/list-page-templete/index-view.scss';
@import '@/assets/styles/components/list-page-templete/search-view.scss';
@import '@/assets/styles/components/list-page-templete/data-table-view.scss';
@import '@/assets/styles/components/list-page-templete/modal-view.scss';
```

**ข้อควร:**
- ไม่ควรเขียน custom styles ซ้ำกับที่มีใน template
- ใช้ class names ที่กำหนดไว้ในระบบ
- ตัวอย่าง: `page-header`, `page-content`, `section-card`

---

## 📐 Layout & Spacing

### Page Structure

```scss
// Container หลักของหน้า
.page-name-page {
  min-height: 100vh;
  background: #f3f4f6; // สีพื้นหลัง gray-100
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

// Header หน้า
.page-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 0.75rem; // ระยะห่างจาก sections ข้างล่าง
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

// Content หลักของหน้า
.page-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; // ระยะห่างระหว่าง sections
}
```

### Standard Spacing

**ระยะห่างมาตรฐาน:**
- ระหว่าง sections: `0.75rem` (12px)
- Padding ในการ์ด: `1.5rem` (24px)
- Gap ระหว่าง elements ข้างใน: `0.5rem` - `1rem`

**⚠️ สำคัญ: ใช้ระยะห่างให้สม่ำเสมอ**
```scss
.page-header {
  margin-bottom: 0.75rem; // ต้องเท่ากับ gap ของ page-content
}

.page-content {
  gap: 0.75rem; // ต้องเท่ากับ margin-bottom ของ header
}
```

---

## 🎯 Modal Styling Standards

### 1. **Form Modals (Create/Edit)**

ใช้สำหรับ modals ที่มีฟอร์ม input เช่น Create, Edit

**Structure:**
```vue
<Dialog
  :visible="visible"
  :header="title"
  :style="{ width: '800px' }"
  class="list-form-modal"
>
  <div class="list-form">
    <!-- Form Section -->
    <div class="form-section">
      <div class="section-title">
        <i class="pi pi-building"></i>
        <span>ข้อมูลพื้นฐาน</span>
      </div>
      <div class="form-grid">
        <!-- Form Groups (2 columns) -->
        <div class="form-group">
          <label>
            ชื่อ
            <span class="required">*</span>
          </label>
          <InputText v-model="form.name" />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <!-- Full Width Field -->
        <div class="form-group form-grid-full">
          <label>ที่อยู่</label>
          <Textarea v-model="form.address" rows="3" />
        </div>
      </div>
    </div>
  </div>

  <template #footer>
    <div class="form-buttons">
      <button class="btn-cancel" @click="handleCancel">
        <i class="pi pi-times"></i>
        <span>ยกเลิก</span>
      </button>
      <button class="btn-submit" @click="handleSave">
        <i class="pi pi-check"></i>
        <span>บันทึก</span>
      </button>
    </div>
  </template>
</Dialog>
```

**Classes:**
- `.list-form-modal` - Dialog wrapper
- `.list-form` - Form container
- `.form-section` - Section wrapper
- `.section-title` - Section header with icon and pink underline
- `.form-grid` - 2-column grid (responsive)
- `.form-group` - Input field wrapper
- `.form-grid-full` - Full width field
- `.form-buttons` - Footer buttons container
- `.btn-cancel` - Gray cancel button
- `.btn-submit` - Pink gradient submit button

### 2. **Detail View Modals**

ใช้สำหรับ modals ที่แสดงข้อมูลแบบ read-only หรือมีการแก้ไขเล็กน้อย

**Structure:**
```vue
<Dialog
  :visible="visible"
  :header="title"
  :style="{ width: '700px' }"
  class="list-detail-dialog"
>
  <div class="list-detail-content">
    <!-- Header with Avatar -->
    <div class="list-detail-header">
      <div class="list-detail-avatar">
        <i class="pi pi-user"></i>
      </div>
      <div class="list-detail-title-group">
        <h3>ชื่อ นามสกุล</h3>
        <p class="list-detail-subtitle">@username</p>
      </div>
      <div class="list-detail-status-badge">
        <Tag value="ใช้งาน" severity="success" />
      </div>
    </div>

    <!-- Information Sections -->
    <div class="list-detail-sections">
      <div class="list-detail-section">
        <h4 class="list-detail-section-title">
          <i class="pi pi-info-circle"></i>
          ข้อมูลติดต่อ
        </h4>
        <div class="list-detail-info-grid">
          <div class="list-detail-info-item">
            <label>อีเมล</label>
            <div class="list-detail-info-value">
              <i class="pi pi-envelope"></i>
              <span>email@example.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <template #footer>
    <div class="list-detail-footer">
      <Button label="ปิด" @click="close" />
    </div>
  </template>
</Dialog>
```

**Classes:**
- `.list-detail-dialog` - Dialog wrapper with pink gradient header
- `.list-detail-content` - Main content wrapper
- `.list-detail-header` - Header section with avatar
- `.list-detail-avatar` - Avatar circle with pink gradient
- `.list-detail-title-group` - Title and subtitle
- `.list-detail-sections` - Sections container
- `.list-detail-section` - Individual section with light gray background
- `.list-detail-section-title` - Section title with icon and **pink underline**
- `.list-detail-info-grid` - Grid layout for info items
- `.list-detail-info-item` - Single info field
- `.list-detail-info-value` - Value container with icon

---

## 📊 Table & DataTable Standards

### 1. **Using PrimeVue DataTable**

**สำคัญ:** ใช้ DataTable component จาก `@/components/prime-vue/data-table.vue` แทน HTML table ธรรมดา

**Structure:**
```vue
<DataTable
  :items="items"
  :columns="columns"
  data-key="id"
  :paginator="false"
  :show-gridlines="true"
  scroll-height="300px"
  empty-message="ไม่พบข้อมูล"
>
  <!-- Custom Templates -->
  <template #fieldNameTemplate="{ data }">
    <!-- Custom content -->
  </template>
</DataTable>
```

### 2. **Compact Table Sizing for Page Focus**

**หลักการ:** ทำให้ element ต่างๆ มีขนาดเล็กเพื่อให้สามารถเห็นข้อมูลทั้งหมดใน 1 page focus โดยไม่ต้อง scroll มาก

**Font Sizes (Compact):**
```scss
// Table content
.data-table-container {
  :deep(.base-datatable) {
    .p-datatable {
      font-size: 0.75rem; // 12px - ขนาดหลักของตาราง
    }
  }
}

// Form labels
label {
  font-size: 0.75rem; // 12px
  font-weight: 600;
}

// Input fields
input, select, textarea {
  font-size: 0.75rem; // 12px
  padding: 0.25rem 0.5rem; // ลด padding
}

// Buttons
button {
  font-size: 0.75rem; // 12px
  padding: 0.375rem 0.875rem;
}

// Section titles
.section-title {
  font-size: 0.875rem; // 14px
  margin-bottom: 0.625rem; // ลดระยะห่าง
}
```

**Element Heights (Compact):**
```scss
// Input fields
input, select {
  min-height: 30px;
  height: 30px;
}

// Buttons
button {
  height: 30px;
}

// Table rows
.p-datatable-tbody > tr > td {
  padding: 0.5rem 0.625rem; // ลด padding
}
```

**Spacing (Compact):**
```scss
// ระยะห่างระหว่าง sections
.component-section {
  margin-bottom: 0.75rem; // 12px แทน 1.5rem
  padding: 0.75rem; // 12px แทน 1.5rem
}

// Form grid gaps
.form-grid-compact {
  gap: 0.625rem; // 10px แทน 1.25rem
}

// Section card padding
.section-card {
  padding: 0.75rem; // 12px แทน 2rem
}
```

### 3. **DataTable Scroll Heights**

**แนะนำความสูงตาม context:**
```scss
// สำหรับ table ย่อย (gold, gem, labor)
scroll-height="300px"

// สำหรับ summary table หลัก
scroll-height="400px"

// สำหรับ main data table ในหน้า list
scroll-height="calc(100vh - 340px)"
```

### 4. **Form Grid Pattern (Compact)**

```scss
.form-grid-compact {
  display: grid;
  grid-template-columns: repeat(5, 1fr); // 5 columns สำหรับข้อมูลเยอะ
  gap: 0.625rem; // 10px

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}
```

### 5. **Column Configuration**

**ตัวอย่าง columns config สำหรับ DataTable:**
```javascript
computed: {
  columns() {
    return [
      {
        field: 'name',
        header: 'ชื่อ',
        width: '150px', // กำหนดความกว้างเพื่อควบคุม layout
        align: 'left'
      },
      {
        field: 'price',
        header: 'ราคา',
        width: '100px',
        align: 'right',
        format: 'currency' // Auto format
      },
      {
        field: 'weight',
        header: 'น้ำหนัก',
        width: '90px',
        align: 'right',
        format: 'decimal2'
      },
      {
        field: 'actions',
        header: 'จัดการ',
        width: '70px',
        align: 'center'
      }
    ]
  }
}
```

### 6. **Badge & Status Indicators (Compact)**

```scss
// Type badges
.type-badge {
  display: inline-block;
  padding: 0.125rem 0.375rem; // เล็กลง
  border-radius: 4px;
  font-size: 0.6875rem; // 11px
  font-weight: 600;
}

// Formula badges
.formula-badge {
  padding: 0.125rem 0.375rem;
  font-size: 0.6875rem; // 11px
}

// Icon buttons
.btn-delete {
  padding: 0.25rem 0.375rem; // เล็กลง

  i {
    font-size: 0.6875rem; // 11px
  }
}
```

### 7. **Summary Footer Pattern**

```scss
.summary-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);

  .footer-label {
    font-size: 0.875rem; // 14px
    font-weight: 700;
    color: black;
  }

  .footer-total {
    font-size: 1rem; // 16px - เน้นเล็กน้อย
    font-weight: 700;
    color: black;
  }
}
```

### ✅ Page Focus Checklist

เมื่อออกแบบหน้าที่ต้องแสดงข้อมูลเยอะ:

- [ ] ใช้ DataTable แทน HTML table
- [ ] Font size หลักที่ `0.75rem` (12px)
- [ ] Input/Button height ที่ `30px`
- [ ] Section padding ที่ `0.75rem` (12px)
- [ ] Form grid gap ที่ `0.625rem` (10px)
- [ ] กำหนด scroll-height สำหรับ tables
- [ ] กำหนด width สำหรับทุก column
- [ ] ใช้ format auto สำหรับตัวเลขและสกุลเงิน
- [ ] Badge และ icon มีขนาดเล็ก (`0.6875rem`)
- [ ] ทดสอบใน 1 page focus view (ไม่ควรต้อง scroll เยอะ)

---

## 🎨 Colors

### Primary Colors (Light Gold/Jewelry Theme)
```scss
// ตามไฟล์ variables.css
$primary-50: #faf9f0;
$primary-100: #f5f3e1;
$primary-200: #efe9c9;      // Lighter Gold
$primary-300: #e7de99;      // Base Gold (Main brand color)
$primary-400: #dfd070;      // Medium Gold
$primary-500: #d7c247;      // Deeper Gold
$primary-600: #c0ab28;      // Dark Gold (for hover)
$primary-700: #91801e;      // Darker Gold
$primary-800: #615514;
$primary-900: #302b0a;

// Primary color for use
$primary: #e7de99;          // Base Gold
$primary-hover: #c0ab28;    // Dark Gold for hover states
$primary-light: rgba(231, 222, 153, 0.1); // Light gold with transparency
```

### Neutral Colors
```scss
$gray-50: #f9fafb;
$gray-100: #f3f4f6;
$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-400: #9ca3af;
$gray-500: #6b7280;
$gray-600: #4b5563;
$gray-700: #374151;
$gray-800: #1f2937;
$gray-900: #111827;
```

### Status Colors
```scss
$success: #10b981;
$warning: #f59e0b;
$error: #ef4444;  // Changed from $danger
$info: #3b82f6;
```

### Color Usage Guidelines

**DO:**
- ใช้ `#e7de99` (Base Gold) สำหรับ primary elements: buttons, icons, borders, chips
- ใช้ `#efe9c9` (Lighter Gold) สำหรับ gradients และ backgrounds
- ใช้ `#c0ab28` (Dark Gold) สำหรับ hover states
- ใช้ `#91801e` (Darker Gold) สำหรับ active/pressed states

**DON'T:**
- ❌ ห้ามใช้สีชมพู (#ff69b4) - ไม่ใช่สีของ Jewelry theme
- ❌ ห้ามใช้สีส้ม (#f58511) - เป็นสีเก่าที่เปลี่ยนไปแล้ว
- ❌ ห้ามใช้สีอื่นที่ไม่ใช่สีใน palette ที่กำหนด
- ❌ ห้ามใช้สี custom ที่ไม่ได้มีใน variables.css

---

## 📱 Responsive Design

### Breakpoints
```scss
// Mobile
@media (max-width: 480px) { }

// Tablet
@media (max-width: 768px) { }

// Desktop
@media (min-width: 769px) { }
```

### Grid Responsive Pattern
```scss
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```

---

## 🎯 Component Patterns

### ⚠️ IMPORTANT: ตรวจสอบ Generic Components ก่อนเสมอ

**หลักการสำคัญ:** ก่อนสร้าง component หรือเขียน style ใหม่ใน view file **ต้องตรวจสอบ generic components ก่อนเสมอ**

**ขั้นตอน:**
1. **ตรวจสอบว่ามี Generic Component อยู่แล้วหรือไม่** ที่ `/src/components/prime-vue/`
   - InputChips
   - MultiSelect
   - AutoComplete
   - Calendar
   - DataTable
   - InputText
   - Textarea
   - และอื่นๆ

2. **ถ้ามี Generic Component อยู่แล้ว:**
   - ✅ **ใช้ component ที่มีอยู่** โดยการ import จาก `@/components/prime-vue/`
   - ❌ **ห้าม** import จาก `primevue/` โดยตรง
   - ❌ **ห้าม** เขียน style ซ้ำใน view file

3. **ถ้าไม่มี Generic Component:**
   - สร้าง generic component ใหม่ที่ `/src/components/prime-vue/`
   - ใช้ Options API (ตาม SKILL.md)
   - ใส่ style แบบ compact (30px height, 12px font)
   - ใช้สีทอง Gold theme (#e7de99, #efe9c9)
   - จากนั้นเรียกใช้ใน view file

**ตัวอย่าง:**

```vue
<!-- ❌ WRONG - Import จาก PrimeVue โดยตรง -->
<script>
import MultiSelect from 'primevue/multiselect'
</script>

<template>
  <MultiSelect v-model="value" :options="options" />
</template>

<style scoped>
:deep(.p-multiselect) {
  // เขียน style ซ้ำทุกไฟล์
}
</style>

<!-- ✅ CORRECT - ใช้ Generic Component -->
<script>
import MultiSelect from '@/components/prime-vue/multi-select.vue'
</script>

<template>
  <MultiSelect v-model="value" :options="options" />
</template>
```

**ประโยชน์:**
- ✅ Style สม่ำเสมอทั้งโปรเจค
- ✅ ไม่ต้องเขียน style ซ้ำ
- ✅ แก้ไขที่เดียว ใช้ได้ทั้งระบบ
- ✅ ลด code duplication
- ✅ บำรุงรักษาง่าย

**Generic Components ที่มีอยู่:**
```
/src/components/prime-vue/
├── input-chips.vue       ✅ มีแล้ว
├── multi-select.vue      ✅ มีแล้ว
├── data-table.vue        ✅ มีแล้ว
└── ... (ตรวจสอบโฟลเดอร์ก่อนสร้างใหม่)
```

---

### Section Title with Underline

**สำคัญ:** ทุก section title ต้องมี border-bottom สีทอง

```scss
.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e7de99; // ⭐ สีทอง (Gold)
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1.25rem;
    color: #e7de99; // ⭐ icon สีทอง (Gold)
  }
}
```

### Form Buttons

```scss
.form-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  .btn-cancel {
    padding: 0.75rem 1.5rem;
    background: white;
    color: #6b7280;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }
  }

  .btn-submit {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%); // ⭐ สีทอง (Gold)
    color: #1f2937; // Text color dark
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: linear-gradient(135deg, #dfd070 0%, #dfd070 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
```

### Input Focus States

```scss
input, textarea, select {
  &:focus {
    outline: none;
    border-color: #e7de99; // ⭐ สีทอง (Gold)
    box-shadow: 0 0 0 3px rgba(231, 222, 153, 0.1);
  }
}
```

---

## 📦 Shadow & Border Radius

### Shadows
```scss
// Subtle shadow for cards
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

// Medium shadow for elevated cards
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

// Strong shadow for modals
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);

// Gold shadow for buttons
box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
```

### Border Radius
```scss
// Standard card
border-radius: 12px;

// Small elements (buttons, tags)
border-radius: 8px;

// Input fields
border-radius: 6px;
```

---

## ✅ Checklist

เมื่อสร้าง styles ใหม่ ต้องตรวจสอบ:

- [ ] **ตรวจสอบ Generic Components ก่อน** ที่ `/src/components/prime-vue/`
- [ ] ถ้ามี generic component แล้ว ต้องใช้แทน (ห้าม import จาก primevue โดยตรง)
- [ ] ถ้าไม่มี generic component ต้องสร้างใหม่ที่ `/src/components/prime-vue/` ก่อน
- [ ] Import list-page-template ถ้าเป็นหน้า list
- [ ] ใช้ระยะห่างระหว่าง sections ให้สม่ำเสมอ (0.75rem)
- [ ] ใช้สีทอง (#e7de99) เป็น primary color
- [ ] Section title มี border-bottom สีทอง
- [ ] Icon ใช้สีทอง
- [ ] Form modals ใช้ `.list-form-modal` และ structure ที่กำหนด
- [ ] Detail modals ใช้ `.list-detail-dialog` และ structure ที่กำหนด
- [ ] Buttons ใช้ gradient สีทอง
- [ ] Input focus states ใช้สีทอง
- [ ] Responsive design สำหรับ mobile/tablet
- [ ] Shadow และ border-radius ตามมาตรฐาน
- [ ] Class names ชัดเจนและสื่อความหมาย

---

## 🚫 ข้อห้าม (DON'Ts)

### ❌ ห้าม Import PrimeVue Components โดยตรง
```vue
// ❌ WRONG - Import จาก PrimeVue โดยตรง
<script>
import MultiSelect from 'primevue/multiselect'
import InputChips from 'primevue/inputchips'
import AutoComplete from 'primevue/autocomplete'
</script>

<style scoped>
// แล้วเขียน style ซ้ำทุกไฟล์
:deep(.p-multiselect) {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
</style>

// ✅ CORRECT - ใช้ Generic Component
<script>
import MultiSelect from '@/components/prime-vue/multi-select.vue'
import InputChips from '@/components/prime-vue/input-chips.vue'
import AutoComplete from '@/components/prime-vue/auto-complete.vue'
</script>

// ไม่ต้องเขียน style ซ้ำ! Component มี style อยู่แล้ว
```

### ❌ ห้ามใช้สีเก่า
```scss
// ❌ WRONG - สีเก่า (ส้ม)
$primary: #f58511;
border-bottom: 2px solid #f58511;
background: linear-gradient(135deg, #f58511 0%, #ff9a3c 100%);

// ❌ WRONG - สีชมพู (ไม่ใช่สีของ Jewelry theme)
$primary: #ff69b4;
border-bottom: 2px solid #ff69b4;
background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);

// ✅ CORRECT - สีทอง (Gold/Jewelry theme)
$primary: #e7de99;
border-bottom: 2px solid #e7de99;
background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%);
```

### ❌ ห้าม Section Title ไม่มี Underline
```scss
// ❌ WRONG
.section-title {
  display: flex;
  align-items: center;
  margin: 0 0 1rem 0;
  // ไม่มี border-bottom!
}

// ✅ CORRECT
.section-title {
  display: flex;
  align-items: center;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e7de99; // ⭐ จำเป็น! สีทอง
}
```

### ❌ ห้ามใช้ Modal Class ผิด
```scss
// ❌ WRONG - ใช้ class ผิดประเภท
// Form modal ใช้ list-detail-dialog
<Dialog class="list-detail-dialog">
  <div class="list-form">...</div>
</Dialog>

// ✅ CORRECT
<Dialog class="list-form-modal">
  <div class="list-form">...</div>
</Dialog>
```

---

## 📚 Template Import Guide

### สำหรับหน้า List
```scss
@import '@/assets/styles/components/list-page-templete/index-view.scss';
@import '@/assets/styles/components/list-page-templete/search-view.scss';
@import '@/assets/styles/components/list-page-templete/data-table-view.scss';
```

### สำหรับ Modals
```scss
@import '@/assets/styles/components/list-page-templete/modal-view.scss';
```

### สำหรับหน้าทั่วไป (Settings, Profile, etc.)
```scss
// ใช้เฉพาะ style ที่จำเป็น
// ตั้งชื่อ class ตามชื่อหน้า เช่น .profile-page, .settings-page
```

---

## 📝 Version History

**Version 3.1** - 2025-01-30
- ✨ เพิ่มหัวข้อ "ตรวจสอบ Generic Components ก่อนเสมอ"
- ✨ เพิ่มแนวทางการใช้งาน generic components จาก `/src/components/prime-vue/`
- ✨ เพิ่มข้อห้าม: ห้าม import จาก PrimeVue โดยตรง
- ✨ อัปเดต Checklist ให้ตรวจสอบ generic components ก่อน
- 📋 เพิ่มตัวอย่าง WRONG vs CORRECT สำหรับการใช้ generic components

**Version 3.0** - 2025-01-30
- 🎨 สีหลักเปลี่ยนเป็นสีทอง Light Gold (#e7de99) สำหรับ Jewelry theme
- 📦 อัปเดตทุก color reference ตาม variables.css
- 🚫 เพิ่มข้อห้ามใช้สีชมพูและสีเก่า

---

**Last Updated:** 2025-01-30
**Version:** 3.1 (Generic Components Guidelines)
**Breaking Changes:**
- ต้องใช้ generic components จาก `/src/components/prime-vue/` แทนการ import จาก PrimeVue โดยตรง
- สีหลักเปลี่ยนเป็นสีทอง Light Gold (#e7de99) สำหรับ Jewelry theme ตาม variables.css
