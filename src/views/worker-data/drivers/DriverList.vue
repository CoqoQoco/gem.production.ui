<template>
  <div class="worker-data-page">
    <div class="worker-data-container">
      <!-- Header -->
      <div class="worker-data-header">
        <div class="header-left">
          <h1 class="page-title">
            <i class="pi pi-car"></i>
            {{ t('workerData.driver.title') }}
          </h1>
          <div class="page-breadcrumb">
            <router-link to="/dashboard">{{ t('dashboard.menu.dashboard') }}</router-link>
            <span>/</span>
            <router-link to="/settings">{{ t('dashboard.menu.settings') }}</router-link>
            <span>/</span>
            <span>{{ t('workerData.driver.title') }}</span>
          </div>
        </div>
        <div class="header-right">
          <button class="btn-add-worker" @click="openAddModal">
            <i class="pi pi-plus"></i>
            <span>{{ t('workerData.driver.addNew') }}</span>
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="worker-data-toolbar">
        <div class="toolbar-content">
          <div class="search-box">
            <i class="pi pi-search"></i>
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="t('workerData.driver.searchPlaceholder')"
              @input="handleSearch"
            />
          </div>
          <div class="filter-group">
            <!-- Status Filter -->
            <Dropdown
              v-model="filterStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="t('workerData.form.status')"
              @change="handleFilter"
              style="min-width: 150px"
            />
            <!-- Branch Filter -->
            <Dropdown
              v-model="filterBranch"
              :options="branchOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="t('workerData.form.branch')"
              @change="handleFilter"
              style="min-width: 150px"
            />
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="worker-data-table">
        <DataTable
          :items="paginatedDrivers"
          :columns="columns"
          :totalRecords="filteredDrivers.length"
          :perPage="perPage"
          dataKey="id"
          :paginator="true"
          :showGridlines="true"
          @page="handlePageChange"
          @sort="handleSort"
        >
          <!-- No Column -->
          <template #noTemplate="{ data, index }">
            {{ (currentPage - 1) * perPage + index + 1 }}
          </template>

          <!-- Gender Column -->
          <template #genderTemplate="{ data }">
            <div class="gender-badge">
              <i
                :class="[
                  'pi',
                  data.gender === 'male' ? 'pi-mars male' : 'pi-venus female'
                ]"
              ></i>
              <span>{{ getGenderLabel(data.gender) }}</span>
            </div>
          </template>

          <!-- License Number Column -->
          <template #licenseNumberTemplate="{ data }">
            <span style="font-family: monospace; font-weight: 600">
              {{ data.licenseNumber }}
            </span>
          </template>

          <!-- Vehicle Column -->
          <template #vehicleAssignedTemplate="{ data }">
            <span style="font-size: 13px">
              {{ data.vehicleAssigned || '-' }}
            </span>
          </template>

          <!-- Total Trips Column -->
          <template #totalTripsTemplate="{ data }">
            <span style="font-weight: 600; color: #3b82f6">
              {{ data.totalTrips }}
            </span>
          </template>

          <!-- Rating Column -->
          <template #ratingTemplate="{ data }">
            <div class="rating-display">
              <i class="pi pi-star-fill"></i>
              <span>{{ data.rating }}</span>
            </div>
          </template>

          <!-- Status Column -->
          <template #statusTemplate="{ data }">
            <span
              :class="[
                'status-badge',
                data.status === 'active' ? 'status-active' : 'status-inactive'
              ]"
            >
              <i class="pi pi-circle-fill"></i>
              {{ getStatusLabel(data.status) }}
            </span>
          </template>

          <!-- Branch Column -->
          <template #branchTemplate="{ data }">
            {{ getBranchLabel(data.branchId) }}
          </template>

          <!-- Actions Column -->
          <template #actionsTemplate="{ data }">
            <div class="worker-action-buttons">
              <button
                class="btn-action btn-view"
                @click="viewDriver(data)"
                :title="t('common.view')"
              >
                <i class="pi pi-eye"></i>
              </button>
              <button
                class="btn-action btn-edit"
                @click="editDriver(data)"
                :title="t('common.edit')"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                class="btn-action btn-delete"
                @click="deleteDriver(data)"
                :title="t('common.delete')"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- Worker Form Modal -->
    <WorkerForm
      v-model:visible="showFormModal"
      :workerType="'driver'"
      :editData="selectedDriver"
      @save="handleSave"
    />

    <!-- Alerts -->
    <AlertConfirm
      v-model:visible="showDeleteConfirm"
      :header="t('workerData.driver.delete')"
      :message="t('workerData.driver.deleteConfirm')"
      :confirmText="t('common.delete')"
      :cancelText="t('common.cancel')"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />

    <AlertSubmit
      v-model:visible="showSuccessAlert"
      :header="t('common.success')"
      :message="successMessage"
      :okText="t('common.confirm')"
      @ok="showSuccessAlert = false"
    />

    <AlertError
      v-model:visible="showErrorAlert"
      :header="t('common.error')"
      :message="errorMessage"
      :okText="t('common.close')"
      @ok="showErrorAlert = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import Dropdown from 'primevue/dropdown'
import DataTable from '@/components/prime-vue/data-table.vue'
import { AlertConfirm, AlertSubmit, AlertError } from '@/components/alert'
import WorkerForm from '@/components/worker-data/WorkerForm.vue'
import { driversData, genderOptions, statusOptions as mockStatusOptions } from '@/utils/workerMockData'
import { branches } from '@/utils/mockData'

const { t, locale } = useI18n()
const toast = useToast()

// Data
const drivers = ref([...driversData])
const searchQuery = ref('')
const filterStatus = ref(null)
const filterBranch = ref(null)
const currentPage = ref(1)
const perPage = ref(10)
const selectedDriver = ref(null)
const driverToDelete = ref(null)

// Modals
const showFormModal = ref(false)
const showDeleteConfirm = ref(false)
const showSuccessAlert = ref(false)
const showErrorAlert = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Options
const statusOptions = computed(() => [
  { label: t('common.search') + ' ' + t('workerData.form.status'), value: null },
  ...mockStatusOptions.map(opt => ({
    label: locale.value === 'th' ? opt.labelTh : opt.labelEn,
    value: opt.value
  }))
])

const branchOptions = computed(() => [
  { label: t('common.search') + ' ' + t('workerData.form.branch'), value: null },
  ...branches.map(branch => ({
    label: branch.label,
    value: branch.value
  }))
])

// Table Columns
const columns = computed(() => [
  {
    field: 'no',
    header: t('workerData.table.no'),
    width: '60px',
    align: 'center',
    sortable: false
  },
  {
    field: 'code',
    header: t('workerData.table.code'),
    width: '100px',
    sortable: true
  },
  {
    field: 'nameTh',
    header: t('workerData.table.nameTh'),
    minWidth: '180px',
    sortable: true
  },
  {
    field: 'nameEn',
    header: t('workerData.table.nameEn'),
    minWidth: '180px',
    sortable: true
  },
  {
    field: 'gender',
    header: t('workerData.table.gender'),
    width: '100px',
    align: 'center',
    sortable: true
  },
  {
    field: 'phone',
    header: t('workerData.table.phone'),
    width: '140px',
    sortable: false
  },
  {
    field: 'licenseNumber',
    header: t('workerData.driver.licenseNumber'),
    width: '140px',
    sortable: false
  },
  {
    field: 'vehicleAssigned',
    header: t('workerData.driver.vehicleAssigned'),
    minWidth: '200px',
    sortable: false
  },
  {
    field: 'totalTrips',
    header: t('workerData.driver.totalTrips'),
    width: '120px',
    align: 'center',
    sortable: true
  },
  {
    field: 'rating',
    header: t('workerData.driver.rating'),
    width: '100px',
    align: 'center',
    sortable: true
  },
  {
    field: 'branch',
    header: t('workerData.table.branch'),
    width: '150px',
    sortable: true
  },
  {
    field: 'status',
    header: t('workerData.table.status'),
    width: '120px',
    align: 'center',
    sortable: true
  },
  {
    field: 'actions',
    header: t('workerData.table.actions'),
    width: '140px',
    align: 'center',
    sortable: false
  }
])

// Computed
const filteredDrivers = computed(() => {
  let result = [...drivers.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(driver =>
      driver.code.toLowerCase().includes(query) ||
      driver.nameTh.toLowerCase().includes(query) ||
      driver.nameEn.toLowerCase().includes(query) ||
      driver.phone.includes(query) ||
      driver.email.toLowerCase().includes(query) ||
      driver.licenseNumber.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (filterStatus.value) {
    result = result.filter(driver => driver.status === filterStatus.value)
  }

  // Branch filter
  if (filterBranch.value) {
    result = result.filter(driver => driver.branchId === filterBranch.value)
  }

  return result
})

const paginatedDrivers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredDrivers.value.slice(start, end)
})

// Methods
const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const handlePageChange = (event) => {
  currentPage.value = Math.floor(event.first / event.rows) + 1
  perPage.value = event.rows
}

const handleSort = (event) => {
  console.log('Sort:', event)
}

const getGenderLabel = (gender) => {
  const option = genderOptions.find(opt => opt.value === gender)
  return option ? (locale.value === 'th' ? option.labelTh : option.labelEn) : gender
}

const getStatusLabel = (status) => {
  const option = mockStatusOptions.find(opt => opt.value === status)
  return option ? (locale.value === 'th' ? option.labelTh : option.labelEn) : status
}

const getBranchLabel = (branchId) => {
  const branch = branches.find(b => b.value === branchId)
  return branch ? branch.label : '-'
}

const openAddModal = () => {
  selectedDriver.value = null
  showFormModal.value = true
}

const viewDriver = (driver) => {
  toast.add({
    severity: 'info',
    summary: t('common.info'),
    detail: `View ${driver.nameTh}`,
    life: 3000
  })
}

const editDriver = (driver) => {
  selectedDriver.value = { ...driver }
  showFormModal.value = true
}

const deleteDriver = (driver) => {
  driverToDelete.value = driver
  showDeleteConfirm.value = true
}

const confirmDelete = () => {
  if (driverToDelete.value) {
    const index = drivers.value.findIndex(d => d.id === driverToDelete.value.id)
    if (index !== -1) {
      drivers.value.splice(index, 1)
      successMessage.value = t('workerData.message.deleteSuccess')
      showSuccessAlert.value = true
      driverToDelete.value = null
    }
  }
}

const handleSave = (data) => {
  if (selectedDriver.value) {
    const index = drivers.value.findIndex(d => d.id === selectedDriver.value.id)
    if (index !== -1) {
      drivers.value[index] = { ...data }
      successMessage.value = t('workerData.message.editSuccess')
    }
  } else {
    const newDriver = {
      ...data,
      id: Math.max(...drivers.value.map(d => d.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    drivers.value.push(newDriver)
    successMessage.value = t('workerData.message.addSuccess')
  }
  showSuccessAlert.value = true
  showFormModal.value = false
}

onMounted(() => {
  // Initialize component
})
</script>
