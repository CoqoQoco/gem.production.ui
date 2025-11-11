<template>
  <div class="welcome-section">
    <div class="welcome-greeting">
      <h2 class="greeting-text">
        {{ t('dashboard.greeting', { name: user.fullName }) }} 👋
      </h2>
      <p class="greeting-subtitle">
        <i class="pi pi-map-marker"></i>
        <span>{{ branch }}</span>
        <span class="separator">|</span>
        <span>{{ currentDateThai }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      fullName: 'User'
    })
  },
  branch: {
    type: String,
    default: 'สาขาสำนักงานใหญ่'
  }
})

const { t, locale } = useI18n()

const currentDateThai = computed(() => {
  const date = new Date()

  if (locale.value === 'th') {
    const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]

    const dayName = thaiDays[date.getDay()]
    const day = date.getDate()
    const month = thaiMonths[date.getMonth()]
    const year = date.getFullYear() + 543 // Buddhist calendar

    return `${dayName}ที่ ${day} ${month} ${year}`
  } else {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }
})
</script>

<style lang="scss" scoped>
.welcome-section {
  background: linear-gradient(
    135deg,
    rgba(245, 133, 17, 0.05) 0%,
    rgba(98, 125, 152, 0.05) 100%
  );
  padding: 32px 24px;
  border-radius: 16px;
  margin: 24px 0;
}

.welcome-greeting {
  text-align: center;
}

.greeting-text {
  font-size: 30px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
}

.greeting-subtitle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  color: #6b7280;
  margin: 0;

  i {
    color: #f58511;
  }

  .separator {
    color: #d1d5db;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    flex-wrap: wrap;
  }
}
</style>
