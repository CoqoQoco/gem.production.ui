import { ref } from 'vue'

// Alert composable for managing alert state
export function useAlert() {
  const showSuccessAlert = ref(false)
  const showWarningAlert = ref(false)
  const showErrorAlert = ref(false)
  const showConfirmAlert = ref(false)

  const alertData = ref({
    header: '',
    message: ''
  })

  const confirmCallback = ref(null)

  const success = (header, message, callback = null) => {
    alertData.value = { header, message }
    showSuccessAlert.value = true
    if (callback) {
      confirmCallback.value = callback
    }
  }

  const warning = (header, message, callback = null) => {
    alertData.value = { header, message }
    showWarningAlert.value = true
    if (callback) {
      confirmCallback.value = callback
    }
  }

  const error = (header, message, callback = null) => {
    alertData.value = { header, message }
    showErrorAlert.value = true
    if (callback) {
      confirmCallback.value = callback
    }
  }

  const confirm = (header, message, onConfirm, onCancel = null) => {
    alertData.value = { header, message }
    showConfirmAlert.value = true
    confirmCallback.value = {
      onConfirm,
      onCancel
    }
  }

  const handleOk = () => {
    if (confirmCallback.value && typeof confirmCallback.value === 'function') {
      confirmCallback.value()
    }
    confirmCallback.value = null
  }

  const handleConfirm = () => {
    if (confirmCallback.value?.onConfirm) {
      confirmCallback.value.onConfirm()
    }
    confirmCallback.value = null
  }

  const handleCancel = () => {
    if (confirmCallback.value?.onCancel) {
      confirmCallback.value.onCancel()
    }
    confirmCallback.value = null
  }

  return {
    // Alert states
    showSuccessAlert,
    showWarningAlert,
    showErrorAlert,
    showConfirmAlert,
    alertData,

    // Alert methods
    success,
    warning,
    error,
    confirm,

    // Handlers
    handleOk,
    handleConfirm,
    handleCancel
  }
}

// Global alert instance (singleton pattern)
let globalAlertInstance = null

export function getGlobalAlert() {
  if (!globalAlertInstance) {
    globalAlertInstance = useAlert()
  }
  return globalAlertInstance
}
