<template>
  <div class="coming-soon-page">
    <div class="coming-soon-container">
      <div class="icon-wrapper">
        <i class="pi pi-clock"></i>
      </div>
      <h1 class="title">{{ $t('common.comingSoon') }}</h1>
      <p class="message">{{ $t('common.featureInDevelopment') }}</p>
      <p class="feature-name">{{ featureName }}</p>
      <Button
        :label="$t('dashboard.menu.dashboard')"
        icon="pi pi-home"
        @click="goToDashboard"
        outlined
        class="back-button"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComingSoonView',

  computed: {
    featureName() {
      return this.$route.meta?.title || 'This Feature'
    }
  },

  methods: {
    goToDashboard() {
      this.$router.push('/dashboard')
    }
  }
}
</script>

<style lang="scss" scoped>
.coming-soon-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  padding: 2rem;
}

.coming-soon-container {
  text-align: center;
  max-width: 500px;
  background: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  .icon-wrapper {
    margin-bottom: 2rem;

    i {
      font-size: 5rem;
      color: #f58511;
      animation: pulse 2s infinite;
    }
  }

  .title {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }

  .message {
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0 0 0.5rem 0;
  }

  .feature-name {
    font-size: 1rem;
    font-weight: 600;
    color: #f58511;
    margin: 0 0 2rem 0;
  }

  .back-button {
    margin-top: 1rem;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

@media (max-width: 768px) {
  .coming-soon-container {
    padding: 2rem 1.5rem;

    .icon-wrapper i {
      font-size: 4rem;
    }

    .title {
      font-size: 1.5rem;
    }

    .message {
      font-size: 1rem;
    }
  }
}
</style>
