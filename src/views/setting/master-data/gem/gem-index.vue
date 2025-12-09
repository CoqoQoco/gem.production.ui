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
      :gems="gems"
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
      :gem-id="selectedGemId"
      @updated="handleUpdated"
    />

    <!-- Confirmation Dialogs -->
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script>
import { useGemApiStore } from '@/stores/api/gem-api'
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
  name: 'GemIndex',

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
      gemApiStore: useGemApiStore(),
      confirm: null,
      toast: null,

      // Data
      gems: [],
      totalRecords: 0,
      perPage: 10,

      // Search Parameters
      searchParams: {
        pageIndex: 0,
        pageSize: 10,
        sort: [],
        searchText: ''
      },

      // UI State
      isLoading: false,
      showCreateModal: false,
      showEditModal: false,
      selectedGemId: null
    }
  },

  mounted() {
    this.confirm = useConfirm()
    this.toast = useToast()
    this.loadGems()
  },

  methods: {
    /**
     * Load gems list with current search parameters
     */
    async loadGems() {
      this.isLoading = true

      try {
        const result = await this.gemApiStore.listGems({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          sort: this.searchParams.sort,
          criteria: {
            searchText: this.searchParams.searchText || null
          }
        })

        if (result.success) {
          console.log('API result:', result);
          this.gems = result.data
          this.totalRecords = result.totalRecords
          this.perPage = this.searchParams.pageSize
          console.log('Updated data - gems:', this.gems.length, 'totalRecords:', this.totalRecords, 'perPage:', this.perPage);
        } else {
          this.showError(result.message || this.$t('gem.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
        }
      } catch (error) {
        this.showError(error.message || this.$t('gem.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
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
      this.loadGems()
    },

    /**
     * Handle refresh event
     */
    handleRefresh() {
      this.searchParams.searchText = ''
      this.searchParams.pageIndex = 0
      this.searchParams.sort = []
      this.loadGems()
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
      console.log('handlePageChange received:', params);
      this.searchParams.pageIndex = params.pageIndex
      this.searchParams.pageSize = params.pageSize
      console.log('Updated searchParams:', this.searchParams);
      this.loadGems()
    },

    /**
     * Handle sort change event from DataTable
     */
    handleSortChange(params) {
      console.log('handleSortChange received:', params);
      this.searchParams.sort = params.sort || []
      this.searchParams.pageIndex = params.first / params.rows
      this.searchParams.pageSize = params.rows
      console.log('Updated sort:', this.searchParams.sort);
      this.loadGems()
    },

    /**
     * Handle edit button click
     */
    handleEdit(gem) {
      this.selectedGemId = gem.id
      this.showEditModal = true
    },

    /**
     * Handle gem created event
     */
    async handleCreated() {
      this.showCreateModal = false
      this.showSuccess(this.$t('gem.createSuccess') || 'เพิ่มพลอยสำเร็จ')
      await this.loadGems()
    },

    /**
     * Handle gem updated event
     */
    async handleUpdated() {
      this.showEditModal = false
      this.showSuccess(this.$t('gem.updateSuccess') || 'อัปเดตพลอยสำเร็จ')
      await this.loadGems()
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
