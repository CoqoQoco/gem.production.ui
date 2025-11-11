import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

// i18n
import i18n from './i18n'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast'
import Select from 'primevue/select'
import InputMask from 'primevue/inputmask'
import InlineMessage from 'primevue/inlinemessage'
import ProgressSpinner from 'primevue/progressspinner'

// Styles
import 'primeicons/primeicons.css' // PrimeIcons
import './assets/styles/main.scss' // Custom styles

import App from './App.vue'
import router from './router'

// Custom Pink Theme Preset
const PinkTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{pink.50}',
      100: '{pink.100}',
      200: '{pink.200}',
      300: '{pink.300}',
      400: '{pink.400}',
      500: '{pink.500}',
      600: '{pink.600}',
      700: '{pink.700}',
      800: '{pink.800}',
      900: '{pink.900}',
      950: '{pink.950}'
    }
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(PrimeVue, {
  theme: {
    preset: PinkTheme,
    options: {
      darkModeSelector: false,
      cssLayer: false
    }
  },
  ripple: true
})
app.use(ToastService)
app.use(ConfirmationService)

// Register PrimeVue components globally
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Checkbox', Checkbox)
app.component('Toast', Toast)
app.component('Select', Select)
app.component('InputMask', InputMask)
app.component('InlineMessage', InlineMessage)
app.component('ProgressSpinner', ProgressSpinner)

// Register tooltip directive
app.directive('tooltip', Tooltip)

app.mount('#app')
