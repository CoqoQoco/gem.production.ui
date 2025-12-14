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
      </div>
    </div>

    <!-- Page Content -->
    <div class="page-content">
      <!-- Product Detail Section (Part 1) -->
      <ProductDetail
        ref="productDetailRef"
        v-model="productData"
      />

      <!-- Branch and Product Type Selection -->
      <BranchProductTypeSelection
        ref="branchProductTypeRef"
        v-model="branchProductTypeData"
      />

      <!-- Part 2: Product Components -->
      <ProductComponents
        ref="productComponentsRef"
        v-model="componentsData"
      />

      <!-- Action Buttons -->
      <div class="action-buttons">
        <Button
          :label="$t('common.cancel') || 'ยกเลิก'"
          icon="pi pi-times"
          class="p-button-secondary btn-clear"
          @click="handleClear"
          :disabled="isSaving"
        />
        <Button
          :label="$t('common.save') || 'บันทึก'"
          icon="pi pi-check"
          class="p-button-success btn-submit"
          @click="handleSave"
          :disabled="isSaving"
        />
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-model="showConfirmModal"
      :product-data="productData"
      :branch-product-type-data="branchProductTypeData"
      :components-data="componentsData"
      :is-saving="isSaving"
      @confirm="handleConfirmSave"
      @back="showConfirmModal = false"
    />
  </div>
</template>

<script>
import ProductDetail from './components/product-detail.vue'
import BranchProductTypeSelection from './components/branch-product-type-selection.vue'
import ProductComponents from './components/product-components.vue'
import ConfirmationModal from './modal/confirmation-modal.vue'
import { useGoodsReceiptApiStore } from '@/stores/api/goods-receipt-api'

export default {
  name: 'GoodsReceiptIndex',

  components: {
    ProductDetail,
    BranchProductTypeSelection,
    ProductComponents,
    ConfirmationModal
  },

  setup() {
    const goodsReceiptApiStore = useGoodsReceiptApiStore()
    return {
      goodsReceiptApiStore
    }
  },

  data() {
    return {
      productData: {
        originNumber: '',
        mold: '',
        productNameEn: '',
        productNameTH: '',
        qty: null,
        qtyUnit: '',
        price: null,
        unitPrice: ''
      },
      branchProductTypeData: {
        branchId: null,
        branchNameTh: '',
        branchNameEn: '',
        productTypeCode: '',
        productTypeNameTh: '',
        productTypeNameEn: ''
      },
      componentsData: {
        goldComponents: [],
        gemComponents: []
      },
      showConfirmModal: false,
      isSaving: false
    }
  },

  methods: {
    async handleSave() {
      // Validate all sections
      const productDetailRef = this.$refs.productDetailRef
      const branchProductTypeRef = this.$refs.branchProductTypeRef
      const productComponentsRef = this.$refs.productComponentsRef

      if (!productDetailRef) {
        console.error('Product detail ref not found')
        return
      }

      if (!branchProductTypeRef) {
        console.error('Branch product type ref not found')
        return
      }

      if (!productComponentsRef) {
        console.error('Product components ref not found')
        return
      }

      const isProductValid = productDetailRef.validate()
      const isBranchProductTypeValid = branchProductTypeRef.validate()
      const isComponentsValid = productComponentsRef.validate()

      if (!isProductValid || !isBranchProductTypeValid || !isComponentsValid) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('common.error'),
          detail: 'กรุณากรอกข้อมูลให้ครบถ้วน',
          life: 3000
        })
        return
      }

      // Show confirmation modal instead of saving directly
      this.showConfirmModal = true
    },

    async handleConfirmSave() {
      // Save logic here
      this.isSaving = true

      try {
        // Map gold components to API format
        const goldComponents = this.componentsData.goldComponents.map((goldComp) => ({
          typrCode: goldComp.goldCode,
          typeNameTh: goldComp.goldNameTh,
          typeNameEn: goldComp.goldNameEn,
          typrCode2: goldComp.shapeCode,
          typeNameTh2: goldComp.shapeNameTh,
          typeNameEn2: goldComp.shapeNameEn,
          qty: goldComp.qty,
          qtyUnit: goldComp.qtyUnit,
          weight: goldComp.weight,
          weightUnit: goldComp.weightUnit,
          size: goldComp.shapeCode
        }))

        // Map gem components to API format
        const gemComponents = this.componentsData.gemComponents.map((gemComp) => ({
          typrCode: gemComp.gemCode,
          typeNameTh: gemComp.gemNameTh,
          typeNameEn: gemComp.gemNameEn,
          typrCode2: gemComp.shapeCode,
          typeNameTh2: gemComp.shapeNameTh,
          typeNameEn2: gemComp.shapeNameEn,
          qty: gemComp.qty,
          qtyUnit: gemComp.qtyUnit,
          weight: gemComp.weight,
          weightUnit: gemComp.weightUnit,
          size: gemComp.shapeCode
        }))

        // Prepare API payload
        const payload = {
          mold: this.productData.mold,
          originNumber: this.productData.originNumber,
          productNameTh: this.productData.productNameTH,
          productNameEn: this.productData.productNameEn,
          qty: this.productData.qty,
          qtyUnit: this.productData.qtyUnit,
          price: this.productData.price,
          priceUnit: this.productData.unitPrice,
          branchId: this.branchProductTypeData.branchId,
          branchNameTh: this.branchProductTypeData.branchNameTh,
          branchNameEn: this.branchProductTypeData.branchNameEn,
          productTypeCode: this.branchProductTypeData.productTypeCode,
          productTypeNameTh: this.branchProductTypeData.productTypeNameTh,
          productTypeNameEn: this.branchProductTypeData.productTypeNameEn,
          gold: goldComponents,
          gem: gemComponents
        }

        console.log('Sending payload to API:', payload)

        // Call API to save data
        const result = await this.goodsReceiptApiStore.manualReceipt(payload)

        if (result.success) {
          this.$toast.add({
            severity: 'success',
            summary: this.$t('common.success'),
            detail: result.message || 'บันทึกข้อมูลสำเร็จ',
            life: 3000
          })

          // Close modal and reset form after successful save
          this.showConfirmModal = false
          this.resetForm()
        } else {
          throw new Error(result.message || 'Failed to save goods receipt')
        }
      } catch (error) {
        console.error('Error saving product data:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.$t('common.error'),
          detail: error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
          life: 3000
        })
      } finally {
        this.isSaving = false
      }
    },

    resetForm() {
      this.productData = {
        originNumber: '',
        mold: '',
        productNameEn: '',
        productNameTH: '',
        qty: null,
        qtyUnit: '',
        price: null,
        unitPrice: ''
      }

      this.branchProductTypeData = {
        branchId: null,
        branchNameTh: '',
        branchNameEn: '',
        productTypeCode: '',
        productTypeNameTh: '',
        productTypeNameEn: ''
      }

      this.componentsData = {
        goldComponents: [],
        gemComponents: []
      }

      const productDetailRef = this.$refs.productDetailRef
      if (productDetailRef && productDetailRef.reset) {
        productDetailRef.reset()
      }

      const branchProductTypeRef = this.$refs.branchProductTypeRef
      if (branchProductTypeRef && branchProductTypeRef.reset) {
        branchProductTypeRef.reset()
      }

      const productComponentsRef = this.$refs.productComponentsRef
      if (productComponentsRef && productComponentsRef.reset) {
        productComponentsRef.reset()
      }
    },

    handleClear() {
      this.$confirm.require({
        message: 'คุณต้องการล้างข้อมูลทั้งหมดหรือไม่?',
        header: 'ยืนยันการล้างข้อมูล',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'ใช่',
        rejectLabel: 'ไม่',
        accept: () => {
          this.resetForm()
          this.$toast.add({
            severity: 'info',
            summary: 'ล้างข้อมูลสำเร็จ',
            detail: 'ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว',
            life: 3000
          })
        }
      })
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
  align-items: center;
  gap: 1rem;
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

.page-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-buttons {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;

    :deep(.p-button) {
      width: 100%;
      justify-content: center;
    }
  }
}

.btn-clear {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s;
  background: white;
  color: #6b7280;
  border: 2px solid #d1d5db;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
    color: #374151;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s;
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
