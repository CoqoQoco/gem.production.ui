<template>
  <div class="list-page-container">
    <!-- Search Header Component -->
    <SearchView
      :filters="mainFilters"
      :advanced-filters="advancedFilters"
      :loading="isLoading"
      @search="handleSearch"
      @refresh="handleRefresh"
      @advanced-filter="showFilterDialog = true"
      @clear-all="handleClearAll"
      @remove-filter="handleRemoveFilter"
    />

    <!-- Data Table Component -->
    <DataTableView
      :stocks="stocks"
      :total-records="totalRecords"
      :per-page="perPage"
      :loading="isLoading"
      @page-change="handlePageChange"
      @sort-change="handleSortChange"
    />

    <!-- Filter Dialog -->
    <FilterDialog
      v-model:visible="showFilterDialog"
      :filters="advancedFilters"
      @apply="handleApplyAdvancedFilters"
      @clear="handleClearAdvancedFilters"
    />

    <!-- Toast -->
    <Toast />
  </div>
</template>

<script>
import { useStockApiStore } from '@/stores/api/stock-api'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'

// Components
import SearchView from './components/search-view.vue'
import DataTableView from './components/data-table-view.vue'
import FilterDialog from './components/filter-dialog.vue'

export default {
  name: 'InventoryIndex',

  components: {
    SearchView,
    DataTableView,
    FilterDialog,
    Toast
  },

  data() {
    return {
      // Store
      stockApiStore: useStockApiStore(),
      toast: null,

      // Data
      stocks: [],
      totalRecords: 0,
      perPage: 10,

      // Main Filters (visible in search bar)
      mainFilters: {
        stockNumbers: [],
        productCodes: [],
        receiptDateMin: null,
        receiptDateMax: null
      },

      // Advanced Filters (in dialog)
      advancedFilters: {
        productTypeCodes: null,
        priceMin: null,
        priceMax: null,
        branchIds: null,
        goldFilter: {
          typeCode1: null,
          typeCode2: null
        },
        gemFilter: {
          typeCode1: null,
          typeCode2: null
        }
      },

      // Search Parameters for API
      searchParams: {
        pageIndex: 0,
        pageSize: 10,
        sort: []
      },

      // UI State
      isLoading: false,
      showFilterDialog: false
    }
  },

  mounted() {
    this.toast = useToast()
    this.loadStocks()
  },

  methods: {
    /**
     * Load stock inventory list with current search parameters
     */
    async loadStocks() {
      this.isLoading = true

      try {
        // Merge main filters and advanced filters
        const criteria = {
          receiptDateMin: this.mainFilters.receiptDateMin ? this.formatDateToLocalISO(this.mainFilters.receiptDateMin, true) : null,
          receiptDateMax: this.mainFilters.receiptDateMax ? this.formatDateToLocalISO(this.mainFilters.receiptDateMax, false) : null,
          productCodes: this.mainFilters.productCodes,
          stockNumbers: this.mainFilters.stockNumbers,
          productTypeCodes: this.advancedFilters.productTypeCodes,
          priceMin: this.advancedFilters.priceMin,
          priceMax: this.advancedFilters.priceMax,
          branchIds: this.advancedFilters.branchIds,
          goldFilter: this.advancedFilters.goldFilter,
          gemFilter: this.advancedFilters.gemFilter
        }


        const result = await this.stockApiStore.listStockInventory({
          pageIndex: this.searchParams.pageIndex,
          pageSize: this.searchParams.pageSize,
          sort: this.searchParams.sort,
          criteria
        })

        if (result.success) {
          this.stocks = result.data
          this.totalRecords = result.totalRecords
          this.perPage = this.searchParams.pageSize
        } else {
          this.showError(result.message || this.$t('stockInventory.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
        }
      } catch (error) {
        this.showError(error.message || this.$t('stockInventory.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Handle search event from SearchView (main filters)
     */
    handleSearch(filters) {
      console.log('Inventory Index - handleSearch received filters:', filters)
      this.mainFilters = { ...filters }
      console.log('Inventory Index - mainFilters updated to:', this.mainFilters)
      this.searchParams.pageIndex = 0 // Reset to first page
      this.loadStocks()
    },

    /**
     * Handle apply advanced filters from dialog
     */
    handleApplyAdvancedFilters(filters) {
      this.advancedFilters = { ...filters }
      this.searchParams.pageIndex = 0 // Reset to first page
      this.loadStocks()
    },

    /**
     * Handle clear advanced filters
     */
    handleClearAdvancedFilters() {
      this.advancedFilters = {
        productTypeCodes: null,
        priceMin: null,
        priceMax: null,
        branchIds: null,
        goldFilter: {
          typeCode1: null,
          typeCode2: null
        },
        gemFilter: {
          typeCode1: null,
          typeCode2: null
        }
      }
      this.searchParams.pageIndex = 0
      this.loadStocks()
    },

    /**
     * Handle clear all filters
     */
    handleClearAll() {
      this.mainFilters = {
        stockNumbers: [],
        productCodes: [],
        receiptDateMin: null,
        receiptDateMax: null
      }
      this.advancedFilters = {
        productTypeCodes: null,
        priceMin: null,
        priceMax: null,
        branchIds: null,
        goldFilter: {
          typeCode1: null,
          typeCode2: null
        },
        gemFilter: {
          typeCode1: null,
          typeCode2: null
        }
      }
      this.searchParams.pageIndex = 0
      this.loadStocks()
    },

    /**
     * Handle remove individual filter
     */
    handleRemoveFilter(key) {
      if (key === 'stockNumbers') {
        this.mainFilters.stockNumbers = []
      } else if (key === 'productCodes') {
        this.mainFilters.productCodes = []
      } else if (key === 'receiptDate') {
        this.mainFilters.receiptDateMin = null
        this.mainFilters.receiptDateMax = null
      }
      this.searchParams.pageIndex = 0
      this.loadStocks()
    },

    /**
     * Handle refresh event
     */
    handleRefresh() {
      this.mainFilters = {
        stockNumbers: [],
        productCodes: [],
        receiptDateMin: null,
        receiptDateMax: null
      }
      this.advancedFilters = {
        productTypeCodes: null,
        priceMin: null,
        priceMax: null,
        branchIds: null,
        goldFilter: {
          typeCode1: null,
          typeCode2: null
        },
        gemFilter: {
          typeCode1: null,
          typeCode2: null
        }
      }
      this.searchParams.pageIndex = 0
      this.searchParams.sort = []
      this.loadStocks()
    },

    /**
     * Handle page change event from DataTable
     */
    handlePageChange(params) {
      console.log('handlePageChange received:', params)
      this.searchParams.pageIndex = params.pageIndex
      this.searchParams.pageSize = params.pageSize
      console.log('Updated searchParams:', this.searchParams)
      this.loadStocks()
    },

    /**
     * Handle sort change event from DataTable
     */
    handleSortChange(params) {
      console.log('handleSortChange received:', params)
      this.searchParams.sort = params.sort || []
      this.searchParams.pageIndex = params.first / params.rows
      this.searchParams.pageSize = params.rows
      console.log('Updated sort:', this.searchParams.sort)
      this.loadStocks()
    },

    /**
     * Format date to local ISO string (keeping timezone offset)
     * @param {Date} date - The date to format
     * @param {Boolean} isStartOfDay - If true, set to 00:00:00, otherwise 23:59:59
     * @returns {String} ISO string with local timezone offset
     */
    formatDateToLocalISO(date, isStartOfDay = true) {
      if (!date) return null

      const d = new Date(date)

      if (isStartOfDay) {
        // Set to start of day: 00:00:00
        d.setHours(0, 0, 0, 0)
      } else {
        // Set to end of day: 23:59:59
        d.setHours(23, 59, 59, 999)
      }

      // Get timezone offset in minutes
      const tzOffset = d.getTimezoneOffset()
      const offsetHours = Math.floor(Math.abs(tzOffset) / 60)
      const offsetMinutes = Math.abs(tzOffset) % 60
      const offsetSign = tzOffset <= 0 ? '+' : '-'

      // Format: YYYY-MM-DDTHH:mm:ss+07:00
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      const seconds = String(d.getSeconds()).padStart(2, '0')

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`
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
