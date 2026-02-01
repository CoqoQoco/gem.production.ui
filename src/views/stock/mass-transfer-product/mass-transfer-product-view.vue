<template>
  <div class="mass-transfer-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <i class="pi pi-arrows-h"></i>
        <h1>{{ $t('massTransferProduct.title') || 'โอนย้ายสินค้า' }}</h1>
      </div>
      <div class="header-actions">
        <Button
          :label="$t('massTransferProduct.transfer') || 'โอนย้าย'"
          icon="pi pi-arrows-h"
          severity="primary"
          :disabled="!canTransfer || isTransferring"
          :loading="isTransferring"
          @click="confirmTransfer"
        />
        <Button
          :label="$t('massTransferProduct.clear') || 'ล้าง'"
          icon="pi pi-trash"
          severity="secondary"
          :outlined="true"
          :disabled="stockList.length === 0 || isTransferring"
          @click="clearAll"
        />
      </div>
    </div>

    <!-- Transfer Settings Section -->
    <div class="section-card">
      <div class="section-title">
        <i class="pi pi-cog"></i>
        <span>{{ $t('massTransferProduct.transferSettings') || 'ตั้งค่าการโอนย้าย' }}</span>
      </div>

      <div class="transfer-form">
        <!-- Source Branch & Storage -->
        <div class="form-group-pair">
          <div class="form-group">
            <label>{{ $t('massTransferProduct.sourceBranch') || 'สาขาต้นทาง' }} <span class="required">*</span></label>
            <AutoComplete
              v-model="sourceBranch"
              :suggestions="branchSuggestions"
              :optionLabel="branchOptionLabel"
              :dropdown="true"
              :force-selection="true"
              :complete-on-focus="true"
              :placeholder="$t('massTransferProduct.selectBranch') || 'เลือกสาขา'"
              :disabled="isTransferring"
              @complete="searchBranches"
              @item-select="onSourceBranchSelect"
            />
          </div>
          <div class="form-group">
            <label>{{ $t('massTransferProduct.sourceStorage') || 'คลังต้นทาง' }} <span class="required">*</span></label>
            <AutoComplete
              v-model="sourceStorage"
              :suggestions="sourceStorageSuggestions"
              :optionLabel="storageOptionLabel"
              :dropdown="true"
              :force-selection="true"
              :complete-on-focus="true"
              :placeholder="$t('massTransferProduct.selectStorage') || 'เลือกคลัง'"
              :disabled="!sourceBranch || isTransferring"
              @complete="searchSourceStorages"
              @item-select="onSourceStorageSelect"
            />
          </div>
        </div>

        <!-- Destination Branch & Storage -->
        <div class="form-group-pair">
          <div class="form-group">
            <label>{{ $t('massTransferProduct.destBranch') || 'สาขาปลายทาง' }} <span class="required">*</span></label>
            <AutoComplete
              v-model="destBranch"
              :suggestions="destBranchSuggestions"
              :optionLabel="branchOptionLabel"
              :dropdown="true"
              :force-selection="true"
              :complete-on-focus="true"
              :placeholder="$t('massTransferProduct.selectBranch') || 'เลือกสาขา'"
              :disabled="isTransferring"
              @complete="searchDestBranches"
              @item-select="onDestBranchSelect"
            />
          </div>
          <div class="form-group">
            <label>{{ $t('massTransferProduct.destStorage') || 'คลังปลายทาง' }} <span class="required">*</span></label>
            <AutoComplete
              v-model="destStorage"
              :suggestions="destStorageSuggestions"
              :optionLabel="storageOptionLabel"
              :dropdown="true"
              :force-selection="true"
              :complete-on-focus="true"
              :placeholder="$t('massTransferProduct.selectStorage') || 'เลือกคลัง'"
              :disabled="!destBranch || isTransferring"
              @complete="searchDestStorages"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Stock Number Input Section -->
    <div class="section-card">
      <div class="section-title">
        <i class="pi pi-list"></i>
        <span>{{ $t('massTransferProduct.stockNumbers') || 'รายเลขสินค้า' }}</span>
      </div>

      <div class="stock-input-area">
        <InputChips
          v-model="stockChips"
          :placeholder="$t('massTransferProduct.enterStock') || 'พิมพ์ Stock Number กด Enter'"
          :disabled="isTransferring"
          @add="onStockChipAdded"
        />
        <div class="stock-input-hint">
          <i class="pi pi-info-circle"></i>
          <span>{{ $t('massTransferProduct.stockInputHint') || 'กรุณาใส่ Stock Number ทีละรายการ กดEnterเพื่อเพิ่ม' }}</span>
        </div>
      </div>
    </div>

    <!-- Stock List Table -->
    <div v-if="stockList.length > 0" class="section-card">
      <div class="section-title">
        <i class="pi pi-database"></i>
        <span>{{ $t('massTransferProduct.stockList') || 'รายการสินค้า' }}</span>
        <span class="item-count">{{ stockList.length }} {{ $t('massTransferProduct.items') || 'รายการ' }}</span>
      </div>

      <!-- Summary Row -->
      <div class="stock-summary">
        <span class="summary-item">
          <i class="pi pi-list"></i>
          {{ stockList.length }} {{ $t('massTransferProduct.items') || 'รายการ' }}
        </span>
        <span class="summary-item summary-item--success">
          <i class="pi pi-check-circle"></i>
          {{ successCount }} {{ $t('massTransferProduct.success') || 'สำเร็จ' }}
        </span>
        <span v-if="errorCount > 0" class="summary-item summary-item--error">
          <i class="pi pi-exclamation-circle"></i>
          {{ errorCount }} {{ $t('massTransferProduct.failed') || 'เสียหาย' }}
        </span>
        <span v-if="pendingCount > 0" class="summary-item summary-item--pending">
          <i class="pi pi-clock"></i>
          {{ pendingCount }} {{ $t('massTransferProduct.pending') || 'รอดำเนินการ' }}
        </span>
      </div>

      <!-- Table -->
      <div class="stock-table-wrapper">
        <table class="stock-table">
          <thead>
            <tr>
              <th class="col-no">{{ $t('massTransferProduct.no') || 'ลำดับ' }}</th>
              <th class="col-stock">{{ $t('massTransferProduct.stockNumber') || 'Stock Number' }}</th>
              <th class="col-status">{{ $t('massTransferProduct.status') || 'สถานะ' }}</th>
              <th class="col-actions">{{ $t('massTransferProduct.actions') || 'การดำเนินการ' }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in stockList"
              :key="item.id"
              :class="rowClass(item)"
            >
              <td class="col-no">{{ index + 1 }}</td>
              <td class="col-stock">
                <span class="stock-number">{{ item.stockNumber }}</span>
              </td>
              <td class="col-status">
                <span :class="statusClass(item.status)" class="status-badge">
                  <i :class="statusIcon(item.status)"></i>
                  {{ statusText(item) }}
                </span>
              </td>
              <td class="col-actions">
                <button
                  v-if="item.status === 'pending' || item.status === 'error'"
                  class="action-btn action-btn--delete"
                  :title="$t('massTransferProduct.remove') || 'ลบ'"
                  @click="removeStock(item.id)"
                >
                  <i class="pi pi-times"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i class="pi pi-arrows-h empty-state__icon"></i>
      <p>{{ $t('massTransferProduct.emptyState') || 'ไม่มีรายการสินค้า กรุณาใส่ Stock Number ด้านบน' }}</p>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="confirm-overlay" @click.self="cancelConfirm">
      <div class="confirm-dialog">
        <div class="confirm-header">
          <i class="pi pi-exclamation-triangle"></i>
          <h3>{{ $t('massTransferProduct.confirmTitle') || 'ยืนยันการโอนย้าย' }}</h3>
        </div>
        <div class="confirm-body">
          <p class="confirm-text">
            {{ $t('massTransferProduct.confirmMessage') || 'คุณต้องการโอนย้ายสินค้า' }}
            <strong>{{ pendingCount }} {{ $t('massTransferProduct.items') || 'รายการ' }}</strong> ?
          </p>
          <div class="confirm-details">
            <div class="confirm-detail-row">
              <span class="confirm-label">{{ $t('massTransferProduct.from') || 'จาก' }}</span>
              <span class="confirm-value">{{ sourceBranch?.nameTh || '' }} / {{ sourceStorage?.nameTh || '' }}</span>
            </div>
            <div class="confirm-detail-row">
              <i class="pi pi-arrow-down confirm-arrow"></i>
            </div>
            <div class="confirm-detail-row">
              <span class="confirm-label">{{ $t('massTransferProduct.to') || 'ไปยัง' }}</span>
              <span class="confirm-value">{{ destBranch?.nameTh || '' }} / {{ destStorage?.nameTh || '' }}</span>
            </div>
          </div>
        </div>
        <div class="confirm-footer">
          <button class="btn-cancel" @click="cancelConfirm">
            <i class="pi pi-times"></i>
            <span>{{ $t('massTransferProduct.cancel') || 'ยกเลิก' }}</span>
          </button>
          <button class="btn-confirm" @click="executeTransfer">
            <i class="pi pi-check"></i>
            <span>{{ $t('massTransferProduct.confirmTransfer') || 'โอนย้าย' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/prime-vue/button.vue'
import AutoComplete from '@/components/prime-vue/auto-complete.vue'
import InputChips from '@/components/prime-vue/input-chips.vue'
import { useBranchApiStore } from '@/stores/api/branch-api'
import { useStorageApiStore } from '@/stores/api/storage-api'

let nextId = 1

export default {
  name: 'MassTransferProductView',

  components: {
    Button,
    AutoComplete,
    InputChips
  },

  data() {
    return {
      branchApiStore: useBranchApiStore(),
      storageApiStore: useStorageApiStore(),

      // All branches (loaded on mount)
      allBranches: [],

      // Source selection
      sourceBranch: null,
      sourceStorage: null,
      branchSuggestions: [],
      sourceStorageSuggestions: [],

      // Destination selection
      destBranch: null,
      destStorage: null,
      destBranchSuggestions: [],
      destStorageSuggestions: [],

      // Stock chips (raw input from InputChips)
      stockChips: [],

      // Stock list (processed items for table)
      stockList: [],

      // State
      isTransferring: false,
      showConfirmDialog: false
    }
  },

  computed: {
    canTransfer() {
      return (
        this.sourceBranch &&
        this.sourceStorage &&
        this.destBranch &&
        this.destStorage &&
        this.pendingCount > 0 &&
        // Source and destination must be different
        !(this.sourceBranch.branchId === this.destBranch.branchId && this.sourceStorage.storageId === this.destStorage.storageId)
      )
    },

    pendingCount() {
      return this.stockList.filter((item) => item.status === 'pending').length
    },

    successCount() {
      return this.stockList.filter((item) => item.status === 'success').length
    },

    errorCount() {
      return this.stockList.filter((item) => item.status === 'error').length
    }
  },

  async mounted() {
    await this.loadBranches()
  },

  methods: {
    // --- Option Labels ---
    branchOptionLabel(item) {
      if (!item) return ''
      return `${item.nameTh} (${item.nameEn})`
    },

    storageOptionLabel(item) {
      if (!item) return ''
      return `${item.code} - ${item.nameTh}`
    },

    // --- Branch Loading ---
    async loadBranches() {
      const result = await this.branchApiStore.listBranches({
        pageIndex: 0,
        pageSize: 1000,
        criteria: { searchText: null }
      })
      if (result.success) {
        this.allBranches = result.data
      }
    },

    // --- Source Branch & Storage ---
    searchBranches(event) {
      const query = event.query?.toLowerCase().trim() || ''
      this.branchSuggestions = query
        ? this.allBranches.filter(
            (b) =>
              b.nameTh.toLowerCase().includes(query) ||
              b.nameEn.toLowerCase().includes(query)
          )
        : [...this.allBranches]
    },

    async onSourceBranchSelect() {
      // Reset source storage when branch changes
      this.sourceStorage = null
      this.sourceStorageSuggestions = []
      if (this.sourceBranch) {
        await this.loadSourceStorages()
      }
    },

    async loadSourceStorages() {
      const result = await this.storageApiStore.listStorages({
        branchId: this.sourceBranch.branchId
      })
      if (result.success) {
        this.sourceStorageSuggestions = result.data
      }
    },

    searchSourceStorages(event) {
      const query = event.query?.toLowerCase().trim() || ''
      if (!this.sourceBranch) return

      this.storageApiStore.listStorages({
        branchId: this.sourceBranch.branchId,
        searchText: query || null
      }).then((result) => {
        if (result.success) {
          this.sourceStorageSuggestions = result.data
        }
      })
    },

    // --- Destination Branch & Storage ---
    searchDestBranches(event) {
      const query = event.query?.toLowerCase().trim() || ''
      this.destBranchSuggestions = query
        ? this.allBranches.filter(
            (b) =>
              b.nameTh.toLowerCase().includes(query) ||
              b.nameEn.toLowerCase().includes(query)
          )
        : [...this.allBranches]
    },

    async onDestBranchSelect() {
      // Reset destination storage when branch changes
      this.destStorage = null
      this.destStorageSuggestions = []
      if (this.destBranch) {
        await this.loadDestStorages()
      }
    },

    async loadDestStorages() {
      const result = await this.storageApiStore.listStorages({
        branchId: this.destBranch.branchId
      })
      if (result.success) {
        this.destStorageSuggestions = result.data
      }
    },

    searchDestStorages(event) {
      const query = event.query?.toLowerCase().trim() || ''
      if (!this.destBranch) return

      this.storageApiStore.listStorages({
        branchId: this.destBranch.branchId,
        searchText: query || null
      }).then((result) => {
        if (result.success) {
          this.destStorageSuggestions = result.data
        }
      })
    },

    // --- Stock Number Handling ---
    onStockChipAdded(event) {
      // When a chip is added via InputChips, add it to stockList
      const newChip = event.value
      if (newChip) {
        const stockNumber = newChip.toUpperCase().trim()
        if (stockNumber && !this.isDuplicateStock(stockNumber)) {
          this.stockList.push({
            id: nextId++,
            stockNumber: stockNumber,
            status: 'pending', // pending | transferring | success | error
            errorMessage: ''
          })
        }
      }
    },

    isDuplicateStock(stockNumber) {
      return this.stockList.some((item) => item.stockNumber === stockNumber)
    },

    removeStock(id) {
      const index = this.stockList.findIndex((item) => item.id === id)
      if (index !== -1) {
        const item = this.stockList[index]
        // Also remove from chips if still there
        this.stockChips = this.stockChips.filter((c) => c !== item.stockNumber)
        this.stockList.splice(index, 1)
      }
    },

    clearAll() {
      this.stockList = []
      this.stockChips = []
    },

    // --- Transfer Flow ---
    confirmTransfer() {
      if (!this.canTransfer) return
      this.showConfirmDialog = true
    },

    cancelConfirm() {
      this.showConfirmDialog = false
    },

    async executeTransfer() {
      this.showConfirmDialog = false
      this.isTransferring = true

      // Get only pending items
      const pendingItems = this.stockList.filter((item) => item.status === 'pending')

      // Sequential transfer (simulated — replace with real API when available)
      for (const item of pendingItems) {
        item.status = 'transferring'
        item.errorMessage = ''

        try {
          // Simulate transfer API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Mock: treat stock numbers starting with 'ERR' as errors for testing
          if (item.stockNumber.startsWith('ERR')) {
            throw new Error('สินค้าไม่พบในคลัง')
          }

          item.status = 'success'
        } catch (error) {
          item.status = 'error'
          item.errorMessage = error.message || 'เกิดข้อผิดพลาด'
        }
      }

      this.isTransferring = false
    },

    // --- Status Display ---
    statusText(item) {
      switch (item.status) {
        case 'pending':
          return this.$t('massTransferProduct.statusPending') || 'รอดำเนินการ'
        case 'transferring':
          return this.$t('massTransferProduct.statusTransferring') || 'กำลังโอน...'
        case 'success':
          return this.$t('massTransferProduct.statusSuccess') || 'สำเร็จ'
        case 'error':
          return item.errorMessage || this.$t('massTransferProduct.statusError') || 'เสียหาย'
        default:
          return ''
      }
    },

    statusClass(status) {
      switch (status) {
        case 'pending':
          return 'status-badge--pending'
        case 'transferring':
          return 'status-badge--transferring'
        case 'success':
          return 'status-badge--success'
        case 'error':
          return 'status-badge--error'
        default:
          return ''
      }
    },

    statusIcon(status) {
      switch (status) {
        case 'pending':
          return 'pi pi-clock'
        case 'transferring':
          return 'pi pi-spinner pi-spin'
        case 'success':
          return 'pi pi-check'
        case 'error':
          return 'pi pi-exclamation-circle'
        default:
          return ''
      }
    },

    rowClass(item) {
      return {
        'row--success': item.status === 'success',
        'row--error': item.status === 'error',
        'row--transferring': item.status === 'transferring'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// --- Page Layout ---
.mass-transfer-page {
  padding: 1rem;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

// --- Page Header ---
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      font-size: 1.125rem;
      color: #e7de99;
    }

    h1 {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
  }
}

// --- Section Card ---
.section-card {
  background: white;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

// --- Section Title ---
.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.625rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e7de99;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 0.875rem;
    color: #e7de99;
  }

  .item-count {
    margin-left: auto;
    font-size: 0.6875rem;
    font-weight: 500;
    color: #6b7280;
    background: #f3f4f6;
    padding: 0.125rem 0.5rem;
    border-radius: 10px;
  }
}

// --- Transfer Form ---
.transfer-form {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.form-group-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;

    .required {
      color: #ef4444;
    }
  }
}

// --- Stock Input Area ---
.stock-input-area {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.stock-input-hint {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  color: #9ca3af;

  i {
    font-size: 0.6875rem;
    color: #e7de99;
  }
}

// --- Stock Summary ---
.stock-summary {
  display: flex;
  gap: 0.75rem;
  padding: 0.375rem 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 0.625rem;
  flex-wrap: wrap;

  .summary-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.6875rem;
    color: #6b7280;
    font-weight: 500;

    i {
      font-size: 0.6875rem;
    }

    &--success {
      color: #16a34a;

      i {
        color: #16a34a;
      }
    }

    &--error {
      color: #ef4444;

      i {
        color: #ef4444;
      }
    }

    &--pending {
      color: #6b7280;

      i {
        color: #9ca3af;
      }
    }
  }
}

// --- Stock Table ---
.stock-table-wrapper {
  overflow-x: auto;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f9fafb;
    border-bottom: 2px solid #e7de99;

    th {
      font-size: 0.6875rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      padding: 0.5rem 0.625rem;
      text-align: left;
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f3f4f6;
      transition: background 0.15s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #fafafa;
      }

      &.row--success {
        background: rgba(34, 197, 94, 0.04);
      }

      &.row--error {
        background: rgba(239, 68, 68, 0.04);
      }

      &.row--transferring {
        background: rgba(231, 222, 153, 0.08);
      }
    }

    td {
      padding: 0.5rem 0.625rem;
      font-size: 0.75rem;
      color: #374151;
      vertical-align: middle;
    }
  }

  // Column widths
  .col-no {
    width: 48px;
    text-align: center;
    color: #9ca3af;
    font-weight: 600;
  }

  .col-stock {
    flex: 1;
  }

  .col-status {
    width: 140px;
  }

  .col-actions {
    width: 48px;
    text-align: center;
  }
}

// --- Stock Number Display ---
.stock-number {
  font-weight: 600;
  letter-spacing: 0.025em;
  color: #374151;
  font-size: 0.75rem;
}

// --- Status Badge ---
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  white-space: nowrap;

  i {
    font-size: 0.6875rem;
  }

  &--pending {
    background: #f3f4f6;
    color: #6b7280;
  }

  &--transferring {
    background: rgba(231, 222, 153, 0.15);
    color: #c0ab28;
  }

  &--success {
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
  }

  &--error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// --- Action Buttons ---
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  background: transparent;
  margin: 0 auto;

  i {
    font-size: 0.6875rem;
  }

  &--delete {
    color: #9ca3af;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  }
}

// --- Empty State ---
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &__icon {
    font-size: 2.5rem;
    color: #e5e7eb;
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.8125rem;
    color: #9ca3af;
    margin: 0;
  }
}

// --- Confirmation Dialog ---
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-dialog {
  background: white;
  border-radius: 12px;
  width: 420px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.confirm-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 1.25rem 0.75rem;

  i {
    font-size: 1.25rem;
    color: #e7de99;
  }

  h3 {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
}

.confirm-body {
  padding: 0 1.25rem 0.75rem;

  .confirm-text {
    font-size: 0.8125rem;
    color: #374151;
    margin: 0 0 0.75rem;
    line-height: 1.5;
  }
}

.confirm-details {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.confirm-detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;

  .confirm-label {
    color: #6b7280;
    font-weight: 600;
    min-width: 40px;
  }

  .confirm-value {
    color: #374151;
    font-weight: 500;
  }

  .confirm-arrow {
    font-size: 0.75rem;
    color: #e7de99;
    margin-left: 0.25rem;
  }
}

.confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem 1rem;
  border-top: 1px solid #f3f4f6;

  .btn-cancel {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.875rem;
    height: 30px;
    background: white;
    color: #6b7280;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    i {
      font-size: 0.6875rem;
    }

    &:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }
  }

  .btn-confirm {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.875rem;
    height: 30px;
    background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%);
    color: #1f2937;
    border: none;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    i {
      font-size: 0.6875rem;
    }

    &:hover {
      background: linear-gradient(135deg, #dfd070 0%, #dfd070 100%);
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(231, 222, 153, 0.3);
    }
  }
}

// --- Responsive ---
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.625rem;
  }

  .stock-table {
    font-size: 0.6875rem;

    thead th,
    tbody td {
      padding: 0.375rem 0.25rem;
    }

    .col-stock {
      word-break: break-all;
    }
  }
}
</style>
