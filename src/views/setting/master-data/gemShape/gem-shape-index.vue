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
      :gem-shapes="gemShapes"
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
      :gem-shape-id="selectedGemShapeId"
      @updated="handleUpdated"
    />

    <!-- Confirmation Dialogs -->
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script>
import { useGemShapeApiStore } from '@/stores/api/gem-shape-api'
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
  name: 'GemShapeIndex',

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
      gemShapeApiStore: useGemShapeApiStore(),
      confirm: null,
      toast: null,

      // Data
      gemShapes: [],
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
      selectedGemShapeId: null
    }
  },

  mounted() {
    this.confirm = useConfirm()
    this.toast = useToast()
    this.loadGemShapes()
  },

  methods: {
    /**
     * Load gem shapes list with current search parameters
     */
    async loadGemShapes() {
      this.isLoading = true

      try {
        const result = await this.gemShapeApiStore.listGemShapes({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          sort: this.searchParams.sort,
          criteria: {
            searchText: this.searchParams.searchText || null
          }
        })

        if (result.success) {
          console.log('API result:', result);
          this.gemShapes = result.data
          this.totalRecords = result.totalRecords
          this.perPage = this.searchParams.pageSize
          console.log('Updated data - gemShapes:', this.gemShapes.length, 'totalRecords:', this.totalRecords, 'perPage:', this.perPage);
        } else {
          this.showError(result.message || this.$t('gemShape.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
        }
      } catch (error) {
        this.showError(error.message || this.$t('gemShape.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
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
      this.loadGemShapes()
    },

    /**
     * Handle refresh event
     */
    handleRefresh() {
      this.searchParams.searchText = ''
      this.searchParams.pageIndex = 0
      this.searchParams.sort = []
      this.loadGemShapes()
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
      this.loadGemShapes()
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
      this.loadGemShapes()
    },

    /**
     * Handle edit button click
     */
    handleEdit(gemShape) {
      this.selectedGemShapeId = gemShape.id
      this.showEditModal = true
    },

    /**
     * Handle gem shape created event
     */
    async handleCreated() {
      this.showCreateModal = false
      this.showSuccess(this.$t('gemShape.createSuccess') || 'เพิ่มรูปร่างพลอยสำเร็จ')
      await this.loadGemShapes()
    },

    /**
     * Handle gem shape updated event
     */
    async handleUpdated() {
      this.showEditModal = false
      this.showSuccess(this.$t('gemShape.updateSuccess') || 'อัปเดตรูปร่างพลอยสำเร็จ')
      await this.loadGemShapes()
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
