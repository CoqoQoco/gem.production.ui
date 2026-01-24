<template>
  <div class="mass-update-gold-price-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <i class="pi pi-sync"></i>
          <div class="header-text">
            <h1>ปรับราคาทองจำนวนมาก</h1>
            <p>อัปเดตราคาทองของสินค้าหลายรายการพร้อมกัน</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Content -->
    <div class="page-content">
      <!-- Search Section -->
      <div class="section-card search-section">
        <div class="section-title">
          <i class="pi pi-search"></i>
          <span>ค้นหาสินค้า</span>
        </div>

        <div class="search-content">
          <div class="form-group">
            <label>รหัสสินค้า (Stock Number)</label>
            <div class="stock-number-input-group">
              <Textarea
                v-model="stockNumberInput"
                rows="3"
                placeholder="ใส่รหัสสินค้าเพื่อค้นหา (คั่นด้วยเครื่องหมายจุลภาค, เว้นวรรค หรือขึ้นบรรทัดใหม่)"
                :class="{ 'p-invalid': searchError }"
                @input="clearSearchError"
              />
              <small v-if="searchError" class="p-error">{{ searchError }}</small>
              <small class="help-text">
                <i class="pi pi-info-circle"></i>
                ตัวอย่าง: ST001, ST002, ST003 หรือ ST001 ST002 ST003
              </small>
            </div>
          </div>

          <div class="search-actions">
            <button class="btn-search" @click="handleSearch" :disabled="isSearching || !stockNumberInput">
              <i :class="isSearching ? 'pi pi-spin pi-spinner' : 'pi pi-search'"></i>
              <span>{{ isSearching ? 'กำลังค้นหา...' : 'ค้นหา' }}</span>
            </button>
            <button class="btn-clear" @click="handleClearSearch" :disabled="isSearching">
              <i class="pi pi-times"></i>
              <span>ล้างข้อมูล</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="stocks.length > 0" class="section-card results-section">
        <div class="section-title">
          <i class="pi pi-list"></i>
          <span>รายการสินค้า ({{ stocks.length }} รายการ)</span>
        </div>

        <!-- Global Gold Price Input -->
        <div class="global-price-section">
          <div class="form-group">
            <label>
              ราคาทองใหม่ (บาท/กรัม)
              <span class="info-badge">ใช้กับทุกรายการ</span>
            </label>
            <div class="global-price-input-group">
              <InputNumber
                v-model="globalGoldPrice"
                mode="decimal"
                :minFractionDigits="2"
                :maxFractionDigits="2"
                placeholder="ใส่ราคาทองใหม่"
                :min="0"
              />
              <button
                class="btn-apply-global"
                @click="applyGlobalGoldPrice"
                :disabled="!globalGoldPrice || globalGoldPrice <= 0"
              >
                <i class="pi pi-check"></i>
                <span>ใช้ราคานี้ทั้งหมด</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Stock List Table -->
        <div class="stocks-table-wrapper">
          <table class="stocks-table">
            <thead>
              <tr>
                <th class="no-column">ลำดับ</th>
                <th>รหัสสินค้า</th>
                <th>ชื่อสินค้า</th>
                <th>ราคาทุนเดิม</th>
                <th>ราคาทองเดิม</th>
                <th>ราคาทองใหม่</th>
                <th>ราคาทุนใหม่</th>
                <th class="action-column">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(stock, index) in stocks"
                :key="`${stock.stockNumber}-${stock.goldMaterialIndex}`"
                :class="[
                  'stock-row',
                  { 'group-first': isFirstInGroup(index) },
                  { 'group-last': isLastInGroup(index) },
                  { 'has-group': hasMultipleGoldMaterials(stock.stockNumber) }
                ]"
              >
                <!-- No. -->
                <td class="no-column">
                  <span v-if="isFirstInGroup(index)">{{ getGroupNumber(index) }}</span>
                </td>

                <!-- Stock Number -->
                <td>
                  <strong v-if="isFirstInGroup(index)" class="stock-number-badge">{{ stock.stockNumber }}</strong>
                </td>

                <!-- Product Name -->
                <td>
                  <div class="product-info">
                    <strong v-if="isFirstInGroup(index)">{{ stock.productNameTh || '-' }}</strong>
                    <small v-if="isFirstInGroup(index) && stock.productNameEn">{{ stock.productNameEn }}</small>
                    <span v-if="stock.goldMaterialName" class="gold-material-badge">
                      <i class="pi pi-circle-fill"></i>
                      {{ stock.goldMaterialName }}
                    </span>
                  </div>
                </td>

                <!-- Original Cost -->
                <td class="cost-cell">
                  <strong>{{ formatCurrency(stock.originalCost) }}</strong>
                </td>

                <!-- Original Gold Price -->
                <td class="price-cell">
                  {{ formatCurrency(stock.originalGoldPrice) }}
                </td>

                <!-- New Gold Price Input -->
                <td>
                  <InputNumber
                    v-model="stock.newGoldPrice"
                    mode="decimal"
                    :minFractionDigits="2"
                    :maxFractionDigits="2"
                    placeholder="ราคาทองใหม่"
                    :min="0"
                    class="price-input"
                    @update:modelValue="handleGoldPriceChange(stock)"
                    @blur="handleGoldPriceChange(stock)"
                  />
                </td>

                <!-- New Cost (Calculated) -->
                <td class="new-cost-cell">
                  <strong :class="{ 'cost-changed': stock.newCost !== stock.originalCost }">
                    {{ formatCurrency(stock.newCost) }}
                  </strong>
                  <div v-if="stock.newCost !== stock.originalCost" class="cost-diff">
                    <span :class="stock.newCost > stock.originalCost ? 'increase' : 'decrease'">
                      {{ formatDifference(stock.newCost - stock.originalCost) }}
                    </span>
                  </div>
                </td>

                <!-- Actions -->
                <td class="action-column">
                  <button
                    class="btn-view-details"
                    @click="viewStockDetails(stock)"
                    title="ดูรายละเอียด"
                  >
                    <i class="pi pi-eye"></i>
                  </button>
                  <button
                    class="btn-remove-stock"
                    @click="removeStock(index)"
                    title="ลบออกจากรายการ"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Footer -->
        <div class="summary-footer">
          <div class="summary-item">
            <span class="summary-label">จำนวนสินค้าทั้งหมด:</span>
            <span class="summary-value">{{ stocks.length }} รายการ</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">ราคาทุนรวมเดิม:</span>
            <span class="summary-value">{{ formatCurrency(totalOriginalCost) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">ราคาทุนรวมใหม่:</span>
            <span class="summary-value highlight">{{ formatCurrency(totalNewCost) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">ผลต่าง:</span>
            <span
              class="summary-value"
              :class="totalDifference > 0 ? 'increase' : totalDifference < 0 ? 'decrease' : ''"
            >
              {{ formatDifference(totalDifference) }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn-cancel" @click="handleClearSearch">
            <i class="pi pi-times"></i>
            <span>ยกเลิก</span>
          </button>
          <button
            class="btn-submit"
            @click="showConfirmModal = true"
            :disabled="!hasChanges || isSubmitting"
          >
            <i :class="isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'"></i>
            <span>{{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง' }}</span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isSearching" class="empty-state">
        <i class="pi pi-inbox"></i>
        <p>ยังไม่มีข้อมูลสินค้า กรุณาค้นหาสินค้าด้วยรหัสสินค้า</p>
      </div>
    </div>

    <!-- Stock Details Modal -->
    <Dialog
      v-model:visible="showDetailsModal"
      :header="`รายละเอียดสินค้า: ${selectedStock?.stockNumber || ''}`"
      :style="{ width: '800px' }"
      class="stock-details-dialog"
    >
      <div v-if="selectedStock" class="stock-details-content">
        <!-- Stock Information -->
        <div class="details-section">
          <h4 class="details-section-title">
            <i class="pi pi-box"></i>
            ข้อมูลสินค้า
          </h4>
          <div class="details-grid">
            <div class="detail-item">
              <label>รหัสสินค้า</label>
              <span>{{ selectedStock.stockNumber }}</span>
            </div>
            <div class="detail-item">
              <label>ชื่อสินค้า (TH)</label>
              <span>{{ selectedStock.productNameTh || '-' }}</span>
            </div>
            <div class="detail-item">
              <label>ชื่อสินค้า (EN)</label>
              <span>{{ selectedStock.productNameEn || '-' }}</span>
            </div>
            <div class="detail-item">
              <label>ประเภทสินค้า</label>
              <span>{{ selectedStock.productTypeNameTh || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Gold Materials -->
        <div v-if="selectedStock.goldMaterials && selectedStock.goldMaterials.length > 0" class="details-section">
          <h4 class="details-section-title">
            <i class="pi pi-circle-fill" style="color: #e7de99;"></i>
            ส่วนประกอบทอง ({{ selectedStock.goldMaterials.length }} รายการ)
          </h4>
          <div class="materials-list">
            <div v-for="(material, idx) in selectedStock.goldMaterials" :key="idx" class="material-item">
              <div class="material-header">
                <strong>{{ material.itemNameTh || material.itemNameEn || '-' }}</strong>
                <span class="material-type-badge gold">ทอง</span>
              </div>
              <div class="material-details-grid">
                <div class="material-detail">
                  <span class="label">รูปร่าง:</span>
                  <span>{{ material.shapeNameTh || '-' }}</span>
                </div>
                <div class="material-detail">
                  <span class="label">น้ำหนัก:</span>
                  <span>{{ material.weight }} {{ material.weightUnit }}</span>
                </div>
                <div class="material-detail">
                  <span class="label">%waste:</span>
                  <span>{{ material.wastePercent }}%</span>
                </div>
                <div class="material-detail">
                  <span class="label">ราคาเดิม:</span>
                  <span>{{ formatCurrency(material.price) }}/{{ material.weightUnit }}</span>
                </div>
                <div class="material-detail">
                  <span class="label">ต้นทุนเดิม:</span>
                  <span class="cost-value">{{ formatCurrency(material.cost) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Materials -->
        <div v-if="selectedStock.otherMaterials && selectedStock.otherMaterials.length > 0" class="details-section">
          <h4 class="details-section-title">
            <i class="pi pi-circle-fill" style="color: #9333ea;"></i>
            ส่วนประกอบอื่นๆ ({{ selectedStock.otherMaterials.length }} รายการ)
          </h4>
          <div class="materials-list">
            <div v-for="(material, idx) in selectedStock.otherMaterials" :key="idx" class="material-item">
              <div class="material-header">
                <strong>{{ material.itemNameTh || material.itemNameEn || material.type || '-' }}</strong>
                <span :class="['material-type-badge', material.type === 'gem' ? 'gem' : 'labor']">
                  {{ material.type === 'gem' ? 'พลอย' : 'ค่าแรง' }}
                </span>
              </div>
              <div class="material-details-grid">
                <div v-if="material.shapeNameTh" class="material-detail">
                  <span class="label">รูปร่าง:</span>
                  <span>{{ material.shapeNameTh }}</span>
                </div>
                <div v-if="material.weight" class="material-detail">
                  <span class="label">น้ำหนัก:</span>
                  <span>{{ material.weight }} {{ material.weightUnit }}</span>
                </div>
                <div class="material-detail">
                  <span class="label">ต้นทุน:</span>
                  <span class="cost-value">{{ formatCurrency(material.cost) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cost Summary -->
        <div class="details-section cost-summary-section">
          <h4 class="details-section-title">
            <i class="pi pi-calculator"></i>
            สรุปราคาทุน
          </h4>
          <div class="cost-summary-grid">
            <div class="cost-summary-row">
              <span>ราคาทุนเดิม:</span>
              <strong>{{ formatCurrency(selectedStock.originalCost) }}</strong>
            </div>
            <div class="cost-summary-row">
              <span>ราคาทุนใหม่:</span>
              <strong class="new-cost">{{ formatCurrency(selectedStock.newCost) }}</strong>
            </div>
            <div class="cost-summary-row total">
              <span>ผลต่าง:</span>
              <strong :class="selectedStock.newCost > selectedStock.originalCost ? 'increase' : 'decrease'">
                {{ formatDifference(selectedStock.newCost - selectedStock.originalCost) }}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button class="btn-cancel" @click="showDetailsModal = false">
          <i class="pi pi-times"></i>
          <span>ปิด</span>
        </button>
      </template>
    </Dialog>

    <!-- Confirm Modal -->
    <Dialog
      v-model:visible="showConfirmModal"
      header="ยืนยันการบันทึกการเปลี่ยนแปลง"
      :style="{ width: '600px' }"
      class="confirm-dialog"
    >
      <div class="confirm-content">
        <div class="confirm-icon">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <div class="confirm-message">
          <p>คุณต้องการบันทึกการเปลี่ยนแปลงราคาทองสินค้าจำนวน <strong>{{ changedStocksCount }}</strong> รายการ ใช่หรือไม่?</p>
          <div class="confirm-summary">
            <div class="summary-item">
              <span>จำนวนสินค้าที่เปลี่ยนแปลง:</span>
              <strong>{{ changedStocksCount }} รายการ</strong>
            </div>
            <div class="summary-item">
              <span>ราคาทุนรวมเดิม:</span>
              <strong>{{ formatCurrency(totalOriginalCost) }}</strong>
            </div>
            <div class="summary-item">
              <span>ราคาทุนรวมใหม่:</span>
              <strong>{{ formatCurrency(totalNewCost) }}</strong>
            </div>
            <div class="summary-item">
              <span>ผลต่าง:</span>
              <strong :class="totalDifference > 0 ? 'increase' : totalDifference < 0 ? 'decrease' : ''">
                {{ formatDifference(totalDifference) }}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button class="btn-cancel" @click="showConfirmModal = false" :disabled="isSubmitting">
          <i class="pi pi-times"></i>
          <span>ยกเลิก</span>
        </button>
        <button class="btn-submit" @click="handleSubmit" :disabled="isSubmitting">
          <i :class="isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'"></i>
          <span>{{ isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันการบันทึก' }}</span>
        </button>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { useStockApiStore } from '@/stores/api/stock-api'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'

export default {
  name: 'MassUpdateGoldPriceView',

  components: {
    Dialog,
    Textarea,
    InputNumber
  },

  data() {
    return {
      stockApiStore: useStockApiStore(),
      toast: useToast(),
      stockNumberInput: '',
      globalGoldPrice: null,
      stocks: [],
      isSearching: false,
      isSubmitting: false,
      searchError: '',
      showDetailsModal: false,
      showConfirmModal: false,
      selectedStock: null
    }
  },

  computed: {
    totalOriginalCost() {
      // Group by stock number to avoid counting same stock multiple times
      const uniqueStocks = {}
      this.stocks.forEach(stock => {
        if (!uniqueStocks[stock.stockNumber]) {
          uniqueStocks[stock.stockNumber] = stock.originalCost || 0
        }
      })
      return Object.values(uniqueStocks).reduce((sum, cost) => sum + cost, 0)
    },

    totalNewCost() {
      // Group by stock number and get the latest newCost for each unique stock
      const uniqueStocks = {}
      this.stocks.forEach(stock => {
        uniqueStocks[stock.stockNumber] = stock.newCost || 0
      })
      return Object.values(uniqueStocks).reduce((sum, cost) => sum + cost, 0)
    },

    totalDifference() {
      return this.totalNewCost - this.totalOriginalCost
    },

    hasChanges() {
      return this.stocks.some(stock => stock.newGoldPrice !== stock.originalGoldPrice)
    },

    changedStocksCount() {
      // Count unique stocks that have changes
      const uniqueStockNumbers = new Set(
        this.stocks
          .filter(stock => stock.newGoldPrice !== stock.originalGoldPrice)
          .map(stock => stock.stockNumber)
      )
      return uniqueStockNumbers.size
    }
  },

  methods: {
    parseStockNumbers(input) {
      if (!input) return []

      // Split by comma, space, or newline
      const stockNumbers = input
        .split(/[,\s\n]+/)
        .map(num => num.trim())
        .filter(num => num.length > 0)

      return [...new Set(stockNumbers)] // Remove duplicates
    },

    clearSearchError() {
      this.searchError = ''
    },

    async handleSearch() {
      this.searchError = ''
      const stockNumbers = this.parseStockNumbers(this.stockNumberInput)

      if (stockNumbers.length === 0) {
        this.searchError = 'กรุณาใส่รหัสสินค้าอย่างน้อย 1 รายการ'
        return
      }

      this.isSearching = true
      this.stocks = []

      try {
        const results = []

        // Fetch each stock
        for (const stockNumber of stockNumbers) {
          const response = await this.stockApiStore.getStockInventory({ stockNumber })

          if (response.success && response.data) {
            // Extract gold materials and calculate original cost/price
            // Use case-insensitive comparison for type
            const goldMaterials = (response.data.materials || []).filter(m =>
              m.type && m.type.toLowerCase() === 'gold'
            )
            const otherMaterials = (response.data.materials || []).filter(m =>
              !m.type || m.type.toLowerCase() !== 'gold'
            )

            const originalCost = response.data.costSummary?.finalCost || response.data.productCost || 0

            // If product has multiple gold materials, create separate row for each
            if (goldMaterials.length > 1) {
              goldMaterials.forEach((goldMaterial, index) => {
                results.push({
                  stockNumber: response.data.stockNumber,
                  productNameTh: response.data.productNameTh,
                  productNameEn: response.data.productNameEn,
                  productTypeNameTh: response.data.productTypeNameTh,
                  productTypeNameEn: response.data.productTypeNameEn,
                  goldMaterialIndex: index, // Track which gold material this is
                  goldMaterialName: goldMaterial.itemNameTh || goldMaterial.itemNameEn || `ทอง ${index + 1}`,
                  originalCost: originalCost,
                  newCost: originalCost,
                  originalGoldPrice: goldMaterial.price || 0,
                  newGoldPrice: goldMaterial.price || 0,
                  currentGoldMaterial: goldMaterial, // The specific gold material for this row
                  allGoldMaterials: goldMaterials, // All gold materials for recalculation
                  otherMaterials: otherMaterials,
                  rawData: response.data // Keep raw data for submission
                })
              })
            } else {
              // Single gold material or no gold - create one row
              const originalGoldPrice = goldMaterials.length > 0 ? (goldMaterials[0].price || 0) : 0

              results.push({
                stockNumber: response.data.stockNumber,
                productNameTh: response.data.productNameTh,
                productNameEn: response.data.productNameEn,
                productTypeNameTh: response.data.productTypeNameTh,
                productTypeNameEn: response.data.productTypeNameEn,
                goldMaterialIndex: 0,
                goldMaterialName: null, // No need to show material name if only one
                originalCost: originalCost,
                newCost: originalCost,
                originalGoldPrice: originalGoldPrice,
                newGoldPrice: originalGoldPrice,
                currentGoldMaterial: goldMaterials[0] || null,
                allGoldMaterials: goldMaterials,
                otherMaterials: otherMaterials,
                rawData: response.data // Keep raw data for submission
              })
            }
          } else {
            console.warn(`Stock ${stockNumber} not found or error:`, response.message)
            this.toast.add({
              severity: 'warn',
              summary: 'ไม่พบข้อมูล',
              detail: `ไม่พบสินค้ารหัส: ${stockNumber}`,
              life: 3000
            })
          }
        }

        if (results.length > 0) {
          this.stocks = results
          this.toast.add({
            severity: 'success',
            summary: 'ค้นหาสำเร็จ',
            detail: `พบสินค้า ${results.length} รายการ`,
            life: 3000
          })
        } else {
          this.searchError = 'ไม่พบสินค้าที่ค้นหา'
        }
      } catch (error) {
        console.error('Error searching stocks:', error)
        this.searchError = 'เกิดข้อผิดพลาดในการค้นหา'
        this.toast.add({
          severity: 'error',
          summary: 'เกิดข้อผิดพลาด',
          detail: 'ไม่สามารถค้นหาสินค้าได้',
          life: 5000
        })
      } finally {
        this.isSearching = false
      }
    },

    handleClearSearch() {
      this.stockNumberInput = ''
      this.globalGoldPrice = null
      this.stocks = []
      this.searchError = ''
      this.showDetailsModal = false
      this.showConfirmModal = false
      this.selectedStock = null
    },

    applyGlobalGoldPrice() {
      if (!this.globalGoldPrice || this.globalGoldPrice <= 0) {
        return
      }

      this.stocks.forEach(stock => {
        stock.newGoldPrice = this.globalGoldPrice
        this.recalculateCost(stock)
      })

      this.toast.add({
        severity: 'success',
        summary: 'นำไปใช้สำเร็จ',
        detail: `ใช้ราคาทอง ${this.formatCurrency(this.globalGoldPrice)} กับทุกรายการ`,
        life: 3000
      })
    },

    handleGoldPriceChange(stock) {
      // Use $nextTick to ensure the v-model is updated before recalculating
      this.$nextTick(() => {
        console.log('handleGoldPriceChange called for:', stock.stockNumber)
        console.log('New Gold Price value:', stock.newGoldPrice)
        this.recalculateCost(stock)
      })
    },

    recalculateCost(stock) {
      if (!stock.currentGoldMaterial) {
        return
      }

      // Get all rows with the same stock number
      const sameStockRows = this.stocks.filter(s => s.stockNumber === stock.stockNumber)

      console.log('=== Recalculate Cost Debug ===')
      console.log('Stock Number:', stock.stockNumber)
      console.log('All Gold Materials:', stock.allGoldMaterials)

      // Calculate new cost for ALL gold materials
      // Use newGoldPrice from each row, fallback to original price
      let newGoldCost = 0
      stock.allGoldMaterials.forEach((material, index) => {
        const weight = material.weight || 0
        const wastePercent = material.wastePercent || 0
        const totalWeight = weight + (weight * (wastePercent / 100))

        // Find the row for this gold material index
        const rowForThisMaterial = sameStockRows.find(r => r.goldMaterialIndex === index)
        // Use newGoldPrice if available and not null/undefined, otherwise use original price
        const priceToUse = rowForThisMaterial && rowForThisMaterial.newGoldPrice != null
          ? rowForThisMaterial.newGoldPrice
          : (material.price || 0)
        const materialCost = totalWeight * priceToUse

        console.log(`Gold Material ${index}:`)
        console.log('  Weight:', weight, material.weightUnit)
        console.log('  Waste%:', wastePercent)
        console.log('  Total Weight:', totalWeight)
        console.log('  Original Price:', material.price)
        console.log('  New Price:', priceToUse)
        console.log('  Material Cost:', materialCost)
        console.log('  Original Cost from API:', material.cost)

        newGoldCost += materialCost
      })

      console.log('Total New Gold Cost:', newGoldCost)

      // Add other materials cost (unchanged)
      const otherCost = (stock.otherMaterials || []).reduce((sum, m) => sum + (m.cost || 0), 0)
      console.log('Other Materials Cost:', otherCost)

      // Calculate final cost with discount
      const costSummary = stock.rawData.costSummary || {}
      const actualCost = newGoldCost + otherCost
      const discountPercent = costSummary.discountPercent || 0
      const usedCost = actualCost
      const discountAmount = usedCost * (discountPercent / 100)
      const finalCost = usedCost - discountAmount

      console.log('Actual Cost (Gold + Other):', actualCost)
      console.log('Discount %:', discountPercent)
      console.log('Discount Amount:', discountAmount)
      console.log('Final Cost:', finalCost)
      console.log('Original Cost:', stock.originalCost)
      console.log('========================')

      const calculatedNewCost = Math.round(finalCost * 100) / 100

      // Update newCost for ALL rows with the same stock number
      sameStockRows.forEach(row => {
        row.newCost = calculatedNewCost
      })
    },

    removeStock(index) {
      this.stocks.splice(index, 1)
      this.toast.add({
        severity: 'info',
        summary: 'ลบรายการ',
        detail: 'ลบสินค้าออกจากรายการแล้ว',
        life: 2000
      })
    },

    viewStockDetails(stock) {
      this.selectedStock = stock
      this.showDetailsModal = true
    },

    async handleSubmit() {
      const changedStocks = this.stocks.filter(stock =>
        stock.newGoldPrice !== stock.originalGoldPrice
      )

      if (changedStocks.length === 0) {
        this.toast.add({
          severity: 'warn',
          summary: 'ไม่มีการเปลี่ยนแปลง',
          detail: 'ไม่มีสินค้าที่มีการเปลี่ยนแปลงราคา',
          life: 3000
        })
        return
      }

      this.isSubmitting = true

      try {
        // Group changed stocks by stockNumber (in case same stock has multiple gold materials)
        const stockGroups = {}
        changedStocks.forEach(stock => {
          if (!stockGroups[stock.stockNumber]) {
            stockGroups[stock.stockNumber] = []
          }
          stockGroups[stock.stockNumber].push(stock)
        })

        // Prepare edit payload - one per unique stock
        const editStocks = Object.keys(stockGroups).map(stockNumber => {
          const stockRows = stockGroups[stockNumber]
          const firstRow = stockRows[0]

          // Build updated materials array
          const updatedMaterials = []

          // Update ALL gold materials for this stock
          // Use new price for materials that were changed, original price for others
          firstRow.allGoldMaterials.forEach((material, index) => {
            const weight = material.weight || 0
            const wastePercent = material.wastePercent || 0
            const totalWeight = weight + (weight * (wastePercent / 100))

            // Find if this material was changed
            const changedRow = stockRows.find(r => r.goldMaterialIndex === index)
            const priceToUse = changedRow ? changedRow.newGoldPrice : (material.price || 0)
            const newCost = totalWeight * priceToUse

            updatedMaterials.push({
              type: 'gold',
              typeCode: material.itemCode,
              typeNameTh: material.itemNameTh,
              typeNameEn: material.itemNameEn,
              typeCode2: material.shapeCode,
              typeNameTh2: material.shapeNameTh,
              typeNameEn2: material.shapeNameEn,
              weight: material.weight,
              weightUnit: material.weightUnit,
              qty: material.qty,
              qtyUnit: material.qtyUnit,
              price: priceToUse,
              cost: Math.round(newCost * 100) / 100,
              description: JSON.stringify({
                wastePercent: material.wastePercent,
                labelWeight: material.labelWeight
              })
            })
          })

          // Keep other materials unchanged
          firstRow.otherMaterials.forEach(material => {
            const materialData = {
              type: material.type,
              cost: material.cost
            }

            if (material.type === 'gem') {
              materialData.typeCode = material.itemCode
              materialData.typeNameTh = material.itemNameTh
              materialData.typeNameEn = material.itemNameEn
              materialData.typeCode2 = material.shapeCode
              materialData.typeNameTh2 = material.shapeNameTh
              materialData.typeNameEn2 = material.shapeNameEn
              materialData.weight = material.weight
              materialData.weightUnit = material.weightUnit
              materialData.qty = material.qty
              materialData.qtyUnit = material.qtyUnit
              materialData.price = material.price
              materialData.size = material.size
              materialData.region = material.origin
            } else if (material.type === 'labor') {
              materialData.description = material.description
            }

            updatedMaterials.push(materialData)
          })

          // Calculate new cost summary
          const actualCost = updatedMaterials.reduce((sum, m) => sum + (m.cost || 0), 0)
          const costSummary = firstRow.rawData.costSummary || {}
          const discountPercent = costSummary.discountPercent || 0
          const usedCost = actualCost
          const discountAmount = usedCost * (discountPercent / 100)
          const finalCost = usedCost - discountAmount

          return {
            stockNumber: stockNumber,
            materials: updatedMaterials,
            productCost: Math.round(finalCost * 100) / 100,
            productCostActual: Math.round(actualCost * 100) / 100,
            productCostUesd: Math.round(usedCost * 100) / 100,
            productDiscount: discountPercent
          }
        })

        // Submit to API
        const response = await this.stockApiStore.editStockInventory({ stocks: editStocks })

        if (response.success) {
          this.toast.add({
            severity: 'success',
            summary: 'บันทึกสำเร็จ',
            detail: `อัปเดตราคาทองสินค้า ${changedStocks.length} รายการสำเร็จ`,
            life: 5000
          })

          // Clear form
          this.handleClearSearch()
          this.showConfirmModal = false
        } else {
          throw new Error(response.message || 'Failed to update stock')
        }
      } catch (error) {
        console.error('Error submitting update:', error)
        this.toast.add({
          severity: 'error',
          summary: 'เกิดข้อผิดพลาด',
          detail: 'ไม่สามารถบันทึกการเปลี่ยนแปลงได้',
          life: 5000
        })
      } finally {
        this.isSubmitting = false
      }
    },

    formatCurrency(value) {
      if (!value && value !== 0) return '฿0.00'
      return `฿${parseFloat(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },

    formatDifference(value) {
      if (value === 0) return '฿0.00'
      const sign = value > 0 ? '+' : ''
      return `${sign}${this.formatCurrency(value)}`
    },

    // Group helper methods
    isFirstInGroup(index) {
      if (index === 0) return true
      const current = this.stocks[index]
      const previous = this.stocks[index - 1]
      return current.stockNumber !== previous.stockNumber
    },

    isLastInGroup(index) {
      if (index === this.stocks.length - 1) return true
      const current = this.stocks[index]
      const next = this.stocks[index + 1]
      return current.stockNumber !== next.stockNumber
    },

    hasMultipleGoldMaterials(stockNumber) {
      return this.stocks.filter(s => s.stockNumber === stockNumber).length > 1
    },

    getGroupNumber(index) {
      // Count unique stock numbers up to this index
      const uniqueStocks = new Set()
      for (let i = 0; i <= index; i++) {
        if (this.isFirstInGroup(i)) {
          uniqueStocks.add(this.stocks[i].stockNumber)
        }
      }
      return uniqueStocks.size
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/list-page-templete/index-view.scss';

.mass-update-gold-price-page {
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
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;

  > i {
    font-size: 2.5rem;
    color: #e7de99;
  }
}

.header-text {
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  p {
    font-size: 0.9375rem;
    color: #6b7280;
    margin: 0;
  }
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-card {
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
  border-bottom: 2px solid #e7de99;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1.25rem;
    color: #e7de99;
  }
}

.search-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .info-badge {
    font-size: 0.75rem;
    font-weight: 500;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    margin-left: auto;
  }
}

.stock-number-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  :deep(.p-textarea) {
    min-height: 80px;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.9375rem;
    transition: all 0.2s;

    &:focus {
      border-color: #e7de99;
      box-shadow: 0 0 0 3px rgba(231, 222, 153, 0.1);
    }

    &.p-invalid {
      border-color: #ef4444;
    }
  }

  .help-text {
    font-size: 0.8125rem;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 0.375rem;

    i {
      color: #3b82f6;
    }
  }

  .p-error {
    color: #ef4444;
    font-size: 0.875rem;
  }
}

.search-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9375rem;

    i {
      font-size: 0.875rem;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .btn-search {
    background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
    }
  }

  .btn-clear {
    background: white;
    color: #6b7280;
    border: 2px solid #d1d5db;

    &:hover:not(:disabled) {
      background: #f3f4f6;
      border-color: #9ca3af;
    }
  }
}

.global-price-section {
  background: #faf9f0;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e7de99;
}

.global-price-input-group {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  :deep(.p-inputnumber) {
    flex: 1;

    .p-inputtext {
      width: 100%;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.9375rem;
      font-weight: 600;
      transition: all 0.2s;

      &:focus {
        border-color: #e7de99;
        box-shadow: 0 0 0 3px rgba(231, 222, 153, 0.1);
      }
    }
  }

  .btn-apply-global {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9375rem;
    white-space: nowrap;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    i {
      font-size: 0.875rem;
    }
  }
}

.stocks-table-wrapper {
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.stocks-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;

  thead {
    background: #f9fafb;

    th {
      padding: 0.875rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e7de99;
      white-space: nowrap;

      &.no-column {
        width: 60px;
        text-align: center;
      }

      &.action-column {
        width: 100px;
        text-align: center;
      }
    }
  }

  tbody {
    tr.stock-row {
      border-bottom: 1px solid #e5e7eb;
      transition: background 0.2s;

      &:hover {
        background: #f9fafb;
      }

      // Grouping styles
      &.has-group {
        border-left: 3px solid #e7de99;
        background: rgba(231, 222, 153, 0.02);

        &:hover {
          background: rgba(231, 222, 153, 0.05);
        }
      }

      &.group-first {
        border-top: 2px solid #e7de99;
      }

      &.group-last {
        border-bottom: 2px solid #e7de99;
      }

      td {
        padding: 1rem 0.875rem;
        color: #1f2937;
        vertical-align: middle;

        &.no-column {
          text-align: center;
          font-weight: 600;
          color: #6b7280;
        }

        &.cost-cell,
        &.price-cell {
          font-weight: 600;
          color: #059669;
        }

        &.new-cost-cell {
          .cost-changed {
            color: #e7de99;
            font-weight: 700;
          }

          .cost-diff {
            font-size: 0.8125rem;
            margin-top: 0.25rem;

            .increase {
              color: #dc2626;
            }

            .decrease {
              color: #059669;
            }
          }
        }

        &.action-column {
          text-align: center;
        }
      }
    }
  }
}

.stock-number-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: rgba(231, 222, 153, 0.1);
  color: #e7de99;
  border: 1px solid rgba(231, 222, 153, 0.3);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  strong {
    color: #111827;
  }

  small {
    color: #6b7280;
    font-size: 0.8125rem;
  }

  .gold-material-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.625rem;
    background: linear-gradient(135deg, rgba(231, 222, 153, 0.15) 0%, rgba(192, 171, 40, 0.1) 100%);
    color: #c0ab28;
    border: 1px solid rgba(231, 222, 153, 0.4);
    border-radius: 6px;
    font-size: 0.8125rem;
    font-weight: 600;
    margin-top: 0.375rem;
    align-self: flex-start;
    box-shadow: 0 1px 2px rgba(231, 222, 153, 0.1);

    i {
      font-size: 0.5rem;
      color: #e7de99;
    }
  }
}

:deep(.price-input .p-inputtext) {
  border: 2px solid #d1d5db;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.2s;

  &:focus {
    border-color: #e7de99;
    box-shadow: 0 0 0 3px rgba(231, 222, 153, 0.1);
  }
}

.btn-view-details,
.btn-remove-stock {
  padding: 0.375rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  margin: 0 0.25rem;

  i {
    font-size: 0.875rem;
  }
}

.btn-view-details {
  color: #3b82f6;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }
}

.btn-remove-stock {
  color: #ef4444;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
}

.summary-footer {
  background: #faf9f0;
  border-radius: 8px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  border: 1px solid #e7de99;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .summary-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .summary-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;

    &.highlight {
      color: #e7de99;
    }

    &.increase {
      color: #dc2626;
    }

    &.decrease {
      color: #059669;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9375rem;

    i {
      font-size: 0.875rem;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .btn-cancel {
    background: white;
    color: #6b7280;
    border: 2px solid #d1d5db;

    &:hover:not(:disabled) {
      background: #f3f4f6;
      border-color: #9ca3af;
    }
  }

  .btn-submit {
    background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #9ca3af;

  i {
    font-size: 4rem;
    color: #d1d5db;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
  }
}

// Dialog Styles
:deep(.stock-details-dialog),
:deep(.confirm-dialog) {
  .p-dialog-header {
    background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
    color: white;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    padding: 1.25rem 1.5rem;
  }

  .p-dialog-content {
    padding: 1.5rem;
  }

  .p-dialog-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;

    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.9375rem;

      i {
        font-size: 0.875rem;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .btn-cancel {
      background: white;
      color: #6b7280;
      border: 2px solid #d1d5db;

      &:hover:not(:disabled) {
        background: #f3f4f6;
        border-color: #9ca3af;
      }
    }

    .btn-submit {
      background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
      color: white;
      border: none;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
      }
    }
  }
}

.stock-details-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.details-section {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.25rem;
}

.details-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e7de99;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1.125rem;
    color: #e7de99;
  }
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #6b7280;
  }

  span {
    font-size: 0.9375rem;
    color: #111827;
  }
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.material-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.material-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;

  strong {
    color: #111827;
    font-size: 0.9375rem;
  }
}

.material-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;

  &.gold {
    background: rgba(231, 222, 153, 0.1);
    color: #e7de99;
    border: 1px solid rgba(231, 222, 153, 0.3);
  }

  &.gem {
    background: rgba(147, 51, 234, 0.1);
    color: #9333ea;
    border: 1px solid rgba(147, 51, 234, 0.3);
  }

  &.labor {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
}

.material-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
}

.material-detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;

  .label {
    font-weight: 600;
    color: #6b7280;
  }

  .cost-value {
    color: #059669;
    font-weight: 600;
  }
}

.cost-summary-section {
  background: linear-gradient(135deg, rgba(231, 222, 153, 0.05) 0%, rgba(192, 171, 40, 0.05) 100%);
  border: 1px solid #e7de99;
}

.cost-summary-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cost-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  font-size: 0.9375rem;

  &.total {
    background: rgba(231, 222, 153, 0.1);
    border: 1px solid #e7de99;
    font-weight: 700;
  }

  strong {
    font-weight: 700;
    font-size: 1.125rem;

    &.new-cost {
      color: #e7de99;
    }

    &.increase {
      color: #dc2626;
    }

    &.decrease {
      color: #059669;
    }
  }
}

.confirm-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
}

.confirm-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.1);

  i {
    font-size: 2.5rem;
    color: #f59e0b;
  }
}

.confirm-message {
  text-align: center;

  p {
    font-size: 1rem;
    color: #374151;
    margin: 0 0 1.5rem 0;

    strong {
      color: #e7de99;
    }
  }
}

.confirm-summary {
  background: #faf9f0;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e7de99;
  min-width: 350px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.9375rem;

  strong {
    font-weight: 700;
    color: #e7de99;
  }

  &.increase strong {
    color: #dc2626;
  }

  &.decrease strong {
    color: #059669;
  }
}

// Confirm Dialog Button Styles (specific)
:deep(.confirm-dialog .p-dialog-footer) {
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9375rem;

    i {
      font-size: 0.875rem;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &.btn-cancel {
      background: white;
      color: #6b7280;
      border: 2px solid #d1d5db;

      &:hover:not(:disabled) {
        background: #f3f4f6;
        border-color: #9ca3af;
      }
    }

    &.btn-submit {
      background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
      color: white;
      border: none;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
      }
    }
  }
}
</style>
