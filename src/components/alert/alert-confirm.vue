<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :header="header"
    :style="{ width: width }"
    :dismissableMask="dismissableMask"
    :closable="closable"
    :draggable="false"
    class="alert-confirm"
  >
    <template #header>
      <div class="alert-header">
        <div class="alert-icon confirm">
          <i class="pi pi-question-circle"></i>
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
          class="p-button btn-cancel"
          @click="handleCancel"
        >
          <i class="pi pi-times"></i>
          <span>{{ cancelText }}</span>
        </button>
        <button
          class="p-button btn-confirm"
          @click="handleConfirm"
          autofocus
        >
          <i class="pi pi-check"></i>
          <span>{{ confirmText }}</span>
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
    default: 'ยืนยันการดำเนินการ'
  },
  message: {
    type: String,
    default: 'คุณต้องการดำเนินการต่อหรือไม่?'
  },
  confirmText: {
    type: String,
    default: 'ยืนยัน'
  },
  cancelText: {
    type: String,
    default: 'ยกเลิก'
  },
  width: {
    type: String,
    default: '450px'
  },
  dismissableMask: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])

const isVisible = ref(props.visible)

watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
})

watch(isVisible, (newVal) => {
  emit('update:visible', newVal)
})

const handleConfirm = () => {
  emit('confirm')
  isVisible.value = false
}

const handleCancel = () => {
  emit('cancel')
  isVisible.value = false
}
</script>

<style lang="scss" scoped>
:deep(.alert-confirm) {
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
    animation: bounce 0.6s ease-out;

    &.confirm {
      background: linear-gradient(135deg, rgba(239, 233, 201, 0.2) 0%, rgba(239, 233, 201, 0.3) 100%);
      border: 3px solid #e7de99;

      i {
        font-size: 3rem;
        color: #e7de99;
      }
    }
  }

  .alert-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #e7de99;
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

  .btn-cancel {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    border: 2px solid #d1d5db;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
    color: #6b7280;
    min-width: 120px;

    &:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
      color: #374151;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.3);
    }

    i {
      font-size: 1.125rem;
    }
  }

  .btn-confirm {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%);
    color: white;
    min-width: 120px;

    &:hover {
      background: linear-gradient(135deg, #ffa6b1 0%, #ffb0bb 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
    }

    &:active {
      transform: translateY(0);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(239, 233, 201, 0.3);
    }

    i {
      font-size: 1.125rem;
    }
  }
}

@keyframes bounce {
  0% {
    transform: scale(0) translateY(-20px);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) translateY(0);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>
