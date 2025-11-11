<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :header="header"
    :style="{ width: width }"
    :dismissableMask="dismissableMask"
    :closable="closable"
    :draggable="false"
    class="alert-error"
  >
    <template #header>
      <div class="alert-header">
        <div class="alert-icon error">
          <i class="pi pi-times-circle"></i>
        </div>
        <h3 class="alert-title">{{ header }}</h3>
      </div>
    </template>

    <div class="alert-content">
      <p class="alert-message">{{ message }}</p>
      <slot></slot>
    </div>

    <template #footer>
      <div class="alert-footer">
        <button
          class="p-button btn-ok"
          @click="handleOk"
          autofocus
        >
          <i class="pi pi-check"></i>
          <span>{{ okText }}</span>
        </button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  header: {
    type: String,
    default: 'ข้อผิดพลาด'
  },
  message: {
    type: String,
    default: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
  },
  okText: {
    type: String,
    default: 'ปิด'
  },
  width: {
    type: String,
    default: '450px'
  },
  dismissableMask: {
    type: Boolean,
    default: true
  },
  closable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:visible', 'ok'])

const isVisible = ref(props.visible)

watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
})

watch(isVisible, (newVal) => {
  emit('update:visible', newVal)
})

const handleOk = () => {
  emit('ok')
  isVisible.value = false
}
</script>

<style lang="scss" scoped>
:deep(.alert-error) {
  .p-dialog-header {
    padding: 0;
    border-bottom: none;
  }

  .p-dialog-content {
    padding: 1.5rem 2rem;
  }

  .p-dialog-footer {
    padding: 1rem 2rem 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
}

.alert-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 2rem 1rem;
  text-align: center;

  .alert-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    animation: pulse 0.5s ease-out;

    &.error {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.2) 100%);
      border: 3px solid #ef4444;

      i {
        font-size: 3rem;
        color: #ef4444;
      }
    }
  }

  .alert-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ef4444;
    margin: 0;
  }
}

.alert-content {
  text-align: center;

  .alert-message {
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
  }
}

.alert-footer {
  display: flex;
  justify-content: center;
  gap: 0.75rem;

  .btn-ok {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    min-width: 120px;

    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
    }

    &:active {
      transform: translateY(0);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
    }

    i {
      font-size: 1.125rem;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
