import { createI18n } from 'vue-i18n'
import th from './locales/th.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: localStorage.getItem('locale') || 'th', // Default language: English
  fallbackLocale: 'th',
  messages: {
    th,
    en
  }
})

export default i18n
