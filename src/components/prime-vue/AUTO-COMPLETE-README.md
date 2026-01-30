# AutoComplete Component Documentation

## 📍 Location
`/src/components/prime-vue/auto-complete.vue`

## 📝 Overview
Generic AutoComplete component wrapping PrimeVue AutoComplete with consistent styling following SKILL-STYLE.md guidelines. Supports single/multiple selection, custom filtering, virtual scrolling, and full slot customization.

---

## 🎯 Features

✅ **Options API** - Following project standards
✅ **Compact Sizing** - 30px height, 0.75rem font (12px)
✅ **Pink Theme** - Consistent with SKILL-STYLE.md (#ff69b4)
✅ **v-model Support** - Two-way data binding
✅ **Custom Filtering** - Built-in and custom filter functions
✅ **Multiple Selection** - Support for selecting multiple items
✅ **Dropdown Mode** - Show all suggestions with dropdown button
✅ **Virtual Scrolling** - For large datasets (performance)
✅ **Slot Pass-through** - All PrimeVue slots available
✅ **Validation Support** - Invalid state styling
✅ **Debounced Search** - Configurable delay
✅ **Force Selection** - Restrict to suggestions only

---

## 📦 Props

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | String/Number/Object/Array | `null` | v-model binding value |
| `suggestions` | Array | `[]` | Array of suggestion items |
| `field` | String | `null` | Field name for object display (e.g., 'name') |
| `placeholder` | String | `'ค้นหา...'` | Placeholder text |
| `disabled` | Boolean | `false` | Disable the input |
| `invalid` | Boolean | `false` | Show validation error state |

### Feature Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dropdown` | Boolean | `false` | Show dropdown button to see all suggestions |
| `multiple` | Boolean | `false` | Enable multiple selection (chips) |
| `minLength` | Number | `1` | Minimum characters to trigger search |
| `delay` | Number | `300` | Delay before search (ms) |
| `forceSelection` | Boolean | `false` | Only allow values from suggestions |
| `autoHighlight` | Boolean | `true` | Auto highlight first suggestion |
| `completeOnFocus` | Boolean | `false` | Show suggestions on focus |
| `emptySearchMessage` | String | `'ไม่พบข้อมูล'` | Message when no results found |

### Advanced Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `customFilter` | Function | `null` | Custom filter function |
| `virtualScrollerOptions` | Object | `null` | Options for virtual scrolling |

---

## 🔄 Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | value | Emitted when selection changes |
| `complete` | `{ originalEvent, query, suggestions }` | Emitted when search is triggered |
| `item-select` | event | Emitted when item is selected |
| `item-unselect` | event | Emitted when item is unselected (multiple mode) |
| `dropdown-click` | event | Emitted when dropdown button clicked |
| `clear` | event | Emitted when input is cleared |
| `focus` | event | Emitted when input receives focus |
| `blur` | event | Emitted when input loses focus |

---

## 🎨 Slots

All PrimeVue AutoComplete slots are available:

- `chip` - Custom chip template (multiple mode)
- `header` - Header of the panel
- `footer` - Footer of the panel
- `item` - Custom item template
- `optiongroup` - Custom option group template
- `empty` - Custom empty message template
- `loader` - Custom loader icon template

---

## 📖 Usage Examples

### 1. Basic Usage (String Array)

```vue
<template>
  <div>
    <label>เลือกเมือง</label>
    <AutoComplete
      v-model="selectedCity"
      :suggestions="cities"
      placeholder="ค้นหาเมือง..."
      @complete="searchCities"
    />
  </div>
</template>

<script>
import AutoComplete from '@/components/prime-vue/auto-complete.vue'

export default {
  components: {
    AutoComplete
  },

  data() {
    return {
      selectedCity: null,
      cities: [],
      allCities: [
        'กรุงเทพมหานคร',
        'เชียงใหม่',
        'ภูเก็ต',
        'พัทยา',
        'ขอนแก่น'
      ]
    }
  },

  methods: {
    searchCities(event) {
      const query = event.query.toLowerCase()
      this.cities = this.allCities.filter(city =>
        city.toLowerCase().includes(query)
      )
    }
  }
}
</script>
```

### 2. Object Array with Field

```vue
<template>
  <div>
    <label>เลือกพนักงาน</label>
    <AutoComplete
      v-model="selectedEmployee"
      :suggestions="employees"
      field="name"
      placeholder="ค้นหาพนักงาน..."
      @complete="searchEmployees"
    />
  </div>
</template>

<script>
import AutoComplete from '@/components/prime-vue/auto-complete.vue'

export default {
  components: {
    AutoComplete
  },

  data() {
    return {
      selectedEmployee: null,
      employees: [],
      allEmployees: [
        { id: 1, name: 'สมชาย ใจดี', position: 'Developer' },
        { id: 2, name: 'สมหญิง รักงาน', position: 'Designer' },
        { id: 3, name: 'วิชัย มั่นคง', position: 'Manager' }
      ]
    }
  },

  methods: {
    searchEmployees(event) {
      const query = event.query.toLowerCase()
      this.employees = this.allEmployees.filter(emp =>
        emp.name.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query)
      )
    }
  }
}
</script>
```

### 3. Multiple Selection with Chips

```vue
<template>
  <div>
    <label>เลือกทักษะ</label>
    <AutoComplete
      v-model="selectedSkills"
      :suggestions="skills"
      :multiple="true"
      placeholder="เลือกทักษะของคุณ..."
      @complete="searchSkills"
    />
  </div>
</template>

<script>
import AutoComplete from '@/components/prime-vue/auto-complete.vue'

export default {
  components: {
    AutoComplete
  },

  data() {
    return {
      selectedSkills: [],
      skills: [],
      allSkills: ['Vue.js', 'React', 'Angular', 'Node.js', 'Python', 'Java']
    }
  },

  methods: {
    searchSkills(event) {
      const query = event.query.toLowerCase()
      this.skills = this.allSkills.filter(skill =>
        skill.toLowerCase().includes(query)
      )
    }
  }
}
</script>
```

### 4. Dropdown Mode (Show All Options)

```vue
<template>
  <div>
    <label>เลือกสาขา</label>
    <AutoComplete
      v-model="selectedBranch"
      :suggestions="branches"
      field="nameTh"
      :dropdown="true"
      placeholder="เลือกสาขา..."
      @complete="searchBranches"
      @dropdown-click="showAllBranches"
    />
  </div>
</template>

<script>
import AutoComplete from '@/components/prime-vue/auto-complete.vue'

export default {
  components: {
    AutoComplete
  },

  data() {
    return {
      selectedBranch: null,
      branches: [],
      allBranches: [
        { id: 1, nameTh: 'สาขากรุงเทพ', code: 'BKK' },
        { id: 2, nameTh: 'สาขาเชียงใหม่', code: 'CNX' },
        { id: 3, nameTh: 'สาขาภูเก็ต', code: 'HKT' }
      ]
    }
  },

  methods: {
    searchBranches(event) {
      const query = event.query.toLowerCase()
      this.branches = this.allBranches.filter(branch =>
        branch.nameTh.toLowerCase().includes(query) ||
        branch.code.toLowerCase().includes(query)
      )
    },

    showAllBranches() {
      this.branches = [...this.allBranches]
    }
  }
}
</script>
```

### 5. Custom Filter Function

```vue
<template>
  <div>
    <label>ค้นหาสินค้า</label>
    <AutoComplete
      v-model="selectedProduct"
      :suggestions="products"
      field="name"
      :custom-filter="customProductFilter"
      placeholder="ค้นหาชื่อหรือรหัสสินค้า..."
      @complete="searchProducts"
    />
  </div>
</template>

<script>
import AutoComplete from '@/components/prime-vue/auto-complete.vue'

export default {
  components: {
    AutoComplete
  },

  data() {
    return {
      selectedProduct: null,
      products: [],
      allProducts: [
        { id: 1, code: 'P001', name: 'แหวนทอง', price: 15000 },
        { id: 2, code: 'P002', name: 'สร้อยทอง', price: 25000 },
        { id: 3, code: 'P003', name: 'กำไลทอง', price: 35000 }
      ]
    }
  },

  methods: {
    searchProducts(event) {
      // The component will use customProductFilter automatically
    },

    customProductFilter(items, query) {
      const searchQuery = query.toLowerCase().trim()

      return items.filter(product => {
        return (
          product.code.toLowerCase().includes(searchQuery) ||
          product.name.toLowerCase().includes(searchQuery) ||
          product.price.toString().includes(searchQuery)
        )
      })
    }
  }
}
</script>
```

### 6. Custom Item Template

```vue
<template>
  <div>
    <label>เลือกผู้ใช้งาน</label>
    <AutoComplete
      v-model="selectedUser"
      :suggestions="users"
      field="username"
      placeholder="ค้นหาผู้ใช้งาน..."
      @complete="searchUsers"
    >
      <template #item="slotProps">
        <div class="user-item">
          <div class="user-avatar">
            <i class="pi pi-user"></i>
          </div>
          <div class="user-info">
            <div class="user-name">{{ slotProps.item.fullName }}</div>
            <div class="user-username">@{{ slotProps.item.username }}</div>
          </div>
          <div class="user-badge">
            <span :class="['badge', slotProps.item.role]">
              {{ slotProps.item.role }}
            </span>
          </div>
        </div>
      </template>
    </AutoComplete>
  </div>
</template>

<script>
import AutoComplete from '@/components/prime-vue/auto-complete.vue'

export default {
  components: {
    AutoComplete
  },

  data() {
    return {
      selectedUser: null,
      users: [],
      allUsers: [
        { id: 1, username: 'admin', fullName: 'ผู้ดูแลระบบ', role: 'admin' },
        { id: 2, username: 'user1', fullName: 'พนักงาน 1', role: 'user' },
        { id: 3, username: 'manager1', fullName: 'ผู้จัดการ 1', role: 'manager' }
      ]
    }
  },

  methods: {
    searchUsers(event) {
      const query = event.query.toLowerCase()
      this.users = this.allUsers.filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.fullName.toLowerCase().includes(query)
      )
    }
  }
}
</script>

<style scoped>
.user-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 0.75rem;
  color: #374151;
}

.user-username {
  font-size: 0.6875rem;
  color: #9ca3af;
}

.user-badge .badge {
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.admin {
  background: #fef3c7;
  color: #92400e;
}

.badge.manager {
  background: #dbeafe;
  color: #1e40af;
}

.badge.user {
  background: #f3f4f6;
  color: #6b7280;
}
</style>
```

### 7. With Validation

```vue
<template>
  <div>
    <div class="form-group">
      <label>
        ทอง
        <span class="required">*</span>
      </label>
      <AutoComplete
        v-model="form.goldCode"
        :suggestions="golds"
        field="nameTh"
        :dropdown="true"
        :invalid="!!errors.goldCode"
        placeholder="ค้นหาทอง..."
        @complete="searchGolds"
        @item-select="handleGoldSelect"
      />
      <small v-if="errors.goldCode" class="p-error">
        {{ errors.goldCode }}
      </small>
    </div>
  </div>
</template>

<script>
import AutoComplete from '@/components/prime-vue/auto-complete.vue'

export default {
  components: {
    AutoComplete
  },

  data() {
    return {
      form: {
        goldCode: null,
        goldName: ''
      },
      golds: [],
      allGolds: [
        { code: 'G001', nameTh: 'ทองคำแท้ 96.5%', purity: 96.5 },
        { code: 'G002', nameTh: 'ทองคำแท้ 99.99%', purity: 99.99 }
      ],
      errors: {}
    }
  },

  methods: {
    searchGolds(event) {
      const query = event.query.toLowerCase()
      this.golds = this.allGolds.filter(gold =>
        gold.nameTh.toLowerCase().includes(query) ||
        gold.code.toLowerCase().includes(query)
      )
    },

    handleGoldSelect(event) {
      const selected = event.value
      this.form.goldCode = selected.code
      this.form.goldName = selected.nameTh
      delete this.errors.goldCode
    },

    validateForm() {
      this.errors = {}

      if (!this.form.goldCode) {
        this.errors.goldCode = 'กรุณาเลือกทอง'
      }

      return Object.keys(this.errors).length === 0
    }
  }
}
</script>
```

### 8. API Integration Example

```vue
<template>
  <div>
    <label>ค้นหาลูกค้า</label>
    <AutoComplete
      v-model="selectedCustomer"
      :suggestions="customers"
      field="fullName"
      :dropdown="true"
      :delay="500"
      placeholder="ค้นหาชื่อหรือเบอร์โทรลูกค้า..."
      @complete="searchCustomersAPI"
      @item-select="handleCustomerSelect"
    >
      <template #item="slotProps">
        <div class="customer-item">
          <div>
            <strong>{{ slotProps.item.fullName }}</strong>
            <p class="customer-phone">{{ slotProps.item.phone }}</p>
          </div>
        </div>
      </template>
    </AutoComplete>
  </div>
</template>

<script>
import AutoComplete from '@/components/prime-vue/auto-complete.vue'
import { useCustomerApiStore } from '@/stores/api/customer-api'

export default {
  components: {
    AutoComplete
  },

  data() {
    return {
      customerApiStore: useCustomerApiStore(),
      selectedCustomer: null,
      customers: []
    }
  },

  methods: {
    async searchCustomersAPI(event) {
      try {
        const result = await this.customerApiStore.searchCustomers({
          pageIndex: 0,
          pageSize: 20,
          criteria: {
            searchText: event.query
          }
        })

        if (result.success) {
          this.customers = result.data
        }
      } catch (error) {
        console.error('Error searching customers:', error)
        this.customers = []
      }
    },

    handleCustomerSelect(event) {
      console.log('Selected customer:', event.value)
      // Handle customer selection
    }
  }
}
</script>

<style scoped>
.customer-item {
  padding: 0.25rem 0;
}

.customer-phone {
  font-size: 0.6875rem;
  color: #9ca3af;
  margin: 0.125rem 0 0 0;
}
</style>
```

---

## 🎨 Styling

Component follows SKILL-STYLE.md compact sizing standards:

- **Input height:** 30px
- **Font size:** 0.75rem (12px)
- **Padding:** 0.25rem 0.5rem
- **Border radius:** 6px
- **Primary color:** #ff69b4 (Pink theme)
- **Chip font:** 0.6875rem (11px)
- **Panel max height:** 300px

---

## ✅ Best Practices

1. **Always provide @complete handler** for filtering suggestions
2. **Use field prop** for object arrays
3. **Enable dropdown** for small datasets (<100 items)
4. **Use forceSelection** when you need valid data only
5. **Add validation** with :invalid prop
6. **Custom templates** for rich data display
7. **Virtual scrolling** for large datasets (>1000 items)
8. **Debounce API calls** with delay prop (300-500ms)

---

## 🚫 Common Mistakes

❌ **Forgetting @complete handler**
```vue
<!-- Wrong -->
<AutoComplete v-model="value" :suggestions="items" />

<!-- Correct -->
<AutoComplete v-model="value" :suggestions="items" @complete="search" />
```

❌ **Not updating suggestions in @complete**
```vue
// Wrong
methods: {
  search(event) {
    // Not updating this.suggestions
  }
}

// Correct
methods: {
  search(event) {
    this.suggestions = this.filterItems(event.query)
  }
}
```

❌ **Using wrong field name**
```vue
<!-- Wrong - field doesn't exist in data -->
<AutoComplete :suggestions="users" field="fullname" />

<!-- Correct -->
<AutoComplete :suggestions="users" field="fullName" />
```

---

**Created:** 2025-01-30
**Version:** 1.0
**Follows:** SKILL.md (Options API), SKILL-STYLE.md (Pink Theme + Compact Sizing)
