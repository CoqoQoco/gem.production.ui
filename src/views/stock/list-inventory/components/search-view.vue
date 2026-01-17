<template>
  <div class="list-search-header">
    <div class="list-search-container">
      <!-- Page Title -->
      <div class="list-page-title-section">
        <h2 class="list-page-title">
          <i class="pi pi-box"></i>
          {{ $t("stockInventory.title") || "รายการสินค้าคงคลัง" }}
        </h2>
        <p class="list-page-subtitle">
          {{ $t("stockInventory.subtitle") || "จัดการและค้นหารายการสินค้าคงคลัง" }}
        </p>
      </div>

      <!-- Main Filters Row -->
      <div class="main-filters-row">
        <!-- Stock Number -->
        <div class="filter-field">
          <label class="filter-label">{{ $t('stockInventory.filters.stockNumber') || 'Stock Number' }}</label>
          <InputChips
            v-model="localFilters.stockNumbers"
            :placeholder="$t('stockInventory.filters.stockNumberPlaceholder') || 'กด Enter เพื่อเพิ่ม'"
            class="filter-chips"
            @add="trimChipValue($event, 'stockNumbers')"
          />
        </div>

        <!-- Product Code -->
        <div class="filter-field">
          <label class="filter-label">{{ $t('stockInventory.filters.productCode') || 'Product Code' }}</label>
          <InputChips
            v-model="localFilters.productCodes"
            :placeholder="$t('stockInventory.filters.productCodePlaceholder') || 'กด Enter เพื่อเพิ่ม'"
            class="filter-chips"
            @add="trimChipValue($event, 'productCodes')"
          />
        </div>

        <!-- Receipt Date Range -->
        <div class="filter-field date-range-field">
          <label class="filter-label">{{ $t('stockInventory.filters.receiptDateRange') || 'วันที่รับสินค้า' }}</label>
          <div class="date-range-inputs">
            <Calendar
              v-model="localFilters.receiptDateMin"
              :placeholder="$t('stockInventory.filters.dateFrom') || 'จาก'"
              dateFormat="dd/mm/yy"
              :showIcon="true"
              :maxDate="localFilters.receiptDateMax || maxSelectableDate"
              class="date-input"
            />
            <span class="date-separator">-</span>
            <Calendar
              v-model="localFilters.receiptDateMax"
              :placeholder="$t('stockInventory.filters.dateTo') || 'ถึง'"
              dateFormat="dd/mm/yy"
              :showIcon="true"
              :minDate="localFilters.receiptDateMin"
              :maxDate="maxSelectableDate"
              class="date-input"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="list-search-bar">
        <!-- Advanced Filter Button -->
        <Button
          :label="$t('stockInventory.filters.advancedFilters') || 'ตัวกรองขั้นสูง'"
          icon="pi pi-filter"
          @click="handleAdvancedFilter"
          class="p-button-outlined"
          :badge="advancedFilterCount > 0 ? advancedFilterCount.toString() : null"
          badgeClass="p-badge-pink"
        />

        <!-- Search Button -->
        <Button
          :label="$t('common.search') || 'ค้นหา'"
          icon="pi pi-search"
          @click="handleSearch"
          class="list-search-button"
          :loading="loading"

        />

        <!-- Clear Filters Button -->
        <Button
          :label="$t('stockInventory.filters.clearAll') || 'ล้างทั้งหมด'"
          icon="pi pi-times"
          @click="handleClearAll"
          class="p-button-outlined p-button-secondary"
          v-if="hasActiveFilters"
        />

        <!-- Refresh Button -->
        <!-- <Button
          :label="$t('common.refresh') || 'รีเฟรช'"
          icon="pi pi-refresh"
          class="p-button-outlined p-button-secondary"
          @click="handleRefresh"
        /> -->
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="active-filters-display">
        <span class="active-filters-label">
          <i class="pi pi-filter"></i>
          {{ $t('stockInventory.filters.activeFilters') || 'ตัวกรองที่ใช้งาน' }}:
        </span>
        <div class="active-filters-chips">
          <Chip
            v-for="(filter, index) in activeFiltersList"
            :key="index"
            :label="filter.label"
            removable
            @remove="removeFilter(filter.key)"
            class="active-filter-chip"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext"
import Button from "primevue/button"
import InputChips from "primevue/inputchips"
import Calendar from "primevue/calendar"
import Chip from "primevue/chip"

export default {
  name: "SearchView",

  components: {
    InputText,
    Button,
    InputChips,
    Calendar,
    Chip
  },

  props: {
    filters: {
      type: Object,
      default: () => ({
        stockNumbers: null,
        productCodes: null,
        receiptDateMin: null,
        receiptDateMax: null
      })
    },
    advancedFilters: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  emits: ['search', 'refresh', 'advanced-filter', 'clear-all', 'remove-filter'],

  data() {
    return {
      localFilters: {
        stockNumbers: [],
        productCodes: [],
        receiptDateMin: null,
        receiptDateMax: null
      }
    }
  },

  computed: {
    hasActiveFilters() {
      return this.localFilters.stockNumbers?.length > 0 ||
             this.localFilters.productCodes?.length > 0 ||
             this.localFilters.receiptDateMin ||
             this.localFilters.receiptDateMax ||
             this.advancedFilterCount > 0
    },

    advancedFilterCount() {
      let count = 0
      if (this.advancedFilters.productTypeCodes?.length > 0) count++
      if (this.advancedFilters.priceMin || this.advancedFilters.priceMax) count++
      if (this.advancedFilters.branchIds?.length > 0) count++
      if (this.advancedFilters.goldFilter?.typeCode1?.length > 0 ||
          this.advancedFilters.goldFilter?.typeCode2?.length > 0) count++
      if (this.advancedFilters.gemFilter?.typeCode1?.length > 0 ||
          this.advancedFilters.gemFilter?.typeCode2?.length > 0) count++
      return count
    },

    maxSelectableDate() {
      // ไม่ให้เลือกวันที่เกินวันปัจจุบัน
      return new Date()
    },

    activeFiltersList() {
      const filters = []

      if (this.localFilters.stockNumbers?.length > 0) {
        filters.push({
          key: 'stockNumbers',
          label: `Stock Number: ${this.localFilters.stockNumbers.join(', ')}`
        })
      }

      if (this.localFilters.productCodes?.length > 0) {
        filters.push({
          key: 'productCodes',
          label: `Product Code: ${this.localFilters.productCodes.join(', ')}`
        })
      }

      if (this.localFilters.receiptDateMin || this.localFilters.receiptDateMax) {
        const dateFrom = this.localFilters.receiptDateMin ?
          this.formatDateDisplay(this.localFilters.receiptDateMin) : '...'
        const dateTo = this.localFilters.receiptDateMax ?
          this.formatDateDisplay(this.localFilters.receiptDateMax) : '...'
        filters.push({
          key: 'receiptDate',
          label: `วันที่: ${dateFrom} - ${dateTo}`
        })
      }

      return filters
    }
  },

  watch: {
    filters: {
      handler(newVal) {
        this.localFilters = {
          stockNumbers: newVal.stockNumbers && newVal.stockNumbers.length > 0 ? [...newVal.stockNumbers] : [],
          productCodes: newVal.productCodes && newVal.productCodes.length > 0 ? [...newVal.productCodes] : [],
          receiptDateMin: newVal.receiptDateMin,
          receiptDateMax: newVal.receiptDateMax
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    handleSearch() {
      // Helper function to trim and filter array values
      const trimAndFilterArray = (arr) => {
        if (!arr || arr.length === 0) return null
        const trimmed = arr
          .map(item => typeof item === 'string' ? item.trim() : item)
          .filter(item => item !== '' && item !== null && item !== undefined)
        return trimmed.length > 0 ? trimmed : null
      }

      const cleanFilters = {
        stockNumbers: trimAndFilterArray(this.localFilters.stockNumbers),
        productCodes: trimAndFilterArray(this.localFilters.productCodes),
        receiptDateMin: this.localFilters.receiptDateMin,
        receiptDateMax: this.localFilters.receiptDateMax
      }
      console.log('SearchView - localFilters:', this.localFilters)
      console.log('SearchView - cleanFilters emitted:', cleanFilters)
      this.$emit('search', cleanFilters)
    },

    handleRefresh() {
      this.localFilters = {
        stockNumbers: [],
        productCodes: [],
        receiptDateMin: null,
        receiptDateMax: null
      }
      this.$emit('refresh')
    },

    handleAdvancedFilter() {
      this.$emit('advanced-filter')
    },

    handleClearAll() {
      this.localFilters = {
        stockNumbers: [],
        productCodes: [],
        receiptDateMin: null,
        receiptDateMax: null
      }
      this.$emit('clear-all')
    },

    removeFilter(key) {
      if (key === 'stockNumbers') {
        this.localFilters.stockNumbers = []
      } else if (key === 'productCodes') {
        this.localFilters.productCodes = []
      } else if (key === 'receiptDate') {
        this.localFilters.receiptDateMin = null
        this.localFilters.receiptDateMax = null
      }
      this.$emit('remove-filter', key)
      this.handleSearch()
    },

    formatDateDisplay(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    /**
     * Trim chip value when added to InputChips
     * @param {Object} event - Add event from InputChips
     * @param {String} fieldName - Field name (stockNumbers or productCodes)
     */
    trimChipValue(event, fieldName) {
      this.$nextTick(() => {
        if (this.localFilters[fieldName] && Array.isArray(this.localFilters[fieldName])) {
          this.localFilters[fieldName] = this.localFilters[fieldName].map(item =>
            typeof item === 'string' ? item.trim() : item
          )
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/list-page-templete/search-view.scss';

.main-filters-row {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 1rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.filter-chips {
  width: 100%;

  :deep(.p-inputchips) {
    width: 100%;
  }

  :deep(.p-inputtext) {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  :deep(.p-inputchips-chip) {
    background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
  }
}

.date-range-field {
  grid-column: span 1;
}

.date-range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-input {
  //flex: 1;

  :deep(.p-inputtext) {
    padding: 0.5rem 0.75rem;
    //font-size: 0.875rem;
  }
}

.date-separator {
  color: #6b7280;
  font-weight: 500;
}

.active-filters-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background: #fef8f9;
  border-radius: 8px;
  border: 1px solid #ffd7e1;
  margin-top: 1rem;
}

.active-filters-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ff69b4;
  white-space: nowrap;

  i {
    font-size: 1rem;
  }
}

.active-filters-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1;
}

.active-filter-chip {
  :deep(.p-chip) {
    background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%);
    color: white;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;

    .p-chip-remove-icon {
      color: white;
      margin-left: 0.5rem;

      &:hover {
        color: #ffffff;
      }
    }
  }
}

:deep(.p-badge-pink) {
  background: linear-gradient(135deg, #ff69b4 0%, #ff85c1 100%);
  color: white;
  min-width: 1.25rem;
  height: 1.25rem;
  line-height: 1.25rem;
}

@media (max-width: 1024px) {
  .main-filters-row {
    grid-template-columns: 1fr;
  }

  .date-range-field {
    grid-column: span 1;
  }
}
</style>
