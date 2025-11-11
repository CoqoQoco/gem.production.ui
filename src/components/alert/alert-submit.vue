<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :header="header"
    :style="{ width: width }"
    :dismissableMask="dismissableMask"
    :closable="closable"
    :draggable="false"
    class="alert-submit"
  >
    <template #header>
      <div class="alert-header">
        <div class="alert-icon success">
          <i class="pi pi-check-circle"></i>
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
    default: 'สำเร็จ'
  },
  message: {
    type: String,
    default: 'ดำเนินการเรียบร้อยแล้ว'
  },
  okText: {
    type: String,
    default: 'ตรวจสอบ'
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
:deep(.alert-submit) {
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
    animation: scaleIn 0.3s ease-out;

    &.success {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.2) 100%);
      border: 3px solid #22c55e;

      i {
        font-size: 3rem;
        color: #22c55e;
      }
    }
  }

  .alert-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #22c55e;
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
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
    min-width: 120px;

    &:hover {
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(34, 197, 94, 0.3);
    }

    &:active {
      transform: translateY(0);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
    }

    i {
      font-size: 1.125rem;
    }
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
