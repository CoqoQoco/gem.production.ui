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
import InputChips from 'primevue/inputchips'

// Styles
import 'primeicons/primeicons.css' // PrimeIcons
import './assets/styles/main.scss' // Custom styles

import App from './App.vue'
import router from './router'

// Custom Gold Theme Preset
const GoldTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#faf9f0',
      100: '#f5f3e1',
      200: '#efe9c9',
      300: '#e7de99',
      400: '#dfd070',
      500: '#d7c247',
      600: '#c0ab28',
      700: '#91801e',
      800: '#615514',
      900: '#302b0a',
      950: '#1a1705'
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
    preset: GoldTheme,
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
app.component('InputChips', InputChips)

// Register tooltip directive
app.directive('tooltip', Tooltip)

app.mount('#app')
