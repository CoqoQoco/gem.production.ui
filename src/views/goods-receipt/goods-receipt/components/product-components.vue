<template>
  <div class="product-components-card">
    <!-- Section Title -->
    <div class="section-title">
      <i class="pi pi-th-large"></i>
      <span>{{ $t('goodsReceipt.components.title') || 'ส่วนประกอบสินค้า' }}</span>
    </div>

    <!-- Gold Components Section -->
    <div class="components-section">
      <div class="subsection-header">
        <div class="subsection-title">
          <i class="pi pi-circle-fill gold-icon"></i>
          <span>{{ $t('goodsReceipt.components.goldComponents') || 'ส่วนประกอบทอง' }}</span>
        </div>
        <button class="btn-add-component" @click="addGoldComponent">
          <i class="pi pi-plus"></i>
          <span>{{ $t('goodsReceipt.components.addGold') || 'เพิ่มทอง' }}</span>
        </button>
      </div>

      <!-- Gold Components List -->
      <div class="components-list">
        <div
          v-for="(goldComp, index) in componentsData.goldComponents"
          :key="`gold-${index}`"
          class="component-item"
        >
          <div class="component-fields">
            <!-- Gold Dropdown -->
            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.gold') || 'ทอง' }}
                <span class="required">*</span>
              </label>
              <FormDropdown
                :model-value="goldComp.goldCode"
                :options="golds"
                option-label="nameTh"
                option-value="code"
                :placeholder="$t('goodsReceipt.components.goldPlaceholder') || 'เลือกทอง'"
                :invalid="!!errors[`gold-${index}`]"
                @update:model-value="handleGoldChange(index, $event)"
              />
              <small v-if="errors[`gold-${index}`]" class="p-error">
                {{ errors[`gold-${index}`] }}
              </small>
            </div>

            <!-- Gold Shape Dropdown -->
            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.goldShape') || 'รูปร่างทอง' }}
                <span class="required">*</span>
              </label>
              <FormDropdown
                :model-value="goldComp.shapeCode"
                :options="gemShapes"
                option-label="nameTh"
                option-value="code"
                :placeholder="$t('goodsReceipt.components.goldShapePlaceholder') || 'เลือกรูปร่าง'"
                :invalid="!!errors[`gold-shape-${index}`]"
                @update:model-value="handleGoldShapeChange(index, $event)"
              />
              <small v-if="errors[`gold-shape-${index}`]" class="p-error">
                {{ errors[`gold-shape-${index}`] }}
              </small>
            </div>

            <!-- Weight Row (Weight + Weight Unit) -->
            <div class="form-group-row-inline">
              <div class="form-group">
                <label>
                  {{ $t('goodsReceipt.components.weight') || 'น้ำหนัก' }}
                  <span class="required">*</span>
                </label>
                <input
                  type="number"
                  :value="goldComp.weight"
                  :placeholder="$t('goodsReceipt.components.weightPlaceholder') || 'กรอกน้ำหนัก'"
                  :class="{ 'is-invalid': !!errors[`gold-weight-${index}`] }"
                  class="custom-input"
                  step="0.01"
                  min="0"
                  @input="updateGoldField(index, 'weight', $event.target.value)"
                />
                <small v-if="errors[`gold-weight-${index}`]" class="p-error">
                  {{ errors[`gold-weight-${index}`] }}
                </small>
              </div>

              <div class="form-group">
                <label>
                  {{ $t('goodsReceipt.components.weightUnit') || 'หน่วยน้ำหนัก' }}
                  <span class="required">*</span>
                </label>
                <InputText
                  :model-value="goldComp.weightUnit"
                  :placeholder="$t('goodsReceipt.components.weightUnitPlaceholder') || 'กรอกหน่วยน้ำหนัก'"
                  :class="{ 'p-invalid': !!errors[`gold-weightUnit-${index}`] }"
                  @update:model-value="updateGoldField(index, 'weightUnit', $event)"
                />
                <small v-if="errors[`gold-weightUnit-${index}`]" class="p-error">
                  {{ errors[`gold-weightUnit-${index}`] }}
                </small>
              </div>
            </div>

            <!-- Quantity Row (Qty + Qty Unit) -->
            <div class="form-group-row-inline">
              <div class="form-group">
                <label>
                  {{ $t('goodsReceipt.components.qty') || 'จำนวน' }}
                  <span class="required">*</span>
                </label>
                <input
                  type="number"
                  :value="goldComp.qty"
                  :placeholder="$t('goodsReceipt.components.qtyPlaceholder') || 'กรอกจำนวน'"
                  :class="{ 'is-invalid': !!errors[`gold-qty-${index}`] }"
                  class="custom-input"
                  step="0.01"
                  min="0"
                  @input="updateGoldField(index, 'qty', $event.target.value)"
                />
                <small v-if="errors[`gold-qty-${index}`]" class="p-error">
                  {{ errors[`gold-qty-${index}`] }}
                </small>
              </div>

              <div class="form-group">
                <label>
                  {{ $t('goodsReceipt.components.qtyUnit') || 'หน่วยนับ' }}
                  <span class="required">*</span>
                </label>
                <InputText
                  :model-value="goldComp.qtyUnit"
                  :placeholder="$t('goodsReceipt.components.qtyUnitPlaceholder') || 'กรอกหน่วยนับ'"
                  :class="{ 'p-invalid': !!errors[`gold-qtyUnit-${index}`] }"
                  @update:model-value="updateGoldField(index, 'qtyUnit', $event)"
                />
                <small v-if="errors[`gold-qtyUnit-${index}`]" class="p-error">
                  {{ errors[`gold-qtyUnit-${index}`] }}
                </small>
              </div>
            </div>
          </div>

          <!-- Remove Button -->
          <button class="btn-remove" @click="removeGoldComponent(index)" :title="$t('common.delete')">
            <i class="pi pi-trash"></i>
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="componentsData.goldComponents.length === 0" class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>{{ $t('goodsReceipt.components.noGoldComponents') || 'ยังไม่มีส่วนประกอบทอง' }}</p>
        </div>
      </div>
    </div>

    <!-- Gem Components Section -->
    <div class="components-section">
      <div class="subsection-header">
        <div class="subsection-title">
          <i class="pi pi-circle-fill gem-icon"></i>
          <span>{{ $t('goodsReceipt.components.gemComponents') || 'ส่วนประกอบพลอย' }}</span>
        </div>
        <button class="btn-add-component" @click="addGemComponent">
          <i class="pi pi-plus"></i>
          <span>{{ $t('goodsReceipt.components.addGem') || 'เพิ่มพลอย' }}</span>
        </button>
      </div>

      <!-- Gem Components List -->
      <div class="components-list">
        <div
          v-for="(gemComp, index) in componentsData.gemComponents"
          :key="`gem-${index}`"
          class="component-item"
        >
          <div class="component-fields">
            <!-- Gem Dropdown -->
            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.gem') || 'พลอย' }}
                <span class="required">*</span>
              </label>
              <FormDropdown
                :model-value="gemComp.gemCode"
                :options="gems"
                option-label="nameTh"
                option-value="code"
                :placeholder="$t('goodsReceipt.components.gemPlaceholder') || 'เลือกพลอย'"
                :invalid="!!errors[`gem-${index}`]"
                @update:model-value="handleGemChange(index, $event)"
              />
              <small v-if="errors[`gem-${index}`]" class="p-error">
                {{ errors[`gem-${index}`] }}
              </small>
            </div>

            <!-- Gem Shape Dropdown -->
            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.gemShape') || 'รูปร่างพลอย' }}
                <span class="required">*</span>
              </label>
              <FormDropdown
                :model-value="gemComp.shapeCode"
                :options="gemShapes"
                option-label="nameTh"
                option-value="code"
                :placeholder="$t('goodsReceipt.components.gemShapePlaceholder') || 'เลือกรูปร่าง'"
                :invalid="!!errors[`gem-shape-${index}`]"
                @update:model-value="handleGemShapeChange(index, $event)"
              />
              <small v-if="errors[`gem-shape-${index}`]" class="p-error">
                {{ errors[`gem-shape-${index}`] }}
              </small>
            </div>

            <!-- Weight Row (Weight + Weight Unit) -->
            <div class="form-group-row-inline">
              <div class="form-group">
                <label>
                  {{ $t('goodsReceipt.components.weight') || 'น้ำหนัก' }}
                  <span class="required">*</span>
                </label>
                <input
                  type="number"
                  :value="gemComp.weight"
                  :placeholder="$t('goodsReceipt.components.weightPlaceholder') || 'กรอกน้ำหนัก'"
                  :class="{ 'is-invalid': !!errors[`gem-weight-${index}`] }"
                  class="custom-input"
                  step="0.01"
                  min="0"
                  @input="updateGemField(index, 'weight', $event.target.value)"
                />
                <small v-if="errors[`gem-weight-${index}`]" class="p-error">
                  {{ errors[`gem-weight-${index}`] }}
                </small>
              </div>

              <div class="form-group">
                <label>
                  {{ $t('goodsReceipt.components.weightUnit') || 'หน่วยน้ำหนัก' }}
                  <span class="required">*</span>
                </label>
                <InputText
                  :model-value="gemComp.weightUnit"
                  :placeholder="$t('goodsReceipt.components.weightUnitPlaceholder') || 'กรอกหน่วยน้ำหนัก'"
                  :class="{ 'p-invalid': !!errors[`gem-weightUnit-${index}`] }"
                  @update:model-value="updateGemField(index, 'weightUnit', $event)"
                />
                <small v-if="errors[`gem-weightUnit-${index}`]" class="p-error">
                  {{ errors[`gem-weightUnit-${index}`] }}
                </small>
              </div>
            </div>

            <!-- Quantity Row (Qty + Qty Unit) -->
            <div class="form-group-row-inline">
              <div class="form-group">
                <label>
                  {{ $t('goodsReceipt.components.qty') || 'จำนวน' }}
                  <span class="required">*</span>
                </label>
                <input
                  type="number"
                  :value="gemComp.qty"
                  :placeholder="$t('goodsReceipt.components.qtyPlaceholder') || 'กรอกจำนวน'"
                  :class="{ 'is-invalid': !!errors[`gem-qty-${index}`] }"
                  class="custom-input"
                  step="0.01"
                  min="0"
                  @input="updateGemField(index, 'qty', $event.target.value)"
                />
                <small v-if="errors[`gem-qty-${index}`]" class="p-error">
                  {{ errors[`gem-qty-${index}`] }}
                </small>
              </div>

              <div class="form-group">
                <label>
                  {{ $t('goodsReceipt.components.qtyUnit') || 'หน่วยนับ' }}
                  <span class="required">*</span>
                </label>
                <InputText
                  :model-value="gemComp.qtyUnit"
                  :placeholder="$t('goodsReceipt.components.qtyUnitPlaceholder') || 'กรอกหน่วยนับ'"
                  :class="{ 'p-invalid': !!errors[`gem-qtyUnit-${index}`] }"
                  @update:model-value="updateGemField(index, 'qtyUnit', $event)"
                />
                <small v-if="errors[`gem-qtyUnit-${index}`]" class="p-error">
                  {{ errors[`gem-qtyUnit-${index}`] }}
                </small>
              </div>
            </div>
          </div>

          <!-- Remove Button -->
          <button class="btn-remove" @click="removeGemComponent(index)" :title="$t('common.delete')">
            <i class="pi pi-trash"></i>
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="componentsData.gemComponents.length === 0" class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>{{ $t('goodsReceipt.components.noGemComponents') || 'ยังไม่มีส่วนประกอบพลอย' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormDropdown from '@/components/common/form-dropdown.vue'
import InputText from 'primevue/inputtext'
import { useGoldApiStore } from '@/stores/api/gold-api'
import { useGemApiStore } from '@/stores/api/gem-api'
import { useGemShapeApiStore } from '@/stores/api/gem-shape-api'

export default {
  name: 'ProductComponents',

  components: {
    FormDropdown,
    InputText
  },

  props: {
    modelValue: {
      type: Object,
      default: () => ({
        goldComponents: [],
        gemComponents: []
      })
    }
  },

  emits: ['update:modelValue', 'validate'],

  data() {
    return {
      goldApiStore: useGoldApiStore(),
      gemApiStore: useGemApiStore(),
      gemShapeApiStore: useGemShapeApiStore(),
      componentsData: {
        goldComponents: [],
        gemComponents: []
      },
      golds: [],
      gems: [],
      gemShapes: [],
      errors: {},
      isUpdatingFromParent: false
    }
  },

  async mounted() {
    await this.loadGolds()
    await this.loadGems()
    await this.loadGemShapes()
  },

  watch: {
    modelValue: {
      handler(newValue) {
        if (newValue && !this.isUpdatingFromParent) {
          this.isUpdatingFromParent = true
          this.componentsData = JSON.parse(JSON.stringify(newValue))
          this.$nextTick(() => {
            this.isUpdatingFromParent = false
          })
        }
      },
      deep: true,
      immediate: true
    },

    componentsData: {
      handler(newValue) {
        if (!this.isUpdatingFromParent) {
          this.$emit('update:modelValue', newValue)
        }
      },
      deep: true
    }
  },

  methods: {
    async loadGolds() {
      try {
        const result = await this.goldApiStore.listGolds({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null }
        })
        if (result.success) {
          this.golds = result.data
        }
      } catch (error) {
        console.error('Error loading golds:', error)
      }
    },

    async loadGems() {
      try {
        const result = await this.gemApiStore.listGems({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null }
        })
        if (result.success) {
          this.gems = result.data
        }
      } catch (error) {
        console.error('Error loading gems:', error)
      }
    },

    async loadGemShapes() {
      try {
        const result = await this.gemShapeApiStore.listGemShapes({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null }
        })
        if (result.success) {
          this.gemShapes = result.data
        }
      } catch (error) {
        console.error('Error loading gem shapes:', error)
      }
    },

    addGoldComponent() {
      const newGoldComponents = [
        ...this.componentsData.goldComponents,
        {
          goldCode: '',
          goldNameTh: '',
          goldNameEn: '',
          shapeCode: '',
          shapeNameTh: '',
          shapeNameEn: '',
          weight: null,
          weightUnit: '',
          qty: null,
          qtyUnit: ''
        }
      ]
      this.componentsData = {
        ...this.componentsData,
        goldComponents: newGoldComponents
      }
    },

    removeGoldComponent(index) {
      const newGoldComponents = this.componentsData.goldComponents.filter((_, i) => i !== index)
      this.componentsData = {
        ...this.componentsData,
        goldComponents: newGoldComponents
      }
      delete this.errors[`gold-${index}`]
      delete this.errors[`gold-shape-${index}`]
      delete this.errors[`gold-weight-${index}`]
      delete this.errors[`gold-weightUnit-${index}`]
      delete this.errors[`gold-qty-${index}`]
      delete this.errors[`gold-qtyUnit-${index}`]
    },

    addGemComponent() {
      const newGemComponents = [
        ...this.componentsData.gemComponents,
        {
          gemCode: '',
          gemNameTh: '',
          gemNameEn: '',
          shapeCode: '',
          shapeNameTh: '',
          shapeNameEn: '',
          weight: null,
          weightUnit: '',
          qty: null,
          qtyUnit: ''
        }
      ]
      this.componentsData = {
        ...this.componentsData,
        gemComponents: newGemComponents
      }
    },

    removeGemComponent(index) {
      const newGemComponents = this.componentsData.gemComponents.filter((_, i) => i !== index)
      this.componentsData = {
        ...this.componentsData,
        gemComponents: newGemComponents
      }
      delete this.errors[`gem-${index}`]
      delete this.errors[`gem-shape-${index}`]
      delete this.errors[`gem-weight-${index}`]
      delete this.errors[`gem-weightUnit-${index}`]
      delete this.errors[`gem-qty-${index}`]
      delete this.errors[`gem-qtyUnit-${index}`]
    },

    updateGoldField(index, field, value) {
      const newComponents = [...this.componentsData.goldComponents]
      if (field === 'weight' || field === 'qty') {
        newComponents[index][field] = value ? parseFloat(value) : null
      } else {
        newComponents[index][field] = value
      }
      this.componentsData = {
        ...this.componentsData,
        goldComponents: newComponents
      }
      this.clearError(`gold-${field}-${index}`)
    },

    updateGemField(index, field, value) {
      const newComponents = [...this.componentsData.gemComponents]
      if (field === 'weight' || field === 'qty') {
        newComponents[index][field] = value ? parseFloat(value) : null
      } else {
        newComponents[index][field] = value
      }
      this.componentsData = {
        ...this.componentsData,
        gemComponents: newComponents
      }
      this.clearError(`gem-${field}-${index}`)
    },

    handleGoldChange(index, value) {
      const selectedGold = this.golds.find(g => g.code === value)
      if (selectedGold) {
        const newComponents = [...this.componentsData.goldComponents]
        newComponents[index].goldCode = selectedGold.code
        newComponents[index].goldNameTh = selectedGold.nameTh
        newComponents[index].goldNameEn = selectedGold.nameEn
        this.componentsData = {
          ...this.componentsData,
          goldComponents: newComponents
        }
      }
      this.clearError(`gold-${index}`)
    },

    handleGoldShapeChange(index, value) {
      const selectedShape = this.gemShapes.find(s => s.code === value)
      if (selectedShape) {
        const newComponents = [...this.componentsData.goldComponents]
        newComponents[index].shapeCode = selectedShape.code
        newComponents[index].shapeNameTh = selectedShape.nameTh
        newComponents[index].shapeNameEn = selectedShape.nameEn
        this.componentsData = {
          ...this.componentsData,
          goldComponents: newComponents
        }
      }
      this.clearError(`gold-shape-${index}`)
    },

    handleGemChange(index, value) {
      const selectedGem = this.gems.find(g => g.code === value)
      if (selectedGem) {
        const newComponents = [...this.componentsData.gemComponents]
        newComponents[index].gemCode = selectedGem.code
        newComponents[index].gemNameTh = selectedGem.nameTh
        newComponents[index].gemNameEn = selectedGem.nameEn
        this.componentsData = {
          ...this.componentsData,
          gemComponents: newComponents
        }
      }
      this.clearError(`gem-${index}`)
    },

    handleGemShapeChange(index, value) {
      const selectedShape = this.gemShapes.find(s => s.code === value)
      if (selectedShape) {
        const newComponents = [...this.componentsData.gemComponents]
        newComponents[index].shapeCode = selectedShape.code
        newComponents[index].shapeNameTh = selectedShape.nameTh
        newComponents[index].shapeNameEn = selectedShape.nameEn
        this.componentsData = {
          ...this.componentsData,
          gemComponents: newComponents
        }
      }
      this.clearError(`gem-shape-${index}`)
    },

    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field]
      }
    },

    validate() {
      this.errors = {}

      // Validate Gold Components
      this.componentsData.goldComponents.forEach((goldComp, index) => {
        if (!goldComp.goldCode || !goldComp.goldCode.trim()) {
          this.errors[`gold-${index}`] = this.$t('goodsReceipt.components.validation.goldRequired') || 'กรุณาเลือกทอง'
        }
        if (!goldComp.shapeCode || !goldComp.shapeCode.trim()) {
          this.errors[`gold-shape-${index}`] = this.$t('goodsReceipt.components.validation.goldShapeRequired') || 'กรุณาเลือกรูปร่าง'
        }
        if (!goldComp.weight || goldComp.weight <= 0) {
          this.errors[`gold-weight-${index}`] = this.$t('goodsReceipt.components.validation.weightRequired') || 'กรุณากรอกน้ำหนัก'
        }
        if (!goldComp.weightUnit || !goldComp.weightUnit.trim()) {
          this.errors[`gold-weightUnit-${index}`] = this.$t('goodsReceipt.components.validation.weightUnitRequired') || 'กรุณากรอกหน่วยน้ำหนัก'
        }
        if (!goldComp.qty || goldComp.qty <= 0) {
          this.errors[`gold-qty-${index}`] = this.$t('goodsReceipt.components.validation.qtyRequired') || 'กรุณากรอกจำนวน'
        }
        if (!goldComp.qtyUnit || !goldComp.qtyUnit.trim()) {
          this.errors[`gold-qtyUnit-${index}`] = this.$t('goodsReceipt.components.validation.qtyUnitRequired') || 'กรุณากรอกหน่วยนับ'
        }
      })

      // Validate Gem Components
      this.componentsData.gemComponents.forEach((gemComp, index) => {
        if (!gemComp.gemCode || !gemComp.gemCode.trim()) {
          this.errors[`gem-${index}`] = this.$t('goodsReceipt.components.validation.gemRequired') || 'กรุณาเลือกพลอย'
        }
        if (!gemComp.shapeCode || !gemComp.shapeCode.trim()) {
          this.errors[`gem-shape-${index}`] = this.$t('goodsReceipt.components.validation.gemShapeRequired') || 'กรุณาเลือกรูปร่าง'
        }
        if (!gemComp.weight || gemComp.weight <= 0) {
          this.errors[`gem-weight-${index}`] = this.$t('goodsReceipt.components.validation.weightRequired') || 'กรุณากรอกน้ำหนัก'
        }
        if (!gemComp.weightUnit || !gemComp.weightUnit.trim()) {
          this.errors[`gem-weightUnit-${index}`] = this.$t('goodsReceipt.components.validation.weightUnitRequired') || 'กรุณากรอกหน่วยน้ำหนัก'
        }
        if (!gemComp.qty || gemComp.qty <= 0) {
          this.errors[`gem-qty-${index}`] = this.$t('goodsReceipt.components.validation.qtyRequired') || 'กรุณากรอกจำนวน'
        }
        if (!gemComp.qtyUnit || !gemComp.qtyUnit.trim()) {
          this.errors[`gem-qtyUnit-${index}`] = this.$t('goodsReceipt.components.validation.qtyUnitRequired') || 'กรุณากรอกหน่วยนับ'
        }
      })

      const isValid = Object.keys(this.errors).length === 0
      this.$emit('validate', isValid)
      return isValid
    },

    reset() {
      this.componentsData = {
        goldComponents: [],
        gemComponents: []
      }
      this.errors = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.product-components-card {
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

.components-section {
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.subsection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

.subsection-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;

  .gold-icon {
    color: #fbbf24;
    font-size: 0.75rem;
  }

  .gem-icon {
    color: #8b5cf6;
    font-size: 0.75rem;
  }
}

.btn-add-component {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #ff1493 0%, #c71585 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(255, 105, 180, 0.3);
  }

  i {
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}

.components-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.component-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
}

.component-fields {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group-row-inline {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;

    .required {
      color: #ef4444;
      margin-left: 0.25rem;
    }
  }

  :deep(.p-select),
  :deep(.p-inputtext),
  .custom-input {
    width: 100%;
    height: 40px;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    transition: all 0.2s;
    padding: 0.625rem 0.875rem;
    font-size: 0.9375rem;

    &:focus,
    &:focus-within {
      outline: none;
      border-color: #ff69b4;
      box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
    }

    &.p-invalid,
    &.is-invalid {
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

.btn-remove {
  padding: 0.5rem;
  background: white;
  color: #ef4444;
  border: 2px solid #fecaca;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1.75rem;

  &:hover {
    background: #fef2f2;
    border-color: #ef4444;
    color: #dc2626;
  }

  i {
    font-size: 1rem;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #9ca3af;
  text-align: center;

  i {
    font-size: 2.5rem;
    color: #d1d5db;
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.9375rem;
    color: #6b7280;
    margin: 0;
  }
}
</style>
