# Alert Components

Alert components สำหรับแสดงข้อความต่างๆ โดยใช้ PrimeVue Dialog พร้อมธีมชมพูพาสเทล

## Components

1. **AlertSubmit** - แจ้งเตือนเมื่อดำเนินการสำเร็จ (สีเขียว)
2. **AlertWarning** - แจ้งเตือนคำเตือน (สีเหลือง/ส้ม)
3. **AlertError** - แจ้งเตือนข้อผิดพลาด (สีแดง)
4. **AlertConfirm** - ยืนยันการดำเนินการ (สีชมพู)

## Installation

```javascript
// Import แบบเดี่ยว
import AlertSubmit from '@/components/alert/alert-submit.vue'
import AlertWarning from '@/components/alert/alert-warning.vue'
import AlertError from '@/components/alert/alert-error.vue'
import AlertConfirm from '@/components/alert/alert-confirm.vue'

// หรือ Import แบบรวม
import { AlertSubmit, AlertWarning, AlertError, AlertConfirm } from '@/components/alert'
```

## Usage Examples

### 1. AlertSubmit (Success)

```vue
<template>
  <div>
    <button @click="showSuccess = true">Show Success</button>

    <AlertSubmit
      v-model:visible="showSuccess"
      header="บันทึกสำเร็จ"
      message="ข้อมูลของคุณได้รับการบันทึกเรียบร้อยแล้ว"
      okText="ตรวจสอบ"
      @ok="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AlertSubmit } from '@/components/alert'

const showSuccess = ref(false)

const handleSuccess = () => {
  console.log('Success confirmed!')
}
</script>
```

### 2. AlertWarning

```vue
<template>
  <div>
    <button @click="showWarning = true">Show Warning</button>

    <AlertWarning
      v-model:visible="showWarning"
      header="คำเตือน"
      message="กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนดำเนินการ"
      okText="รับทราบ"
      @ok="handleWarning"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AlertWarning } from '@/components/alert'

const showWarning = ref(false)

const handleWarning = () => {
  console.log('Warning acknowledged!')
}
</script>
```

### 3. AlertError

```vue
<template>
  <div>
    <button @click="showError = true">Show Error</button>

    <AlertError
      v-model:visible="showError"
      header="เกิดข้อผิดพลาด"
      message="ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง"
      okText="ปิด"
      @ok="handleError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AlertError } from '@/components/alert'

const showError = ref(false)

const handleError = () => {
  console.log('Error dismissed!')
}
</script>
```

### 4. AlertConfirm

```vue
<template>
  <div>
    <button @click="showConfirm = true">Delete Item</button>

    <AlertConfirm
      v-model:visible="showConfirm"
      header="ยืนยันการลบ"
      message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
      confirmText="ยืนยันลบ"
      cancelText="ยกเลิก"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AlertConfirm } from '@/components/alert'

const showConfirm = ref(false)

const handleConfirm = () => {
  console.log('Delete confirmed!')
  // ทำการลบข้อมูล
}

const handleCancel = () => {
  console.log('Delete cancelled!')
}
</script>
```

### 5. Custom Content with Slots

```vue
<template>
  <AlertWarning
    v-model:visible="showWarning"
    header="คำเตือนสำคัญ"
  >
    <div class="custom-content">
      <ul>
        <li>ข้อมูลบางรายการอาจสูญหาย</li>
        <li>กรุณาสำรองข้อมูลก่อนดำเนินการ</li>
        <li>ระบบจะล็อกเป็นเวลา 5 นาที</li>
      </ul>
    </div>
  </AlertWarning>
</template>

<style scoped>
.custom-content {
  margin-top: 1rem;
  text-align: left;
}

.custom-content ul {
  padding-left: 1.5rem;
  color: #6b7280;
}

.custom-content li {
  margin-bottom: 0.5rem;
}
</style>
```

## Props

### Common Props (ทุก Components)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | Boolean | `false` | แสดง/ซ่อน dialog (ใช้กับ v-model:visible) |
| `header` | String | varies | หัวข้อของ dialog |
| `message` | String | varies | ข้อความหลัก |
| `width` | String | `'450px'` | ความกว้างของ dialog |
| `dismissableMask` | Boolean | `true` | คลิกนอก dialog เพื่อปิด |
| `closable` | Boolean | `true` | แสดงปุ่ม X เพื่อปิด |

### AlertSubmit Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `okText` | String | `'ตรวจสอบ'` | ข้อความบนปุ่ม OK |

### AlertWarning Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `okText` | String | `'รับทราบ'` | ข้อความบนปุ่ม OK |

### AlertError Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `okText` | String | `'ปิด'` | ข้อความบนปุ่ม OK |

### AlertConfirm Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `confirmText` | String | `'ยืนยัน'` | ข้อความบนปุ่มยืนยัน |
| `cancelText` | String | `'ยกเลิก'` | ข้อความบนปุ่มยกเลิก |
| `dismissableMask` | Boolean | `false` | คลิกนอก dialog เพื่อปิด (ปิดโดยค่าเริ่มต้น) |

## Events

### AlertSubmit, AlertWarning, AlertError

| Event | Payload | Description |
|-------|---------|-------------|
| `update:visible` | Boolean | เมื่อเปิด/ปิด dialog |
| `ok` | - | เมื่อกดปุ่ม OK |

### AlertConfirm

| Event | Payload | Description |
|-------|---------|-------------|
| `update:visible` | Boolean | เมื่อเปิด/ปิด dialog |
| `confirm` | - | เมื่อกดปุ่มยืนยัน |
| `cancel` | - | เมื่อกดปุ่มยกเลิก |

## Slots

ทุก Components รองรับ default slot สำหรับเพิ่มเนื้อหาเพิ่มเติม:

```vue
<AlertWarning v-model:visible="show" header="คำเตือน">
  <div>เนื้อหาเพิ่มเติมที่นี่</div>
</AlertWarning>
```

## Styling

Components ใช้ธีมสีดังนี้:

- **AlertSubmit**: สีเขียว (#22c55e)
- **AlertWarning**: สีเหลือง/ส้ม (#f59e0b)
- **AlertError**: สีแดง (#ef4444)
- **AlertConfirm**: สีชมพูพาสเทล (#ff69b4, #ffb6c1, #ffc0cb)

## Animations

แต่ละ component มี animation พิเศษ:

- **AlertSubmit**: Scale in animation
- **AlertWarning**: Shake animation
- **AlertError**: Pulse animation
- **AlertConfirm**: Bounce animation

## Complete Example

```vue
<template>
  <div class="demo-page">
    <h1>Alert Components Demo</h1>

    <div class="button-group">
      <button @click="showSuccess = true">Success Alert</button>
      <button @click="showWarning = true">Warning Alert</button>
      <button @click="showError = true">Error Alert</button>
      <button @click="showConfirm = true">Confirm Alert</button>
    </div>

    <!-- Alerts -->
    <AlertSubmit
      v-model:visible="showSuccess"
      header="บันทึกสำเร็จ"
      message="ข้อมูลได้รับการบันทึกเรียบร้อยแล้ว"
      @ok="handleSuccess"
    />

    <AlertWarning
      v-model:visible="showWarning"
      header="คำเตือน"
      message="กรุณาตรวจสอบข้อมูลอีกครั้ง"
      @ok="handleWarning"
    />

    <AlertError
      v-model:visible="showError"
      header="เกิดข้อผิดพลาด"
      message="ไม่สามารถดำเนินการได้ กรุณาลองใหม่"
      @ok="handleError"
    />

    <AlertConfirm
      v-model:visible="showConfirm"
      header="ยืนยันการดำเนินการ"
      message="คุณต้องการดำเนินการต่อหรือไม่?"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  AlertSubmit,
  AlertWarning,
  AlertError,
  AlertConfirm
} from '@/components/alert'

const showSuccess = ref(false)
const showWarning = ref(false)
const showError = ref(false)
const showConfirm = ref(false)

const handleSuccess = () => {
  console.log('Success!')
}

const handleWarning = () => {
  console.log('Warning acknowledged')
}

const handleError = () => {
  console.log('Error dismissed')
}

const handleConfirm = () => {
  console.log('Confirmed!')
}

const handleCancel = () => {
  console.log('Cancelled')
}
</script>

<style scoped>
.demo-page {
  padding: 2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
</style>
```

## Notes

- Components ใช้ PrimeVue Dialog เป็นพื้นฐาน
- รองรับ Vue 3 Composition API
- ใช้ v-model:visible สำหรับควบคุมการแสดง/ซ่อน
- สามารถ customize ได้ผ่าน props และ slots
- มี animations และ transitions ที่สวยงาม
- ใช้ธีมสีชมพูพาสเทลสำหรับ AlertConfirm เพื่อให้เข้ากับโปรเจค
