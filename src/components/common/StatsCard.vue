<template>
  <div class="stats-card">
    <div class="stats-icon">{{ stat.icon }}</div>
    <div class="stats-content">
      <p class="stats-label">{{ stat.label }}</p>
      <h3 class="stats-value">{{ stat.value }}</h3>
      <p class="stats-change" :class="stat.changeType">
        <i :class="changeIcon"></i>
        <span>{{ stat.change }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stat: {
    type: Object,
    required: true,
    default: () => ({
      icon: '📊',
      label: 'Label',
      value: '0',
      change: '+0%',
      changeType: 'positive'
    })
  }
})

const changeIcon = computed(() => {
  if (props.stat.changeType === 'positive') return 'pi pi-arrow-up'
  if (props.stat.changeType === 'negative') return 'pi pi-arrow-down'
  return 'pi pi-minus'
})
</script>

<style lang="scss" scoped>
.stats-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
}

.stats-icon {
  font-size: 48px;
  line-height: 1;
}

.stats-content {
  flex: 1;
}

.stats-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.stats-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  margin: 0;

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }

  &.neutral {
    color: #f59e0b;
  }

  i {
    font-size: 12px;
  }
}
</style>
