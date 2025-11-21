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
      :branches="branches"
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
      :branch-id="selectedBranchId"
      @updated="handleUpdated"
    />

    <!-- Confirmation Dialogs -->
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script>
import { useBranchApiStore } from '@/stores/api/branch-api'
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
  name: 'BranchIndex',

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
      branchApiStore: useBranchApiStore(),
      confirm: null,
      toast: null,

      // Data
      branches: [],
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
      selectedBranchId: null
    }
  },

  mounted() {
    this.confirm = useConfirm()
    this.toast = useToast()
    this.loadBranches()
  },

  methods: {
    /**
     * Load branches list with current search parameters
     */
    async loadBranches() {
      this.isLoading = true

      try {
        const result = await this.branchApiStore.listBranches({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          sortBy: this.searchParams.sortBy,
          isDescending: this.searchParams.isDescending,
          criteria: {
            searchText: this.searchParams.searchText || null
          }
        })

        if (result.success) {
          this.branches = result.data
          this.totalRecords = result.totalRecords
          this.perPage = result.pageSize
        } else {
          this.showError(result.message || this.$t('branch.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
        }
      } catch (error) {
        this.showError(error.message || this.$t('branch.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
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
      this.loadBranches()
    },

    /**
     * Handle refresh event
     */
    handleRefresh() {
      this.searchParams.searchText = ''
      this.searchParams.pageIndex = 0
      this.searchParams.sortBy = 'CreateDate'
      this.searchParams.isDescending = true
      this.loadBranches()
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
      this.loadBranches()
    },

    /**
     * Handle sort change event from DataTable
     */
    handleSortChange(params) {
      this.searchParams.sortBy = params.sortBy
      this.searchParams.isDescending = params.isDescending
      this.searchParams.pageIndex = params.pageIndex
      this.searchParams.pageSize = params.pageSize
      this.loadBranches()
    },

    /**
     * Handle edit button click
     */
    handleEdit(branch) {
      this.selectedBranchId = branch.branchId
      this.showEditModal = true
    },

    /**
     * Handle branch created event
     */
    async handleCreated() {
      this.showCreateModal = false
      this.showSuccess(this.$t('branch.createSuccess') || 'เพิ่มสาขาสำเร็จ')
      await this.loadBranches()
    },

    /**
     * Handle branch updated event
     */
    async handleUpdated() {
      this.showEditModal = false
      this.showSuccess(this.$t('branch.updateSuccess') || 'อัปเดตสาขาสำเร็จ')
      await this.loadBranches()
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
