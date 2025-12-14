<template>
  <div class="selection-card">
    <!-- Section Title -->
    <div class="section-title">
      <i class="pi pi-building"></i>
      <span>ข้อมูลสาขาและประเภทสินค้า</span>
    </div>

    <!-- Selection Form -->
    <div class="selection-form">
      <!-- Branch Dropdown -->
      <div class="form-group">
        <label>
          {{ $t('goodsReceipt.form.branch') || 'สาขา' }}
          <span class="required">*</span>
        </label>
        <FormDropdown
          v-model="selectionData.branchId"
          :options="branches"
          option-label="nameTh"
          option-value="branchId"
          :placeholder="$t('goodsReceipt.form.branchPlaceholder') || 'เลือกสาขา'"
          :invalid="!!errors.branchId"
          @change="handleBranchChange"
        />
        <small v-if="errors.branchId" class="p-error">
          {{ errors.branchId }}
        </small>
      </div>

      <!-- Product Type Dropdown -->
      <div class="form-group">
        <label>
          {{ $t('goodsReceipt.form.productType') || 'ประเภทสินค้า' }}
          <span class="required">*</span>
        </label>
        <FormDropdown
          v-model="selectionData.productTypeCode"
          :options="productTypes"
          option-label="nameTh"
          option-value="code"
          :placeholder="$t('goodsReceipt.form.productTypePlaceholder') || 'เลือกประเภทสินค้า'"
          :invalid="!!errors.productTypeCode"
          @change="handleProductTypeChange"
        />
        <small v-if="errors.productTypeCode" class="p-error">
          {{ errors.productTypeCode }}
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import FormDropdown from '@/components/common/form-dropdown.vue'
import { useBranchApiStore } from '@/stores/api/branch-api'
import { useProductTypeApiStore } from '@/stores/api/product-type-api'

export default {
  name: 'BranchProductTypeSelection',

  components: {
    FormDropdown
  },

  props: {
    modelValue: {
      type: Object,
      default: () => ({
        branchId: null,
        branchNameTh: '',
        branchNameEn: '',
        productTypeCode: '',
        productTypeNameTh: '',
        productTypeNameEn: ''
      })
    }
  },

  emits: ['update:modelValue', 'validate'],

  data() {
    return {
      branchApiStore: useBranchApiStore(),
      productTypeApiStore: useProductTypeApiStore(),
      selectionData: {
        branchId: null,
        branchNameTh: '',
        branchNameEn: '',
        productTypeCode: '',
        productTypeNameTh: '',
        productTypeNameEn: ''
      },
      branches: [],
      productTypes: [],
      errors: {},
      isUpdatingFromParent: false
    }
  },

  async mounted() {
    await this.loadBranches()
    await this.loadProductTypes()
  },

  watch: {
    modelValue: {
      handler(newValue) {
        if (newValue && !this.isUpdatingFromParent) {
          this.isUpdatingFromParent = true
          this.selectionData = JSON.parse(JSON.stringify(newValue))
          this.$nextTick(() => {
            this.isUpdatingFromParent = false
          })
        }
      },
      deep: true,
      immediate: true
    },

    selectionData: {
      handler(newValue) {
        if (!this.isUpdatingFromParent) {
          this.$emit('update:modelValue', newValue)
        }
      },
      deep: true
    }
  },

  methods: {
    async loadBranches() {
      try {
        const result = await this.branchApiStore.listBranches({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null }
        })
        if (result.success) {
          this.branches = result.data
        }
      } catch (error) {
        console.error('Error loading branches:', error)
      }
    },

    async loadProductTypes() {
      try {
        const result = await this.productTypeApiStore.listProductTypes({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null }
        })
        if (result.success) {
          this.productTypes = result.data
        }
      } catch (error) {
        console.error('Error loading product types:', error)
      }
    },

    handleBranchChange(event) {
      const selectedBranch = this.branches.find(b => b.id === event.value)
      if (selectedBranch) {
        this.selectionData.branchId = selectedBranch.id
        this.selectionData.branchNameTh = selectedBranch.nameTh
        this.selectionData.branchNameEn = selectedBranch.nameEn
      }
      this.clearError('branchId')
    },

    handleProductTypeChange(event) {
      const selectedProductType = this.productTypes.find(pt => pt.code === event.value)
      if (selectedProductType) {
        this.selectionData.productTypeCode = selectedProductType.code
        this.selectionData.productTypeNameTh = selectedProductType.nameTh
        this.selectionData.productTypeNameEn = selectedProductType.nameEn
      }
      this.clearError('productTypeCode')
    },

    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field]
      }
    },

    validate() {
      this.errors = {}

      // Branch validation
      if (!this.selectionData.branchId) {
        this.errors.branchId = this.$t('goodsReceipt.validation.branchRequired') || 'กรุณาเลือกสาขา'
      }

      // Product Type validation
      if (!this.selectionData.productTypeCode || !this.selectionData.productTypeCode.trim()) {
        this.errors.productTypeCode = this.$t('goodsReceipt.validation.productTypeRequired') || 'กรุณาเลือกประเภทสินค้า'
      }

      const isValid = Object.keys(this.errors).length === 0
      this.$emit('validate', isValid)
      return isValid
    },

    reset() {
      this.selectionData = {
        branchId: null,
        branchNameTh: '',
        branchNameEn: '',
        productTypeCode: '',
        productTypeNameTh: '',
        productTypeNameEn: ''
      }
      this.errors = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.selection-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #ff69b4;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1.25rem;
    color: #ff69b4;
  }
}

.selection-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #374151;

    .required {
      color: #ef4444;
      margin-left: 0.25rem;
    }
  }

  :deep(.p-select) {
    width: 100%;
    height: 40px;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    transition: all 0.2s;

    &:focus,
    &:focus-within {
      border-color: #ff69b4;
      box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
    }

    &.p-invalid {
      border-color: #ef4444;

      &:focus,
      &:focus-within {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    }
  }

  small.p-error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: -0.25rem;
  }
}
</style>
