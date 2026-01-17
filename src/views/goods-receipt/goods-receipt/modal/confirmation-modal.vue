<template>
  <Dialog
    v-model:visible="visible"
    :header="$t('goodsReceipt.confirmModal.title') || 'ยืนยันข้อมูลการบันทึกสินค้า'"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="confirmation-modal"
    :style="{ width: '90vw', maxWidth: '1000px' }"
  >
    <div class="modal-content">
      <!-- Product Information Section -->
      <div class="summary-section">
        <div class="section-header">
          <i class="pi pi-tag"></i>
          <h3>{{ $t('goodsReceipt.confirmModal.productInfo') || 'ข้อมูลสินค้า' }}</h3>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ $t('goodsReceipt.form.originNumber') || 'หมายเลขต้นทาง' }}:</span>
            <span class="info-value">{{ productData.originNumber }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('goodsReceipt.form.mold') || 'รหัสแม่พิมพ์' }}:</span>
            <span class="info-value">{{ productData.mold }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('goodsReceipt.form.productNameEn') || 'ชื่อสินค้า (EN)' }}:</span>
            <span class="info-value">{{ productData.productNameEn }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('goodsReceipt.form.productNameTH') || 'ชื่อสินค้า (TH)' }}:</span>
            <span class="info-value">{{ productData.productNameTH }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('goodsReceipt.form.qty') || 'จำนวน' }}:</span>
            <span class="info-value">{{ productData.qty }} {{ productData.qtyUnit }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('goodsReceipt.form.price') || 'ราคา' }}:</span>
            <span class="info-value">{{ formatNumber(productData.price) }} {{ productData.unitPrice }}</span>
          </div>
        </div>
      </div>

      <!-- Branch and Product Type Section -->
      <div class="summary-section">
        <div class="section-header">
          <i class="pi pi-building"></i>
          <h3>{{ $t('goodsReceipt.confirmModal.branchProductType') || 'สาขาและประเภทสินค้า' }}</h3>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ $t('goodsReceipt.form.branch') || 'สาขา' }}:</span>
            <span class="info-value">{{ branchProductTypeData.branchNameTh }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('goodsReceipt.form.productType') || 'ประเภทสินค้า' }}:</span>
            <span class="info-value">{{ branchProductTypeData.productTypeNameTh }}</span>
          </div>
        </div>
      </div>

      <!-- Product Image Section -->
      <div v-if="componentsData.productImageUrl" class="summary-section">
        <div class="section-header">
          <i class="pi pi-image"></i>
          <h3>{{ $t('goodsReceipt.components.productImage') || 'รูปภาพสินค้า' }}</h3>
        </div>
        <div class="image-preview">
          <img :src="componentsData.productImageUrl" alt="Product Image" />
        </div>
      </div>

      <!-- Components Section -->
      <div v-if="componentsData.components && componentsData.components.length > 0" class="summary-section">
        <div class="section-header">
          <i class="pi pi-th-large"></i>
          <h3>{{ $t('goodsReceipt.components.title') || 'ส่วนประกอบสินค้า' }}</h3>
        </div>
        <div class="components-list">
          <div v-for="(component, index) in componentsData.components" :key="'component-' + index" class="component-item">
            <div class="component-header">
              <span class="component-number">{{ index + 1 }}</span>
              <span :class="['component-type-badge', `type-${component.type}`]">
                {{ getTypeName(component.type) }}
              </span>
            </div>
            <div class="component-details">
              <!-- Gold Details -->
              <template v-if="component.type === 'gold'">
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.gold') || 'ทอง' }}:</span>
                  <span class="info-value">{{ component.itemNameTh }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.goldShape') || 'รูปร่างทอง' }}:</span>
                  <span class="info-value">{{ component.shapeNameTh }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.wastePercent') || '%waste' }}:</span>
                  <span class="info-value">{{ formatNumber(component.wastePercent) }}%</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.labelWeight') || 'น้ำหนักป้าย' }}:</span>
                  <span class="info-value">{{ formatNumber(component.labelWeight) }} {{ component.weightUnit }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.weight') || 'น้ำหนัก' }}:</span>
                  <span class="info-value">{{ formatNumber(component.weight) }} {{ component.weightUnit }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.qty') || 'จำนวน' }}:</span>
                  <span class="info-value">{{ formatNumber(component.qty) }} {{ component.qtyUnit }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.cost') || 'ต้นทุน' }}:</span>
                  <span class="info-value cost-value">{{ formatCurrency(component.cost) }}</span>
                </div>
              </template>

              <!-- Gem Details -->
              <template v-if="component.type === 'gem'">
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.gem') || 'พลอย' }}:</span>
                  <span class="info-value">{{ component.itemNameTh }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.gemShape') || 'รูปร่างพลอย' }}:</span>
                  <span class="info-value">{{ component.shapeNameTh }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.size') || 'ขนาด' }}:</span>
                  <span class="info-value">{{ component.size }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.origin') || 'แหล่งที่มา' }}:</span>
                  <span class="info-value">{{ component.origin }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.weight') || 'น้ำหนัก' }}:</span>
                  <span class="info-value">{{ formatNumber(component.weight) }} {{ component.weightUnit }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.qty') || 'จำนวน' }}:</span>
                  <span class="info-value">{{ formatNumber(component.qty) }} {{ component.qtyUnit }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.cost') || 'ต้นทุน' }}:</span>
                  <span class="info-value cost-value">{{ formatCurrency(component.cost) }}</span>
                </div>
              </template>

              <!-- Labor Details -->
              <template v-if="component.type === 'labor'">
                <div class="info-item full-width">
                  <span class="info-label">{{ $t('goodsReceipt.components.laborTitle') || 'หัวข้อ' }}:</span>
                  <span class="info-value">{{ component.itemNameTh }}</span>
                </div>
                <div v-if="component.description" class="info-item full-width">
                  <span class="info-label">{{ $t('goodsReceipt.components.laborDescription') || 'รายละเอียด' }}:</span>
                  <span class="info-value">{{ component.description }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('goodsReceipt.components.cost') || 'ต้นทุน' }}:</span>
                  <span class="info-value cost-value">{{ formatCurrency(component.cost) }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Cost Summary -->
        <div v-if="componentsData.costSummary" class="cost-summary">
          <div class="cost-row">
            <span class="cost-label">{{ $t('goodsReceipt.components.actualCost') || 'ราคาต้นทุนจริง' }}:</span>
            <span class="cost-value">{{ formatCurrency(componentsData.costSummary.actualCost) }}</span>
          </div>
          <div class="cost-row">
            <span class="cost-label">{{ $t('goodsReceipt.components.usedCost') || 'ราคาต้นทุนที่ใช้' }}:</span>
            <span class="cost-value">{{ formatCurrency(componentsData.costSummary.usedCost) }}</span>
          </div>
          <div class="cost-row">
            <span class="cost-label">{{ $t('goodsReceipt.components.discountPercent') || 'ส่วนลด' }}:</span>
            <span class="cost-value">{{ formatNumber(componentsData.costSummary.discountPercent) }}%</span>
          </div>
          <div class="cost-row final-cost">
            <span class="cost-label">{{ $t('goodsReceipt.components.finalCost') || 'ราคาสุดท้าย' }}:</span>
            <span class="cost-value">{{ formatCurrency(componentsData.costSummary.finalCost) }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <Button
          :label="$t('goodsReceipt.confirmModal.backToEdit') || 'กลับไปแก้ไข'"
          icon="pi pi-arrow-left"
          class="p-button-secondary btn-back"
          @click="handleBack"
          :disabled="isSaving"
        />
        <Button
          :label="$t('goodsReceipt.confirmModal.confirmSave') || 'ยืนยันบันทึกสินค้า'"
          icon="pi pi-check"
          class="p-button-success btn-confirm"
          @click="handleConfirm"
          :loading="isSaving"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

export default {
  name: 'ConfirmationModal',

  components: {
    Dialog,
    Button
  },

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    productData: {
      type: Object,
      default: () => ({})
    },
    branchProductTypeData: {
      type: Object,
      default: () => ({})
    },
    componentsData: {
      type: Object,
      default: () => ({
        components: [],
        productImageUrl: '',
        costSummary: {}
      })
    },
    isSaving: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue', 'confirm', 'back'],

  computed: {
    visible: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },

  methods: {
    handleConfirm() {
      this.$emit('confirm')
    },

    handleBack() {
      this.$emit('update:modelValue', false)
      this.$emit('back')
    },

    formatNumber(value) {
      if (value === null || value === undefined) return '-'
      return new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value)
    },

    formatCurrency(value) {
      if (value === null || value === undefined) return '฿0.00'
      return `฿${parseFloat(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },

    getTypeName(type) {
      const types = {
        gold: 'ทอง',
        gem: 'เพชร/พลอย',
        labor: 'ค่าแรง/ต้นทุนอื่นๆ'
      }
      return types[type] || type
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.confirmation-modal) {
  .p-dialog-header {
    background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 12px 12px 0 0;

    .p-dialog-title {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .p-dialog-header-icon {
      color: white;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .p-dialog-content {
    padding: 0;
  }
}

.modal-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 1.5rem;
}

.summary-section {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;

  i {
    font-size: 1.5rem;
    color: #ff69b4;

    &.gold-icon {
      color: #fbbf24;
    }

    &.gem-icon {
      color: #a855f7;
    }
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
}

.components-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.component-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.component-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.component-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.component-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;

  &.type-gold {
    background: rgba(251, 191, 36, 0.1);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, 0.3);
  }

  &.type-gem {
    background: rgba(168, 85, 247, 0.1);
    color: #a855f7;
    border: 1px solid rgba(168, 85, 247, 0.3);
  }

  &.type-labor {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
}

.component-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .info-item.full-width {
    grid-column: 1 / -1;
  }
}

.info-item .cost-value {
  color: #059669;
  font-weight: 600;
}

.image-preview {
  display: flex;
  justify-content: center;

  img {
    max-width: 400px;
    max-height: 400px;
    width: auto;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.cost-summary {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e5e7eb;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 6px;

  &.final-cost {
    background: #fff5f7;
    border: 2px solid #ff69b4;
    padding: 1rem;
    margin-top: 0.75rem;

    .cost-label,
    .cost-value {
      color: #ff69b4;
      font-weight: 700;
      font-size: 1.125rem;
    }
  }

  .cost-label {
    font-weight: 600;
    color: #374151;
  }

  .cost-value {
    font-weight: 600;
    color: #059669;
    font-size: 1rem;
  }
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column-reverse;

    :deep(.p-button) {
      width: 100%;
      justify-content: center;
    }
  }
}

.btn-back {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
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

:deep(.btn-confirm) {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  border: none;

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
