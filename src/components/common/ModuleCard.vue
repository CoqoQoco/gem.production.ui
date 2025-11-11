<template>
  <div class="module-card" @click="handleClick" :style="{ '--accent-color': module.accentColor }">
    <div class="module-header">
      <div class="module-icon" :style="{ backgroundColor: module.accentColor }">
        {{ module.iconEmoji }}
      </div>
      <div class="module-title-section">
        <h3 class="module-title">{{ module.title }}</h3>
        <p class="module-subtitle">{{ module.subtitle }}</p>
      </div>
    </div>

    <ul class="module-features">
      <li v-for="(feature, index) in module.features" :key="index" class="feature-item">
        <i class="pi pi-check-circle"></i>
        <span>{{ feature }}</span>
      </li>
    </ul>

    <button class="module-action-btn">
      <span>{{ t('dashboard.enterSystem') }}</span>
      <i class="pi pi-arrow-right"></i>
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  module: {
    type: Object,
    required: true,
    default: () => ({
      iconEmoji: '📦',
      title: 'Module',
      subtitle: 'Subtitle',
      features: [],
      accentColor: '#3b82f6'
    })
  }
})

const emit = defineEmits(['click'])
const { t } = useI18n()

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.module-card {
  display: flex;
  flex-direction: column;
  padding: 32px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  height: 320px;

  &:hover {
    border-color: var(--accent-color);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);

    .module-action-btn {
      background-color: var(--accent-color);
      color: white;
    }
  }
}

.module-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.module-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  font-size: 32px;
  background-color: #3b82f6;
  border-radius: 12px;
  flex-shrink: 0;
}

.module-title-section {
  flex: 1;
}

.module-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
}

.module-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.module-features {
  flex: 1;
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;

  i {
    color: var(--accent-color);
    font-size: 16px;
    flex-shrink: 0;
    margin-top: 2px;
  }
}

.module-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  i {
    transition: transform 0.2s;
  }

  &:hover i {
    transform: translateX(4px);
  }
}
</style>
