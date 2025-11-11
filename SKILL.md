# Updated Project Structure - Phase 1 with i18n & SCSS


## 🆕 New Features Added
- ✅ **i18n (vue-i18n)** - Multi-language support (Thai/English)
- ✅ **SCSS** - Centralized styles with modular architecture
- ✅ **Language Switcher** - Component for switching languages
- ✅ **Refactored folder structure** - Organized for scalability

---

## 📋 File Naming Convention

**All Vue component files MUST follow kebab-case naming:**

### ✅ Correct Examples:
- `login-view.vue`
- `register-view.vue`
- `language-switcher.vue`
- `form-dropdown.vue`
- `app-header.vue`
- `stats-card.vue`

### ❌ Incorrect Examples (DO NOT USE):
- `LoginView.vue` (PascalCase)
- `RegisterView.vue` (PascalCase)
- `LanguageSwitcher.vue` (PascalCase)
- `FormDropdown.vue` (PascalCase)

### 📝 Naming Rules:
1. **All lowercase letters**
2. **Words separated by hyphens (-)**
3. **Descriptive and readable**
4. **Suffix with purpose** (e.g., `-view`, `-card`, `-section` for clarity)

### Why kebab-case?
- ✅ Consistent with HTML standard (HTML is case-insensitive)
- ✅ Avoids file system case sensitivity issues (Windows vs Linux/Mac)
- ✅ Better for URL routing and file paths
- ✅ Matches Vue 3 style guide recommendations
- ✅ Improves team collaboration and code consistency

---

## Updated Project Structure

```
gem-ui/
├── public/
│   └── logo.png
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── abstracts/
│   │   │   │   ├── _variables.scss    (Colors, spacing, shadows, etc.)
│   │   │   │   └── _mixins.scss       (Responsive, flexbox, animations)
│   │   │   ├── base/
│   │   │   │   ├── _reset.scss        (CSS reset)
│   │   │   │   ├── _typography.scss   (Fonts, headings)
│   │   │   │   └── _utilities.scss    (Utility classes)
│   │   │   ├── components/
│   │   │   │   └── _auth.scss         (Auth pages common styles)
│   │   │   └── main.scss              (Main SCSS entry point)
│   │   └── images/
│   │
│   ├── components/
│   │   └── common/
│   │       ├── language-switcher.vue   (🆕 Language selector)
│   │       ├── app-header.vue
│   │       ├── stats-card.vue
│   │       ├── module-card.vue
│   │       ├── welcome-section.vue
│   │       ├── page-header.vue
│   │       ├── empty-state.vue
│   │       ├── loading-spinner.vue
│   │       ├── form-field.vue
│   │       ├── form-dropdown.vue      (🆕 Reusable dropdown)
│   │       └── action-buttons.vue
│   │
│   ├── views/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── login-view.vue      (🆕 With i18n + SCSS)
│   │   │   └── register/
│   │   │       └── register-view.vue   (🆕 With i18n + SCSS)
│   │   └── dashboard/
│   │       └── dashboard-view.vue
│   │
│   ├── i18n/                            (🆕 Internationalization)
│   │   ├── index.js                     (i18n config)
│   │   └── locales/
│   │       ├── th.json                  (Thai translations)
│   │       └── en.json                  (English translations)
│   │
│   ├── router/
│   │   └── index.js
│   │
│   ├── stores/
│   │   └── auth.js
│   │
│   ├── composables/
│   │   └── useValidation.js
│   │
│   ├── utils/
│   │   ├── mockData.js
│   │   └── helpers.js
│   │
│   ├── App.vue
│   └── main.js                          (🆕 Updated with i18n)
│
├── package.json
├── vite.config.js
└── index.html
```

---

## Installation Steps

### Step 1: Install New Dependencies

```bash
cd gem-ui
npm install vue-i18n@9 sass
```

### Step 2: Dependencies Installed

**New packages:**
- `vue-i18n@9` - For multi-language support
- `sass` - For SCSS compilation

---

## i18n Configuration

### Main Config (`src/i18n/index.js`)

```javascript
import { createI18n } from 'vue-i18n'
import th from './locales/th.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: localStorage.getItem('locale') || 'th',
  fallbackLocale: 'en',
  messages: { th, en }
})

export default i18n
```

### Translation Files Structure

**th.json & en.json contain:**
- `auth.login.*` - Login page translations
- `auth.register.*` - Register page translations
- `auth.validation.*` - Form validation messages
- `common.*` - Common UI text

### Using i18n in Components

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <h1>{{ t('auth.login.title') }}</h1>
  <label>{{ t('auth.login.username') }}</label>
</template>
```

---

## SCSS Architecture

### Abstracts Layer
**`_variables.scss`** - Design tokens
- Color palette (primary, secondary, gray, status)
- Spacing scale
- Border radius
- Shadows
- Transitions
- Breakpoints

**`_mixins.scss`** - Reusable patterns
- `@mixin mobile` - Mobile breakpoint
- `@mixin tablet` - Tablet breakpoint
- `@mixin desktop` - Desktop breakpoint
- `@mixin flex-center` - Flexbox center
- `@mixin card` - Card styling
- `@mixin button-primary` - Primary button
- `@mixin input-field` - Input styling
- Animation mixins (fade-slide-in, pulse)

### Base Layer
**`_reset.scss`** - CSS reset and defaults
**`_typography.scss`** - Font families, sizes, weights
**`_utilities.scss`** - Utility classes (w-full, mt-2, flex, etc.)

### Components Layer
**`_auth.scss`** - Auth pages common styles
- `.auth-page` - Page wrapper
- `.auth-container` - Container
- `.auth-card` - Card styling
- `.auth-brand` - Brand section
- `.form-field` - Form field
- `.auth-button` - Buttons
- `.auth-links` - Links
- Language switcher styles

### Main Entry Point
**`main.scss`** - Imports all modules
```scss
@import 'abstracts/variables';
@import 'abstracts/mixins';
@import 'base/reset';
@import 'base/typography';
@import 'base/utilities';
@import 'components/auth';
```

---

## Usage in Components

### Using SCSS Modules

```vue
<style lang="scss" scoped>
// No need to import, variables/mixins available via main.scss

.my-component {
  background: $primary-500;
  padding: $space-4;
  border-radius: $radius-lg;

  @include mobile {
    padding: $space-2;
  }
}
</style>
```

### Using Common Auth Styles

```vue
<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <!-- Content -->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// Styles from _auth.scss will be applied automatically
</style>
```

---

## Language Switcher Component

**Location:** `src/components/common/LanguageSwitcher.vue`

**Features:**
- Dropdown with flag icons (🇹🇭/🇬🇧)
- Saves selection to localStorage
- Updates i18n locale
- Glassmorphism style

**Usage:**
```vue
<template>
  <language-switcher />
</template>

<script setup>
import LanguageSwitcher from '@/components/common/language-switcher.vue'
</script>
```

---

## Updated main.js

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

// i18n
import i18n from './i18n'

// PrimeVue Components (same as before)
import Button from 'primevue/button'
// ... other components

// Styles - SCSS instead of CSS
import 'primeicons/primeicons.css'
import './assets/styles/main.scss'  // 🆕 Main SCSS file

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)  // 🆕 Register i18n
app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.use(ConfirmationService)

// Register components...

app.mount('#app')
```

---

## Benefits of New Architecture

### i18n Benefits
✅ Easy to add new languages (just add JSON file)
✅ Centralized translations
✅ Type-safe with TypeScript (optional)
✅ No hardcoded strings in components
✅ Consistent messaging

### SCSS Benefits
✅ **Reusability** - Mixins eliminate duplicate code
✅ **Maintainability** - Variables make theme changes easy
✅ **Organization** - Modular file structure
✅ **Scalability** - Easy to add new component styles
✅ **Performance** - Compiled to optimized CSS
✅ **DRY Principle** - Don't Repeat Yourself

### Folder Structure Benefits
✅ **Scalability** - Ready for child components
✅ **Clarity** - Clear separation of concerns
✅ **Team-friendly** - Easy to find files
✅ **Future-proof** - Can grow with project

---

## Migration Guide for Existing Components

### Before (inline styles):
```vue
<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(...);
}
</style>
```

### After (using SCSS):
```vue
<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  @include flex-center;
  background: linear-gradient(
    135deg,
    rgba($primary-500, 0.9) 0%,
    rgba($secondary-500, 0.9) 100%
  );

  @include mobile {
    padding: $space-2;
  }
}
</style>
```

---

## Next Steps

1. ✅ Install dependencies: `npm install vue-i18n@9 sass`
2. ✅ Update existing Login & Register views (Completed - both moved to new folder structure)
3. ✅ Update router to use new file paths
4. ⏳ Test language switching (Pending - need to run `npm install` first)
5. ⏳ Verify SCSS compilation (Pending - need to run `npm install` first)
6. ⏳ Create remaining components with new structure

---

## Completed Updates

### ✅ login-view.vue (`/src/views/auth/login/login-view.vue`)
- Moved to new folder structure with dedicated login/ subdirectory
- Integrated i18n with `useI18n()` composable
- All text uses translation keys from en.json/th.json
- **Uses native HTML inputs** - No PrimeVue InputText/Password (避免 icon/placeholder overlap)
- Custom password toggle with eye icon
- Uses centralized SCSS from `_auth.scss` (no inline styles)
- Includes language-switcher component

### ✅ register-view.vue (`/src/views/auth/register/register-view.vue`)
- Moved to new folder structure with dedicated register/ subdirectory
- Complete i18n integration for all form fields
- **Uses native HTML inputs** - Replaced PrimeVue components with native inputs
- **Uses form-dropdown component** - Reusable dropdown for Branch and Role selection
- Password strength indicator with real-time validation
- Full validation with i18n error messages
- Mock data integration for branches and roles
- Uses centralized SCSS (no inline styles)

### ✅ form-dropdown.vue Component (`/src/components/common/form-dropdown.vue`)
- **New reusable component** wrapping PrimeVue Dropdown
- Consistent styling across the application
- Props: `modelValue`, `options`, `optionLabel`, `optionValue`, `placeholder`, `disabled`, `invalid`
- Custom focus/hover states with primary color (#f58511)
- v-model support for easy two-way binding
- Can be reused anywhere in the app

### ✅ Router Updated
- Updated imports to point to new file locations:
  - `/views/auth/login/login-view.vue`
  - `/views/auth/register/register-view.vue`

---

**Last Updated:** 2025-11-01
**Version:** 2.4 (Updated Naming Convention to kebab-case)

---

## 🔄 Components Using form-dropdown

All dropdown instances in the application now use the `form-dropdown` component:

1. **register-view.vue** - Branch selection, Role selection
2. **language-switcher.vue** - Language selection with custom flags (using slots)

This ensures:
- ✅ Consistent styling across all dropdowns
- ✅ No overflow/overlap issues (using `appendTo="body"`)
- ✅ Easy maintenance (update once, apply everywhere)
- ✅ Support for custom templates via slots

---

## 📦 Important Components Overview

### 🔹 form-dropdown Component
**Location:** `/src/components/common/form-dropdown.vue`

**Purpose:** Reusable dropdown component wrapping PrimeVue Dropdown with consistent styling

**Props:**
- `modelValue` - Current selected value (v-model support)
- `options` - Array of dropdown options
- `optionLabel` - Property name for display label (default: 'label')
- `optionValue` - Property name for value (default: 'value')
- `placeholder` - Placeholder text (default: 'Select an option')
- `disabled` - Disable dropdown (default: false)
- `invalid` - Show error state (default: false)

**Events:**
- `update:modelValue` - Emitted when selection changes
- `change` - Emitted when selection changes (receives event object)

**Slots:**
- `value` - Custom template for selected value display
- `option` - Custom template for each option in the dropdown list
- All PrimeVue Dropdown slots are supported via slot pass-through

**Features:**
- `appendTo="body"` - Dropdown panel appends to body to prevent overflow issues
- Slot pass-through - All slots from PrimeVue Dropdown work seamlessly
- Global panel styles in `_auth.scss` for consistent appearance

**Usage Example (Basic):**
```vue
<form-dropdown
  v-model="form.branchId"
  :options="branches"
  optionLabel="label"
  optionValue="value"
  placeholder="Select branch"
  :invalid="!!errors.branchId"
  @change="clearError('branchId')"
/>
```

**Usage Example (With Custom Slots):**
```vue
<form-dropdown
  v-model="selectedLanguage"
  :options="languages"
  optionLabel="label"
  optionValue="value"
>
  <template #value="slotProps">
    <div class="language-option">
      <span class="flag-icon">{{ getFlagIcon(slotProps.value) }}</span>
      <span>{{ slotProps.value?.toUpperCase() }}</span>
    </div>
  </template>
  <template #option="slotProps">
    <div class="language-option">
      <span class="flag-icon">{{ getFlagIcon(slotProps.option.value) }}</span>
      <span>{{ slotProps.option.label }}</span>
    </div>
  </template>
</form-dropdown>
```

**Styling:**
- Height: 40px (consistent with inputs)
- Primary color: #f58511
- Focus shadow: rgba(245, 133, 17, 0.2)
- Invalid border: #dc3545 (red)

---

## 🎨 Design Decisions

### Why Native HTML Inputs?
1. **No icon/placeholder overlap** - Full control over positioning
2. **Better performance** - Lighter than PrimeVue components
3. **Easier customization** - Direct CSS control
4. **Accessibility** - Standard HTML semantics

### Why PrimeVue Dropdown?
1. **Complex functionality** - Keyboard navigation, search, filtering
2. **Accessibility built-in** - ARIA labels, focus management
3. **Consistent behavior** - Tested across browsers
4. **Time-saving** - Don't reinvent the wheel

### Component Strategy
- **Use native HTML** for simple inputs (text, email, password, tel)
- **Use PrimeVue wrapped in custom components** for complex UI (dropdown, datepicker, autocomplete)
- **Always create reusable wrappers** for consistent styling

---

## 🔑 Key Technical Details

### Input Structure
```vue
<!-- Native Input with Icon -->
<div class="input-wrapper">
  <i class="input-icon pi pi-user"></i>
  <input
    type="text"
    v-model="form.username"
    placeholder="Enter username"
    :class="{ 'is-invalid': errors.username }"
  />
</div>
```

### Password Input with Toggle
```vue
<div class="input-wrapper">
  <i class="input-icon pi pi-lock"></i>
  <div class="password-input-wrapper">
    <input
      :type="showPassword ? 'text' : 'password'"
      v-model="form.password"
    />
    <button
      type="button"
      class="password-toggle"
      @click="showPassword = !showPassword"
    >
      <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
    </button>
  </div>
</div>
```

### Dropdown Usage
```vue
<form-dropdown
  v-model="form.roleId"
  :options="roles"
  :invalid="!!errors.roleId"
/>
```

---

## 🚀 Performance Benefits

1. **Reduced bundle size** - Native inputs instead of heavy components
2. **Faster rendering** - Fewer Vue component instances
3. **Better runtime performance** - Direct DOM manipulation
4. **Smaller CSS** - No need to override PrimeVue styles

---

## 🎯 Vue API Style Guide

### ⚠️ IMPORTANT: Use Options API (NOT Composition API)

**ในโปรเจคนี้ ใช้ Options API เท่านั้น**

### ✅ Correct: Options API

```vue
<template>
  <div class="my-component">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script>
export default {
  name: 'MyComponent',

  props: {
    title: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      message: 'Hello World',
      count: 0
    }
  },

  computed: {
    doubleCount() {
      return this.count * 2
    }
  },

  methods: {
    handleClick() {
      this.count++
    }
  },

  mounted() {
    console.log('Component mounted')
  }
}
</script>

<style lang="scss" scoped>
.my-component {
  padding: $space-4;
}
</style>
```

### ❌ Incorrect: Composition API (DO NOT USE)

```vue
<!-- ❌ ห้ามใช้แบบนี้ -->
<script setup>
import { ref, computed, onMounted } from 'vue'

const message = ref('Hello World')
const count = ref(0)

const doubleCount = computed(() => count.value * 2)

function handleClick() {
  count.value++
}

onMounted(() => {
  console.log('Component mounted')
})
</script>
```

### Options API Structure

```vue
<script>
export default {
  name: 'ComponentName',          // 1. Component name

  components: {                    // 2. Child components
    ChildComponent
  },

  props: {                         // 3. Props
    title: String,
    count: Number
  },

  data() {                         // 4. Reactive data
    return {
      message: '',
      isLoading: false
    }
  },

  computed: {                      // 5. Computed properties
    fullName() {
      return `${this.firstName} ${this.lastName}`
    }
  },

  watch: {                         // 6. Watchers
    count(newVal, oldVal) {
      console.log('Count changed:', newVal)
    }
  },

  methods: {                       // 7. Methods
    handleSubmit() {
      // logic here
    }
  },

  // 8. Lifecycle hooks
  created() {},
  mounted() {},
  updated() {},
  unmounted() {}
}
</script>
```

### Using i18n with Options API

```vue
<template>
  <div>
    <h1>{{ $t('auth.login.title') }}</h1>
    <p>{{ translatedMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoginView',

  computed: {
    translatedMessage() {
      return this.$t('auth.login.message')
    }
  },

  methods: {
    showLocalizedAlert() {
      alert(this.$t('common.success'))
    }
  }
}
</script>
```

### Using Pinia Store with Options API

```vue
<template>
  <div>
    <p>User: {{ authStore.user.username }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'UserProfile',

  data() {
    return {
      authStore: useAuthStore()
    }
  },

  computed: {
    isLoggedIn() {
      return this.authStore.isAuthenticated
    }
  },

  methods: {
    async logout() {
      await this.authStore.logout()
      this.$router.push('/login')
    }
  }
}
</script>
```

### Form Handling with Options API

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input
      v-model="form.username"
      type="text"
      :class="{ 'is-invalid': errors.username }"
    />
    <p v-if="errors.username" class="error">{{ errors.username }}</p>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </button>
  </form>
</template>

<script>
export default {
  name: 'LoginForm',

  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      errors: {},
      isSubmitting: false
    }
  },

  methods: {
    validateForm() {
      this.errors = {}

      if (!this.form.username) {
        this.errors.username = this.$t('auth.validation.usernameRequired')
      }

      return Object.keys(this.errors).length === 0
    },

    async handleSubmit() {
      if (!this.validateForm()) return

      this.isSubmitting = true

      try {
        await this.authStore.login(this.form)
        this.$router.push('/dashboard')
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message
        })
      } finally {
        this.isSubmitting = false
      }
    },

    clearError(field) {
      delete this.errors[field]
    }
  }
}
</script>
```

### Component Communication

#### Parent to Child (Props)
```vue
<!-- Parent -->
<template>
  <child-component :title="pageTitle" :count="itemCount" />
</template>

<script>
export default {
  data() {
    return {
      pageTitle: 'Dashboard',
      itemCount: 10
    }
  }
}
</script>

<!-- Child -->
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  }
}
</script>
```

#### Child to Parent (Events)
```vue
<!-- Child -->
<template>
  <button @click="handleClick">Click</button>
</template>

<script>
export default {
  methods: {
    handleClick() {
      this.$emit('update', { value: 'new data' })
    }
  }
}
</script>

<!-- Parent -->
<template>
  <child-component @update="handleUpdate" />
</template>

<script>
export default {
  methods: {
    handleUpdate(data) {
      console.log('Received:', data)
    }
  }
}
</script>
```

### Lifecycle Hooks Order

```vue
<script>
export default {
  // 1. Created - Component instance created
  created() {
    // Good for: API calls, setting initial data
    this.fetchData()
  },

  // 2. Mounted - DOM is ready
  mounted() {
    // Good for: DOM manipulation, third-party libraries
    this.initChart()
  },

  // 3. Updated - Component re-rendered
  updated() {
    // Good for: React to data changes
  },

  // 4. Unmounted - Before component destroyed
  unmounted() {
    // Good for: Cleanup (remove event listeners, clear timers)
    clearInterval(this.timer)
  }
}
</script>
```

### Best Practices for Options API

1. ✅ **Always use `this`** to access data, props, computed, methods
2. ✅ **Use arrow functions carefully** - They don't bind `this`
3. ✅ **Keep methods focused** - One method, one responsibility
4. ✅ **Use computed properties** for derived state
5. ✅ **Use watchers sparingly** - Prefer computed when possible
6. ✅ **Initialize all data properties** in `data()`
7. ✅ **Clean up in `unmounted`** - Remove listeners, clear timers

### Common Patterns

#### API Call on Mount
```vue
<script>
export default {
  data() {
    return {
      users: [],
      isLoading: false,
      error: null
    }
  },

  async mounted() {
    await this.fetchUsers()
  },

  methods: {
    async fetchUsers() {
      this.isLoading = true
      this.error = null

      try {
        const response = await fetch('/api/users')
        this.users = await response.json()
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
```

#### Debounced Search
```vue
<script>
export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      debounceTimer: null
    }
  },

  watch: {
    searchQuery(newVal) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.performSearch(newVal)
      }, 300)
    }
  },

  methods: {
    async performSearch(query) {
      // API call here
    }
  },

  unmounted() {
    clearTimeout(this.debounceTimer)
  }
}
</script>
```

---

## 🔧 Environment Variables Configuration

### ⚠️ IMPORTANT: Use .env for Configuration

**ในโปรเจคนี้ ใช้ .env file สำหรับเก็บ configuration ต่างๆ**

### File Structure

```
gem-ui/
├── .env                  (Your local configuration - NOT committed to git)
├── .env.example         (Template file - committed to git)
└── src/
    └── service/
        └── axios/
            └── index.js  (Axios configuration using env variables)
```

### .env File

**Location:** `/gem-ui/.env`

```env
# API Configuration
# Jewelry API Base URL (Backend API)
VITE_JEWELRY_API_URL=https://localhost:7001/

# API Timeout (milliseconds)
VITE_API_TIMEOUT=100000

# Loading Configuration (milliseconds)
VITE_MAX_LOADING_TIME=10000
```

### .env.example File

**Location:** `/gem-ui/.env.example`

```env
# API Configuration
# Jewelry API Base URL (Backend API)
# Development: https://localhost:7001/
# Production: http://192.168.1.41:2001/
VITE_JEWELRY_API_URL=https://localhost:7001/

# API Timeout (milliseconds)
VITE_API_TIMEOUT=100000

# Loading Configuration (milliseconds)
VITE_MAX_LOADING_TIME=10000
```

### Using Environment Variables in Code

**In Vite projects, all environment variables must start with `VITE_` prefix**

```javascript
// ✅ Correct: Access environment variables with import.meta.env
const apiUrl = import.meta.env.VITE_JEWELRY_API_URL
const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT) || 100000

// ❌ Incorrect: process.env (this is for Node.js, not Vite)
const apiUrl = process.env.VITE_JEWELRY_API_URL  // Won't work in Vite
```

### Example: Axios Configuration with Environment Variables

**Location:** `/src/service/axios/index.js`

```javascript
import axios from 'axios'

// Get API URLs from environment variables
const jewelryUrl = import.meta.env.VITE_JEWELRY_API_URL || 'https://localhost:7001/'
const apiTimeout = parseInt(import.meta.env.VITE_API_TIMEOUT) || 100000
const maxLoadingTime = parseInt(import.meta.env.VITE_MAX_LOADING_TIME) || 10000

// Create axios instance
const axiosInstance = axios.create({
  baseURL: jewelryUrl,
  timeout: apiTimeout
})

// Export API methods
export default {
  jewelry: {
    get: async (url, params, optionsConfig) => { /* ... */ },
    post: async (url, data, optionsConfig) => { /* ... */ }
  }
}
```

### Environment-Specific Configuration

#### Development Environment
```env
VITE_JEWELRY_API_URL=https://localhost:7001/
```

#### Production Environment
```env
VITE_JEWELRY_API_URL=http://192.168.1.41:2001/
```

### Best Practices

1. ✅ **Never commit `.env` file** - Add to `.gitignore`
2. ✅ **Always commit `.env.example`** - As a template for other developers
3. ✅ **Use `VITE_` prefix** - Required for Vite to expose variables to client-side code
4. ✅ **Provide fallback values** - Use `||` operator for default values
5. ✅ **Use `parseInt()` for numbers** - Environment variables are strings
6. ✅ **Document all variables** - Add comments in `.env.example`
7. ✅ **Don't put secrets in `.env`** - Only configuration, not sensitive data

### Adding to .gitignore

Ensure `.env` is in your `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Keep example file
!.env.example
```

### How to Use

1. Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your local configuration
   ```env
   VITE_JEWELRY_API_URL=https://localhost:7001/
   ```

3. Access in code using `import.meta.env`
   ```javascript
   const apiUrl = import.meta.env.VITE_JEWELRY_API_URL
   ```

4. Restart dev server after changing `.env` file
   ```bash
   npm run dev
   ```

### Available Environment Variables

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `VITE_JEWELRY_API_URL` | Backend API base URL | `https://localhost:7001/` | Yes |
| `VITE_API_TIMEOUT` | API request timeout (ms) | `100000` | No |
| `VITE_MAX_LOADING_TIME` | Max loading indicator time (ms) | `10000` | No |

### TypeScript Support (Optional)

For TypeScript projects, add type definitions in `src/vite-env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JEWELRY_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_MAX_LOADING_TIME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 📝 Best Practices

### When creating new forms:
1. Use native `<input>` for text, email, password, tel, number
2. Use `<form-dropdown>` for select/dropdown fields
3. Use PrimeVue `<InputMask>` for formatted inputs (phone, date)
4. Use PrimeVue `<Checkbox>` and `<Button>` as-is
5. Always wrap PrimeVue components in custom components for reusability

### Validation:
- Use `:class="{ 'is-invalid': !!errors.fieldName }"` for native inputs
- Use `:invalid="!!errors.fieldName"` for form-dropdown
- Use `<InlineMessage>` from PrimeVue for error display

### Styling:
- All input heights: 40px
- Icon left padding: 40px
- Border color (normal): #dee2e6
- Border color (focus): #f58511
- Border color (error): #dc3545
