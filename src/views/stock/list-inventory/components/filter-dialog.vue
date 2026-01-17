<template>
  <Dialog
    v-model:visible="isVisible"
    :header="$t('stockInventory.filters.advancedTitle') || 'ตัวกรองขั้นสูง'"
    :modal="true"
    :closable="true"
    :style="{ width: '700px' }"
    class="filter-dialog"
    @hide="onCancel"
  >
    <div class="filter-content">
      <!-- Product Type Section -->
      <div class="filter-section">
        <label class="filter-label">
          <i class="pi pi-tag"></i>
          {{ $t('stockInventory.filters.productType') || 'ประเภทสินค้า' }}
        </label>
        <MultiSelect
          v-model="localFilters.productTypeCodes"
          :options="productTypes"
          optionLabel="nameTh"
          optionValue="code"
          :placeholder="$t('stockInventory.filters.productTypePlaceholder') || 'เลือกประเภทสินค้า'"
          :filter="true"
          class="w-full"
          display="chip"
        />
      </div>

      <!-- Price Range Section -->
      <div class="filter-section">
        <label class="filter-label">
          <i class="pi pi-money-bill"></i>
          {{ $t('stockInventory.filters.priceRange') || 'ช่วงราคา' }}
        </label>
        <div class="price-range-inputs">
          <InputNumber
            v-model="localFilters.priceMin"
            :placeholder="$t('stockInventory.filters.priceMin') || 'ราคาต่ำสุด'"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            class="price-input"
          />
          <span class="range-separator">-</span>
          <InputNumber
            v-model="localFilters.priceMax"
            :placeholder="$t('stockInventory.filters.priceMax') || 'ราคาสูงสุด'"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            class="price-input"
          />
        </div>
      </div>

      <!-- Branch Section -->
      <div class="filter-section">
        <label class="filter-label">
          <i class="pi pi-building"></i>
          {{ $t('stockInventory.filters.branch') || 'สาขา' }}
        </label>
        <MultiSelect
          v-model="localFilters.branchIds"
          :options="branches"
          optionLabel="nameTh"
          optionValue="branchId"
          :placeholder="$t('stockInventory.filters.branchPlaceholder') || 'เลือกสาขา'"
          :filter="true"
          class="w-full"
          display="chip"
        />
      </div>

      <!-- Gold Filter Section -->
      <div class="filter-section">
        <label class="filter-label">
          <i class="pi pi-circle"></i>
          {{ $t('stockInventory.filters.goldFilter') || 'ตัวกรองทอง' }}
        </label>

        <div class="nested-filters">
          <!-- Gold Type -->
          <div class="nested-filter">
            <label class="nested-label">{{ $t('stockInventory.filters.goldType') || 'ประเภททอง' }}</label>
            <MultiSelect
              v-model="localFilters.goldFilter.typeCode1"
              :options="golds"
              optionLabel="nameTh"
              optionValue="code"
              :placeholder="$t('stockInventory.filters.goldTypePlaceholder') || 'เลือกประเภททอง'"
              :filter="true"
              class="w-full"
              display="chip"
            />
          </div>

          <!-- Gold Size -->
          <div class="nested-filter">
            <label class="nested-label">{{ $t('stockInventory.filters.goldSize') || 'ขนาดทอง' }}</label>
            <MultiSelect
              v-model="localFilters.goldFilter.typeCode2"
              :options="goldSizes"
              optionLabel="nameTh"
              optionValue="code"
              :placeholder="$t('stockInventory.filters.goldSizePlaceholder') || 'เลือกขนาดทอง'"
              :filter="true"
              class="w-full"
              display="chip"
            />
          </div>
        </div>
      </div>

      <!-- Gem Filter Section -->
      <div class="filter-section">
        <label class="filter-label">
          <i class="pi pi-star"></i>
          {{ $t('stockInventory.filters.gemFilter') || 'ตัวกรองพลอย' }}
        </label>

        <div class="nested-filters">
          <!-- Gem Type -->
          <div class="nested-filter">
            <label class="nested-label">{{ $t('stockInventory.filters.gemType') || 'ประเภทพลอย' }}</label>
            <MultiSelect
              v-model="localFilters.gemFilter.typeCode1"
              :options="gems"
              optionLabel="nameTh"
              optionValue="code"
              :placeholder="$t('stockInventory.filters.gemTypePlaceholder') || 'เลือกประเภทพลอย'"
              :filter="true"
              class="w-full"
              display="chip"
            />
          </div>

          <!-- Gem Shape -->
          <div class="nested-filter">
            <label class="nested-label">{{ $t('stockInventory.filters.gemShape') || 'รูปร่างพลอย' }}</label>
            <MultiSelect
              v-model="localFilters.gemFilter.typeCode2"
              :options="gemShapes"
              optionLabel="nameTh"
              optionValue="code"
              :placeholder="$t('stockInventory.filters.gemShapePlaceholder') || 'เลือกรูปร่างพลอย'"
              :filter="true"
              class="w-full"
              display="chip"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog Footer -->
    <template #footer>
      <div class="dialog-footer">
        <Button
          :label="$t('common.cancel') || 'ยกเลิก'"
          icon="pi pi-times"
          @click="onCancel"
          class="p-button-text"
        />
        <Button
          :label="$t('stockInventory.filters.clearFilters') || 'ล้างตัวกรอง'"
          icon="pi pi-filter-slash"
          @click="onClear"
          class="p-button-outlined"
        />
        <Button
          :label="$t('stockInventory.filters.applyFilters') || 'ใช้ตัวกรอง'"
          icon="pi pi-check"
          @click="onApply"
          class="p-button-primary"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'
import InputNumber from 'primevue/inputnumber'
import { useProductTypeApiStore } from '@/stores/api/product-type-api'
import { useBranchApiStore } from '@/stores/api/branch-api'
import { useGoldApiStore } from '@/stores/api/gold-api'
import { useGoldSizeApiStore } from '@/stores/api/gold-size-api'
import { useGemApiStore } from '@/stores/api/gem-api'
import { useGemShapeApiStore } from '@/stores/api/gem-shape-api'

export default {
  name: 'FilterDialog',

  components: {
    Dialog,
    Button,
    MultiSelect,
    InputNumber
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    filters: {
      type: Object,
      default: () => ({
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
      })
    }
  },

  emits: ['update:visible', 'apply', 'clear'],

  data() {
    return {
      // Stores
      productTypeApiStore: useProductTypeApiStore(),
      branchApiStore: useBranchApiStore(),
      goldApiStore: useGoldApiStore(),
      goldSizeApiStore: useGoldSizeApiStore(),
      gemApiStore: useGemApiStore(),
      gemShapeApiStore: useGemShapeApiStore(),

      // Local filters
      localFilters: {
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

      // Options
      productTypes: [],
      branches: [],
      golds: [],
      goldSizes: [],
      gems: [],
      gemShapes: [],

      // Cache flag
      optionsLoaded: false
    }
  },

  computed: {
    isVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  },

  mounted() {
    // Load options once when component is mounted
    this.loadFilterOptions()
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        // Only sync filters, don't reload options
        this.syncFilters()
      }
    },
    filters: {
      handler() {
        this.syncFilters()
      },
      deep: true
    }
  },

  methods: {
    syncFilters() {
      this.localFilters = {
        productTypeCodes: this.filters.productTypeCodes ? [...this.filters.productTypeCodes] : null,
        priceMin: this.filters.priceMin,
        priceMax: this.filters.priceMax,
        branchIds: this.filters.branchIds ? [...this.filters.branchIds] : null,
        goldFilter: {
          typeCode1: this.filters.goldFilter?.typeCode1 ? [...this.filters.goldFilter.typeCode1] : null,
          typeCode2: this.filters.goldFilter?.typeCode2 ? [...this.filters.goldFilter.typeCode2] : null
        },
        gemFilter: {
          typeCode1: this.filters.gemFilter?.typeCode1 ? [...this.filters.gemFilter.typeCode1] : null,
          typeCode2: this.filters.gemFilter?.typeCode2 ? [...this.filters.gemFilter.typeCode2] : null
        }
      }
    },

    async loadFilterOptions() {
      // Only load once
      if (this.optionsLoaded) {
        return
      }

      try {
        // Load all options in parallel for better performance
        const [
          productTypeResult,
          branchResult,
          goldResult,
          goldSizeResult,
          gemResult,
          gemShapeResult
        ] = await Promise.all([
          this.productTypeApiStore.listProductTypes({
            pageIndex: 0,
            pageSize: 100,
            criteria: {}
          }),
          this.branchApiStore.listBranches({
            pageIndex: 0,
            pageSize: 100,
            criteria: {}
          }),
          this.goldApiStore.listGolds({
            pageIndex: 0,
            pageSize: 100,
            criteria: {}
          }),
          this.goldSizeApiStore.listGoldSizes({
            pageIndex: 0,
            pageSize: 100,
            criteria: {}
          }),
          this.gemApiStore.listGems({
            pageIndex: 0,
            pageSize: 100,
            criteria: {}
          }),
          this.gemShapeApiStore.listGemShapes({
            pageIndex: 0,
            pageSize: 100,
            criteria: {}
          })
        ])

        // Set results
        if (productTypeResult.success) {
          this.productTypes = productTypeResult.data
        }
        if (branchResult.success) {
          this.branches = branchResult.data
        }
        if (goldResult.success) {
          this.golds = goldResult.data
        }
        if (goldSizeResult.success) {
          this.goldSizes = goldSizeResult.data
        }
        if (gemResult.success) {
          this.gems = gemResult.data
        }
        if (gemShapeResult.success) {
          this.gemShapes = gemShapeResult.data
        }

        // Mark as loaded
        this.optionsLoaded = true
      } catch (error) {
        console.error('Error loading filter options:', error)
      }
    },

    onApply() {
      // Clean up filters - convert empty arrays to null
      const cleanFilters = {
        productTypeCodes: this.localFilters.productTypeCodes?.length > 0 ? this.localFilters.productTypeCodes : null,
        priceMin: this.localFilters.priceMin,
        priceMax: this.localFilters.priceMax,
        branchIds: this.localFilters.branchIds?.length > 0 ? this.localFilters.branchIds : null,
        goldFilter: {
          typeCode1: this.localFilters.goldFilter.typeCode1?.length > 0 ? this.localFilters.goldFilter.typeCode1 : null,
          typeCode2: this.localFilters.goldFilter.typeCode2?.length > 0 ? this.localFilters.goldFilter.typeCode2 : null
        },
        gemFilter: {
          typeCode1: this.localFilters.gemFilter.typeCode1?.length > 0 ? this.localFilters.gemFilter.typeCode1 : null,
          typeCode2: this.localFilters.gemFilter.typeCode2?.length > 0 ? this.localFilters.gemFilter.typeCode2 : null
        }
      }

      this.$emit('apply', cleanFilters)
      this.isVisible = false
    },

    onClear() {
      this.localFilters = {
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
      this.$emit('clear')
    },

    onCancel() {
      this.syncFilters()
      this.isVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-dialog {
  :deep(.p-dialog-header) {
    background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%);
    color: white;

    .p-dialog-title {
      color: white;
      font-weight: 600;
    }

    .p-dialog-header-icon {
      color: white;

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

.filter-content {
  padding: 1rem 0;
}

.filter-section {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;

  i {
    color: #e7de99;
    font-size: 1rem;
  }
}

.price-range-inputs {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .price-input {
    flex: 1;
  }

  .range-separator {
    color: #6b7280;
    font-weight: 500;
  }
}

.nested-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-left: 1.5rem;
  border-left: 3px solid #ffd7e1;
}

.nested-filter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nested-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.dialog-footer {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.w-full {
  width: 100%;
}

:deep(.p-multiselect) {
  width: 100%;

  .p-multiselect-label {
    padding: 0.5rem 0.75rem;
  }
}

:deep(.p-inputnumber) {
  width: 100%;

  input {
    width: 100%;
    padding: 0.5rem 0.75rem;
  }
}
</style>
