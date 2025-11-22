<template>
  <div class="list-page-container">
    <!-- Search Header Component -->
    <SearchView
      :search-text="searchParams.searchText"
      :loading="isLoading"
      @search="handleSearch"
      @refresh="handleRefresh"
      @add="handleAdd"
    />

    <!-- Data Table Component -->
    <DataTableView
      :worker-guides="workerGuides"
      :total-records="totalRecords"
      :per-page="perPage"
      :loading="isLoading"
      @page-change="handlePageChange"
      @sort-change="handleSortChange"
      @edit="handleEdit"
    />

    <!-- Create Modal Component -->
    <CreateView
      v-model:visible="showCreateModal"
      @created="handleCreated"
    />

    <!-- Edit Modal Component -->
    <EditView
      v-model:visible="showEditModal"
      :worker-guide-id="selectedWorkerGuideId"
      @updated="handleUpdated"
    />

    <!-- Confirmation Dialogs -->
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script>
import { useWorkerGuideApiStore } from '@/stores/api/worker-guide-api'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'

// Components
import SearchView from './components/search-view.vue'
import DataTableView from './components/data-table-view.vue'
import CreateView from './modal/create-view.vue'
import EditView from './modal/edit-view.vue'

export default {
  name: 'WorkerGuideIndex',

  components: {
    SearchView,
    DataTableView,
    CreateView,
    EditView,
    ConfirmDialog,
    Toast
  },

  data() {
    return {
      // Store
      workerGuideApiStore: useWorkerGuideApiStore(),
      confirm: null,
      toast: null,

      // Data
      workerGuides: [],
      totalRecords: 0,
      perPage: 10,

      // Search Parameters
      searchParams: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: 'CreateDate',
        isDescending: true,
        searchText: ''
      },

      // UI State
      isLoading: false,
      showCreateModal: false,
      showEditModal: false,
      selectedWorkerGuideId: null
    }
  },

  mounted() {
    this.confirm = useConfirm()
    this.toast = useToast()
    this.loadWorkerGuides()
  },

  methods: {
    /**
     * Load worker guides list with current search parameters
     */
    async loadWorkerGuides() {
      this.isLoading = true

      try {
        const result = await this.workerGuideApiStore.listWorkerGuides({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          sortBy: this.searchParams.sortBy,
          isDescending: this.searchParams.isDescending,
          criteria: {
            searchText: this.searchParams.searchText || null
          }
        })

        if (result.success) {
          this.workerGuides = result.data
          this.totalRecords = result.totalRecords
          this.perPage = result.pageSize
        } else {
          this.showError(result.message || this.$t('workerGuide.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
        }
      } catch (error) {
        this.showError(error.message || this.$t('workerGuide.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Handle search event from SearchView
     */
    handleSearch(params) {
      this.searchParams.searchText = params.searchText
      this.searchParams.pageIndex = 0 // Reset to first page
      this.loadWorkerGuides()
    },

    /**
     * Handle refresh event
     */
    handleRefresh() {
      this.searchParams.searchText = ''
      this.searchParams.pageIndex = 0
      this.searchParams.sortBy = 'CreateDate'
      this.searchParams.isDescending = true
      this.loadWorkerGuides()
    },

    /**
     * Handle add button click
     */
    handleAdd() {
      this.showCreateModal = true
    },

    /**
     * Handle page change event from DataTable
     */
    handlePageChange(params) {
      this.searchParams.pageIndex = params.pageIndex
      this.searchParams.pageSize = params.pageSize
      this.loadWorkerGuides()
    },

    /**
     * Handle sort change event from DataTable
     */
    handleSortChange(params) {
      this.searchParams.sortBy = params.sortBy
      this.searchParams.isDescending = params.isDescending
      this.searchParams.pageIndex = params.pageIndex
      this.searchParams.pageSize = params.pageSize
      this.loadWorkerGuides()
    },

    /**
     * Handle edit button click
     */
    handleEdit(workerGuide) {
      this.selectedWorkerGuideId = workerGuide.id
      this.showEditModal = true
    },

    /**
     * Handle worker guide created event
     */
    async handleCreated() {
      this.showCreateModal = false
      this.showSuccess(this.$t('workerGuide.createSuccess') || 'เพิ่มไกด์สำเร็จ')
      await this.loadWorkerGuides()
    },

    /**
     * Handle worker guide updated event
     */
    async handleUpdated() {
      this.showEditModal = false
      this.showSuccess(this.$t('workerGuide.updateSuccess') || 'อัปเดตไกด์สำเร็จ')
      await this.loadWorkerGuides()
    },

    /**
     * Show success toast
     */
    showSuccess(message) {
      this.toast.add({
        severity: 'success',
        summary: this.$t('common.success') || 'สำเร็จ',
        detail: message,
        life: 3000
      })
    },

    /**
     * Show error toast
     */
    showError(message) {
      this.toast.add({
        severity: 'error',
        summary: this.$t('common.error') || 'ผิดพลาด',
        detail: message,
        life: 5000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/list-page-templete/index-view.scss';
</style>
