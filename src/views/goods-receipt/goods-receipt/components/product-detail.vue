<template>
  <div class="product-detail-card">
    <!-- Section Title -->
    <div class="section-title">
      <i class="pi pi-tag"></i>
      <span>{{ $t('goodsReceipt.productInfo') }}</span>
    </div>

    <!-- Product Form -->
    <div class="product-form">
      <!-- Origin Number (Full Width) -->
      <div class="form-group form-group-full">
        <label>
          {{ $t('goodsReceipt.form.originNumber') }}
          <span class="required">*</span>
        </label>
        <InputText
          v-model="productData.originNumber"
          :placeholder="$t('goodsReceipt.form.originNumberPlaceholder')"
          :class="{ 'p-invalid': errors.originNumber }"
          @input="clearError('originNumber')"
        />
        <small v-if="errors.originNumber" class="p-error">
          {{ errors.originNumber }}
        </small>
      </div>

      <!-- Product Name Row (English + Thai in same row) -->
      <div class="form-group-row">
        <div class="form-group">
          <label>
            {{ $t('goodsReceipt.form.productNameEn') }}
            <span class="required">*</span>
          </label>
          <InputText
            v-model="productData.productNameEn"
            :placeholder="$t('goodsReceipt.form.productNameEnPlaceholder')"
            :class="{ 'p-invalid': errors.productNameEn }"
            @input="clearError('productNameEn')"
          />
          <small v-if="errors.productNameEn" class="p-error">
            {{ errors.productNameEn }}
          </small>
        </div>

        <div class="form-group">
          <label>
            {{ $t('goodsReceipt.form.productNameTH') }}
            <span class="required">*</span>
          </label>
          <InputText
            v-model="productData.productNameTH"
            :placeholder="$t('goodsReceipt.form.productNameTHPlaceholder')"
            :class="{ 'p-invalid': errors.productNameTH }"
            @input="clearError('productNameTH')"
          />
          <small v-if="errors.productNameTH" class="p-error">
            {{ errors.productNameTH }}
          </small>
        </div>
      </div>

      <!-- Quantity Row (Qty + Unit in same row) -->
      <div class="form-group-row">
        <div class="form-group">
          <label>
            {{ $t('goodsReceipt.form.qty') }}
            <span class="required">*</span>
          </label>
          <input
            type="number"
            v-model.number="productData.qty"
            :placeholder="$t('goodsReceipt.form.qtyPlaceholder')"
            :class="{ 'is-invalid': errors.qty }"
            class="custom-input"
            step="0.01"
            min="0"
            @input="clearError('qty')"
          />
          <small v-if="errors.qty" class="p-error">
            {{ errors.qty }}
          </small>
        </div>

        <div class="form-group">
          <label>
            {{ $t('goodsReceipt.form.qtyUnit') }}
            <span class="required">*</span>
          </label>
          <InputText
            v-model="productData.qtyUnit"
            :placeholder="$t('goodsReceipt.form.qtyUnitPlaceholder')"
            :class="{ 'p-invalid': errors.qtyUnit }"
            @input="clearError('qtyUnit')"
          />
          <small v-if="errors.qtyUnit" class="p-error">
            {{ errors.qtyUnit }}
          </small>
        </div>
      </div>

      <!-- Price Row (Price + Unit in same row) -->
      <div class="form-group-row">
        <div class="form-group">
          <label>
            {{ $t('goodsReceipt.form.price') }}
            <span class="required">*</span>
          </label>
          <input
            type="number"
            v-model.number="productData.price"
            :placeholder="$t('goodsReceipt.form.pricePlaceholder')"
            :class="{ 'is-invalid': errors.price }"
            class="custom-input"
            step="0.01"
            min="0"
            @input="clearError('price')"
          />
          <small v-if="errors.price" class="p-error">
            {{ errors.price }}
          </small>
        </div>

        <div class="form-group">
          <label>
            {{ $t('goodsReceipt.form.unitPrice') }}
            <span class="required">*</span>
          </label>
          <InputText
            v-model="productData.unitPrice"
            :placeholder="$t('goodsReceipt.form.unitPricePlaceholder')"
            :class="{ 'p-invalid': errors.unitPrice }"
            @input="clearError('unitPrice')"
          />
          <small v-if="errors.unitPrice" class="p-error">
            {{ errors.unitPrice }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',

  props: {
    modelValue: {
      type: Object,
      default: () => ({
        originNumber: '',
        productNameEn: '',
        productNameTH: '',
        qty: null,
        qtyUnit: '',
        price: null,
        unitPrice: ''
      })
    }
  },

  emits: ['update:modelValue', 'validate'],

  data() {
    return {
      productData: {
        originNumber: '',
        productNameEn: '',
        productNameTH: '',
        qty: null,
        qtyUnit: '',
        price: null,
        unitPrice: ''
      },
      errors: {}
    }
  },

  watch: {
    modelValue: {
      handler(newValue) {
        if (newValue) {
          this.productData = { ...newValue }
        }
      },
      deep: true,
      immediate: true
    },

    productData: {
      handler(newValue) {
        this.$emit('update:modelValue', newValue)
      },
      deep: true
    }
  },

  methods: {
    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field]
      }
    },

    validate() {
      this.errors = {}

      // Origin Number validation
      if (!this.productData.originNumber || !this.productData.originNumber.trim()) {
        this.errors.originNumber = this.$t('goodsReceipt.validation.originNumberRequired')
      }

      // Product Name (English) validation
      if (!this.productData.productNameEn || !this.productData.productNameEn.trim()) {
        this.errors.productNameEn = this.$t('goodsReceipt.validation.productNameEnRequired')
      }

      // Product Name (Thai) validation
      if (!this.productData.productNameTH || !this.productData.productNameTH.trim()) {
        this.errors.productNameTH = this.$t('goodsReceipt.validation.productNameTHRequired')
      }

      // Quantity validation
      if (!this.productData.qty || this.productData.qty <= 0) {
        this.errors.qty = this.$t('goodsReceipt.validation.qtyRequired')
      }

      // Quantity Unit validation
      if (!this.productData.qtyUnit || !this.productData.qtyUnit.trim()) {
        this.errors.qtyUnit = this.$t('goodsReceipt.validation.qtyUnitRequired')
      }

      // Price validation
      if (!this.productData.price || this.productData.price <= 0) {
        this.errors.price = this.$t('goodsReceipt.validation.priceRequired')
      }

      // Unit Price validation
      if (!this.productData.unitPrice || !this.productData.unitPrice.trim()) {
        this.errors.unitPrice = this.$t('goodsReceipt.validation.unitPriceRequired')
      }

      const isValid = Object.keys(this.errors).length === 0
      this.$emit('validate', isValid)
      return isValid
    },

    reset() {
      this.productData = {
        originNumber: '',
        productNameEn: '',
        productNameTH: '',
        qty: null,
        qtyUnit: '',
        price: null,
        unitPrice: ''
      }
      this.errors = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail-card {
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

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group-full {
  width: 100%;
}

.form-group-row {
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

  :deep(.p-inputtext),
  .custom-input {
    width: 100%;
    height: 40px;
    padding: 0.625rem 0.875rem;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.9375rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #ff69b4;
      box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
    }

    &.p-invalid,
    &.is-invalid {
      border-color: #ef4444;

      &:focus {
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
