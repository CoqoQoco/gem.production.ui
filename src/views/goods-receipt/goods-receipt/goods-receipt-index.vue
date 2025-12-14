<template>
  <div class="goods-receipt-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <i class="pi pi-box header-icon"></i>
          <div class="header-text">
            <h1 class="header-title">{{ $t('goodsReceipt.title') }}</h1>
            <p class="header-subtitle">{{ $t('goodsReceipt.subtitle') }}</p>
          </div>
        </div>
        <div class="header-right">
          <Button
            :label="$t('common.save')"
            icon="pi pi-check"
            class="p-button-success"
            @click="handleSave"
            :disabled="isSaving"
          />
        </div>
      </div>
    </div>

    <!-- Page Content -->
    <div class="page-content">
      <!-- Product Detail Section (Part 1) -->
      <ProductDetail
        ref="productDetailRef"
        v-model="productData"
      />

      <!-- Placeholder for Part 2 (Product Components) -->
      <div class="placeholder-section">
        <div class="placeholder-content">
          <i class="pi pi-info-circle"></i>
          <p>{{ $t('goodsReceipt.componentInfo') }}</p>
          <small>ส่วนที่ 2 จะเพิ่มในภายหลัง</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductDetail from './components/product-detail.vue'

export default {
  name: 'GoodsReceiptIndex',

  components: {
    ProductDetail
  },

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
      isSaving: false
    }
  },

  methods: {
    async handleSave() {
      // Validate product detail
      const productDetailRef = this.$refs.productDetailRef
      if (!productDetailRef) {
        console.error('Product detail ref not found')
        return
      }

      const isValid = productDetailRef.validate()

      if (!isValid) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('common.error'),
          detail: 'กรุณากรอกข้อมูลให้ครบถ้วน',
          life: 3000
        })
        return
      }

      // Save logic here
      this.isSaving = true

      try {
        // TODO: Call API to save data
        console.log('Saving product data:', this.productData)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.$toast.add({
          severity: 'success',
          summary: this.$t('common.success'),
          detail: 'บันทึกข้อมูลสำเร็จ',
          life: 3000
        })

        // Reset form after successful save
        this.resetForm()
      } catch (error) {
        console.error('Error saving product data:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.$t('common.error'),
          detail: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
          life: 3000
        })
      } finally {
        this.isSaving = false
      }
    },

    resetForm() {
      this.productData = {
        originNumber: '',
        productNameEn: '',
        productNameTH: '',
        qty: null,
        qtyUnit: '',
        price: null,
        unitPrice: ''
      }

      const productDetailRef = this.$refs.productDetailRef
      if (productDetailRef && productDetailRef.reset) {
        productDetailRef.reset()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-receipt-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.page-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 2.5rem;
  color: #ff69b4;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.1) 0%, rgba(255, 20, 147, 0.1) 100%);
  border-radius: 12px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.header-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 0.75rem;

  @media (max-width: 768px) {
    width: 100%;

    :deep(.p-button) {
      flex: 1;
    }
  }
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.placeholder-section {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #9ca3af;

  i {
    font-size: 3rem;
    color: #d1d5db;
  }

  p {
    font-size: 1.25rem;
    font-weight: 600;
    color: #6b7280;
    margin: 0;
  }

  small {
    font-size: 0.875rem;
    color: #9ca3af;
  }
}

:deep(.p-button-success) {
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #ff1493 0%, #c71585 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(255, 105, 180, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
