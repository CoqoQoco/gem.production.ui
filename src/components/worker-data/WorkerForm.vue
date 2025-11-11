<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :header="dialogTitle"
    :style="{ width: '800px' }"
    :dismissableMask="false"
    :closable="true"
    :draggable="false"
    class="worker-form-modal"
  >
    <div class="worker-form">
      <!-- Basic Information Section -->
      <div class="form-section">
        <div class="section-title">
          <i class="pi pi-user"></i>
          <span>{{ t('workerData.form.basicInfo') }}</span>
        </div>
        <div class="form-grid">
          <!-- Code (Auto-generated, disabled) -->
          <div class="form-group">
            <label>
              {{ t('workerData.form.code') }}
            </label>
            <input
              type="text"
              v-model="formData.code"
              :placeholder="t('workerData.form.codePlaceholder')"
              disabled
            />
          </div>

          <!-- Status -->
          <div class="form-group">
            <label>
              {{ t('workerData.form.status') }}
              <span class="required">*</span>
            </label>
            <Dropdown
              v-model="formData.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="t('workerData.form.statusPlaceholder')"
              :class="{ error: errors.status }"
            />
            <span v-if="errors.status" class="error-message">{{ errors.status }}</span>
          </div>

          <!-- Name Thai -->
          <div class="form-group">
            <label>
              {{ t('workerData.form.nameTh') }}
              <span class="required">*</span>
            </label>
            <input
              type="text"
              v-model="formData.nameTh"
              :placeholder="t('workerData.form.nameThPlaceholder')"
              :class="{ error: errors.nameTh }"
            />
            <span v-if="errors.nameTh" class="error-message">{{ errors.nameTh }}</span>
          </div>

          <!-- Name English -->
          <div class="form-group">
            <label>
              {{ t('workerData.form.nameEn') }}
              <span class="required">*</span>
            </label>
            <input
              type="text"
              v-model="formData.nameEn"
              :placeholder="t('workerData.form.nameEnPlaceholder')"
              :class="{ error: errors.nameEn }"
            />
            <span v-if="errors.nameEn" class="error-message">{{ errors.nameEn }}</span>
          </div>

          <!-- Gender -->
          <div class="form-group">
            <label>
              {{ t('workerData.form.gender') }}
              <span class="required">*</span>
            </label>
            <Dropdown
              v-model="formData.gender"
              :options="genderOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="t('workerData.form.genderPlaceholder')"
              :class="{ error: errors.gender }"
            />
            <span v-if="errors.gender" class="error-message">{{ errors.gender }}</span>
          </div>

          <!-- Branch -->
          <div class="form-group">
            <label>
              {{ t('workerData.form.branch') }}
              <span class="required">*</span>
            </label>
            <Dropdown
              v-model="formData.branchId"
              :options="branchOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="t('workerData.form.branchPlaceholder')"
              :class="{ error: errors.branchId }"
            />
            <span v-if="errors.branchId" class="error-message">{{ errors.branchId }}</span>
          </div>
        </div>
      </div>

      <!-- Contact Information Section -->
      <div class="form-section">
        <div class="section-title">
          <i class="pi pi-phone"></i>
          <span>{{ t('workerData.form.contactInfo') }}</span>
        </div>
        <div class="form-grid">
          <!-- Phone -->
          <div class="form-group">
            <label>
              {{ t('workerData.form.phone') }}
              <span class="required">*</span>
            </label>
            <input
              type="tel"
              v-model="formData.phone"
              :placeholder="t('workerData.form.phonePlaceholder')"
              :class="{ error: errors.phone }"
            />
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label>{{ t('workerData.form.email') }}</label>
            <input
              type="email"
              v-model="formData.email"
              :placeholder="t('workerData.form.emailPlaceholder')"
              :class="{ error: errors.email }"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <!-- Address (Full Width) -->
          <div class="form-group form-grid-full">
            <label>{{ t('workerData.form.address') }}</label>
            <textarea
              v-model="formData.address"
              :placeholder="t('workerData.form.addressPlaceholder')"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Additional Information Section (Type-specific) -->
      <div class="form-section" v-if="workerType">
        <div class="section-title">
          <i class="pi pi-info-circle"></i>
          <span>{{ t('workerData.form.additionalInfo') }}</span>
        </div>
        <div class="form-grid">
          <!-- Guide: Languages (Multiple Select) -->
          <template v-if="workerType === 'guide'">
            <div class="form-group form-grid-full">
              <label>{{ t('workerData.guide.languages') }}</label>
              <MultiSelect
                v-model="formData.languages"
                :options="languageOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="t('workerData.guide.languages')"
                display="chip"
              />
            </div>
          </template>

          <!-- Sales: Sales Target & Commission -->
          <template v-if="workerType === 'sales'">
            <div class="form-group">
              <label>{{ t('workerData.sales.salesTarget') }}</label>
              <input
                type="number"
                v-model.number="formData.salesTarget"
                placeholder="0.00"
              />
            </div>
            <div class="form-group">
              <label>{{ t('workerData.sales.commission') }}</label>
              <input
                type="number"
                v-model.number="formData.commission"
                placeholder="0.00"
              />
            </div>
          </template>

          <!-- Driver: License Info & Vehicle -->
          <template v-if="workerType === 'driver'">
            <div class="form-group">
              <label>{{ t('workerData.driver.licenseNumber') }}</label>
              <input
                type="text"
                v-model="formData.licenseNumber"
                placeholder="XX-XXXXXX"
              />
            </div>
            <div class="form-group">
              <label>{{ t('workerData.driver.licenseExpiry') }}</label>
              <input
                type="date"
                v-model="formData.licenseExpiry"
              />
            </div>
            <div class="form-group form-grid-full">
              <label>{{ t('workerData.driver.vehicleAssigned') }}</label>
              <input
                type="text"
                v-model="formData.vehicleAssigned"
                placeholder="Toyota Commuter - ABC-1234"
              />
            </div>
          </template>

          <!-- Join Date -->
          <div class="form-group">
            <label>{{ t('workerData.form.joinDate') }}</label>
            <input
              type="date"
              v-model="formData.joinDate"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="form-buttons">
        <button class="btn-cancel" @click="handleCancel">
          <i class="pi pi-times"></i>
          <span>{{ t('common.cancel') }}</span>
        </button>
        <button class="btn-submit" @click="handleSubmit">
          <i class="pi pi-check"></i>
          <span>{{ t('common.save') }}</span>
        </button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import { genderOptions as mockGenderOptions, statusOptions as mockStatusOptions, languageOptions as mockLanguageOptions, generateWorkerCode } from '@/utils/workerMockData'
import { branches } from '@/utils/mockData'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  workerType: {
    type: String,
    required: true,
    validator: (value) => ['guide', 'sales', 'driver'].includes(value)
  },
  editData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'save'])

const { t, locale } = useI18n()

// State
const isVisible = ref(props.visible)
const formData = ref({
  code: '',
  nameTh: '',
  nameEn: '',
  gender: null,
  phone: '',
  email: '',
  address: '',
  branchId: null,
  status: 'active',
  joinDate: new Date().toISOString().split('T')[0],
  // Guide specific
  languages: [],
  rating: 0,
  totalTrips: 0,
  // Sales specific
  salesTarget: 0,
  totalSales: 0,
  commission: 0,
  // Driver specific
  licenseNumber: '',
  licenseExpiry: '',
  vehicleAssigned: '',
})
const errors = ref({})

// Computed
const dialogTitle = computed(() => {
  if (props.editData) {
    if (props.workerType === 'guide') return t('workerData.guide.edit')
    if (props.workerType === 'sales') return t('workerData.sales.edit')
    if (props.workerType === 'driver') return t('workerData.driver.edit')
  } else {
    if (props.workerType === 'guide') return t('workerData.guide.addNew')
    if (props.workerType === 'sales') return t('workerData.sales.addNew')
    if (props.workerType === 'driver') return t('workerData.driver.addNew')
  }
  return ''
})

const statusOptions = computed(() =>
  mockStatusOptions.map(opt => ({
    label: locale.value === 'th' ? opt.labelTh : opt.labelEn,
    value: opt.value
  }))
)

const genderOptions = computed(() =>
  mockGenderOptions.map(opt => ({
    label: locale.value === 'th' ? opt.labelTh : opt.labelEn,
    value: opt.value
  }))
)

const branchOptions = computed(() =>
  branches.map(branch => ({
    label: branch.label,
    value: branch.value
  }))
)

const languageOptions = computed(() =>
  mockLanguageOptions.map(opt => ({
    label: locale.value === 'th' ? opt.labelTh : opt.labelEn,
    value: opt.value
  }))
)

// Watchers
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    resetForm()
    if (props.editData) {
      // Load edit data
      formData.value = { ...props.editData }
    } else {
      // Generate new code for new record
      formData.value.code = generateWorkerCode(props.workerType)
    }
  }
})

watch(isVisible, (newVal) => {
  emit('update:visible', newVal)
})

// Methods
const resetForm = () => {
  formData.value = {
    code: '',
    nameTh: '',
    nameEn: '',
    gender: null,
    phone: '',
    email: '',
    address: '',
    branchId: null,
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    languages: [],
    rating: 0,
    totalTrips: 0,
    salesTarget: 0,
    totalSales: 0,
    commission: 0,
    licenseNumber: '',
    licenseExpiry: '',
    vehicleAssigned: '',
  }
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}

  // Required fields
  if (!formData.value.nameTh) {
    errors.value.nameTh = t('workerData.message.requiredFields')
  }
  if (!formData.value.nameEn) {
    errors.value.nameEn = t('workerData.message.requiredFields')
  }
  if (!formData.value.gender) {
    errors.value.gender = t('workerData.message.requiredFields')
  }
  if (!formData.value.phone) {
    errors.value.phone = t('workerData.message.requiredFields')
  } else if (!/^[0-9-]{10,12}$/.test(formData.value.phone.replace(/-/g, ''))) {
    errors.value.phone = t('workerData.message.invalidPhone')
  }
  if (!formData.value.branchId) {
    errors.value.branchId = t('workerData.message.requiredFields')
  }
  if (!formData.value.status) {
    errors.value.status = t('workerData.message.requiredFields')
  }

  // Email validation (optional but must be valid if provided)
  if (formData.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = t('workerData.message.invalidEmail')
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  emit('save', { ...formData.value })
  isVisible.value = false
}

const handleCancel = () => {
  isVisible.value = false
}
</script>

<style lang="scss" scoped>
// Import worker-data styles
@import '@/assets/styles/components/worker-data';
</style>
