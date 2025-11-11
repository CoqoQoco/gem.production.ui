<template>
  <div class="language-switcher">
    <FormDropdown
      v-model="selectedLanguage"
      :options="languages"
      optionLabel="label"
      optionValue="value"
      @change="changeLanguage"
      class="language-dropdown"
    >
      <template #value="slotProps">
        <div class="language-option">
          <!-- <span class="flag-icon">{{ getFlagIcon(slotProps.value) }}</span> -->
          <span class="lang-code">{{ slotProps.value?.toUpperCase() }}</span>
        </div>
      </template>
      <template #option="slotProps">
        <div class="language-option">
          <!-- <span class="flag-icon">{{ getFlagIcon(slotProps.option.value) }}</span> -->
          <span>{{ slotProps.option.label }}</span>
        </div>
      </template>
    </FormDropdown>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import FormDropdown from '@/components/common/form-dropdown.vue'

const { locale } = useI18n()

const languages = [
  { label: 'ภาษาไทย', value: 'th' },
  { label: 'English', value: 'en' }
]

const selectedLanguage = ref(locale.value)

const changeLanguage = (event) => {
  const newLocale = event.value
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
}

const getFlagIcon = (lang) => {
  return lang === 'th' ? '🇹🇭' : 'EN'
}

onMounted(() => {
  selectedLanguage.value = locale.value
})
</script>

<style scoped lang="scss">
.language-switcher {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;

  :deep(.language-dropdown) {
    //min-width: 140px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
    }
  }

  // :deep(.p-dropdown) {
  //   background: transparent !important;
  //   border: none !important;
  //   box-shadow: none !important;

  //   .p-dropdown-trigger {
  //     color: #666;
  //   }
  // }

  .language-option {
    display: flex;
    align-items: center;
    gap: 8px;
    //padding: 0.25rem 0;

    .flag-icon {
      font-size: 20px;
      line-height: 1;
    }

    .lang-code {
      font-weight: 600;
      font-size: 0.875rem;
      color: #333;
    }
  }

  // Dropdown panel styling
  :deep(.p-dropdown-panel) {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    margin-top: 0.5rem;

    .p-dropdown-items {
      padding: 0.5rem;

      .p-dropdown-item {
        border-radius: 6px;
        transition: all 0.2s ease;
        margin-bottom: 0.25rem;

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          background: rgba(255, 182, 193, 0.15);
        }

        &.p-highlight {
          background: rgba(255, 182, 193, 0.25);
          color: #ff69b4;
        }
      }
    }
  }

  // Mobile responsive
  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;

    :deep(.language-dropdown) {
      min-width: 120px;
    }

    .language-option {
      .flag-icon {
        font-size: 18px;
      }

      .lang-code {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
