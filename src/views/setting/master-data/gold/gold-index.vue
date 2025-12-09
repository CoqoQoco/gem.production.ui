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
      :golds="golds"
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
      :gold-id="selectedGoldId"
      @updated="handleUpdated"
    />

    <!-- Confirmation Dialogs -->
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script>
import { useGoldApiStore } from '@/stores/api/gold-api'
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
  name: 'GoldIndex',

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
      goldApiStore: useGoldApiStore(),
      confirm: null,
      toast: null,

      // Data
      golds: [],
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
      selectedGoldId: null
    }
  },

  mounted() {
    this.confirm = useConfirm()
    this.toast = useToast()
    this.loadGolds()
  },

  methods: {
    /**
     * Load golds list with current search parameters
     */
    async loadGolds() {
      this.isLoading = true

      try {
        const result = await this.goldApiStore.listGolds({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          sort: this.searchParams.sort,
          criteria: {
            searchText: this.searchParams.searchText || null
          }
        })

        if (result.success) {
          console.log('API result:', result);
          this.golds = result.data
          this.totalRecords = result.totalRecords
          this.perPage = this.searchParams.pageSize
          console.log('Updated data - golds:', this.golds.length, 'totalRecords:', this.totalRecords, 'perPage:', this.perPage);
        } else {
          this.showError(result.message || this.$t('gold.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
        }
      } catch (error) {
        this.showError(error.message || this.$t('gold.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
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
      this.loadGolds()
    },

    /**
     * Handle refresh event
     */
    handleRefresh() {
      this.searchParams.searchText = ''
      this.searchParams.pageIndex = 0
      this.searchParams.sort = []
      this.loadGolds()
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
      this.loadGolds()
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
      this.loadGolds()
    },

    /**
     * Handle edit button click
     */
    handleEdit(gold) {
      this.selectedGoldId = gold.id
      this.showEditModal = true
    },

    /**
     * Handle gold created event
     */
    async handleCreated() {
      this.showCreateModal = false
      this.showSuccess(this.$t('gold.createSuccess') || 'เพิ่มทองสำเร็จ')
      await this.loadGolds()
    },

    /**
     * Handle gold updated event
     */
    async handleUpdated() {
      this.showEditModal = false
      this.showSuccess(this.$t('gold.updateSuccess') || 'อัปเดตทองสำเร็จ')
      await this.loadGolds()
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
