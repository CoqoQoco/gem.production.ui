<template>
  <router-view />
  <loading-overlay />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LoadingOverlay from '@/components/common/loading-overlay.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
</script>

<style>
/* Global styles are imported in main.js */
</style>
