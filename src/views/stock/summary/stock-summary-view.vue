<template>
  <div class="stock-summary-page">
    <!-- Compact Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <i class="pi pi-chart-bar"></i>
          <div class="header-text">
            <h1>{{ $t('stockSummary.title') || 'ภาพรวม Stock' }}</h1>
            <p>{{ $t('stockSummary.subtitle') || 'สรุปข้อมูลสินค้าคงคลังตามสาขา' }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-view-toggle" @click="toggleViewMode">
            <i :class="viewMode === 'chart' ? 'pi pi-table' : 'pi pi-chart-bar'"></i>
            <span>{{ viewMode === 'chart' ? 'ตาราง' : 'กราฟ' }}</span>
          </button>
          <button class="btn-refresh" @click="loadSummary" :disabled="isLoading">
            <i :class="isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Page Content -->
    <div class="page-content">
      <!-- Loading State -->
      <div v-if="isLoading && !branches.length" class="loading-state">
        <i class="pi pi-spin pi-spinner"></i>
        <p>กำลังโหลด...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && !branches.length" class="empty-state">
        <i class="pi pi-inbox"></i>
        <p>ไม่มีข้อมูลสรุป</p>
      </div>

      <!-- Chart View -->
      <div v-else-if="viewMode === 'chart'" class="charts-container">
        <!-- Overview Charts Row -->
        <div class="overview-charts">
          <div class="chart-wrapper">
            <BarChart
              :labels="branchChartData.labels"
              :datasets="branchChartData.datasets"
              :title="'น้ำหนักตามสาขา'"
              height="280px"
            />
          </div>
          <div class="chart-wrapper">
            <DoughnutChart
              :labels="branchChartData.labels"
              :data="branchChartData.totals"
              :title="'สัดส่วนตามสาขา'"
              height="280px"
            />
          </div>
        </div>

        <!-- Branch Details -->
        <div v-for="branch in branches" :key="branch.branchId" class="branch-chart-card">
          <div class="branch-header" @click="toggleBranch(branch.branchId)">
            <div class="branch-info">
              <i class="pi pi-building"></i>
              <h2>{{ branch.branchNameTh }}</h2>
              <span class="branch-total">{{ formatWeight(calculateBranchTotal(branch)) }} g</span>
            </div>
            <i :class="expandedBranches.includes(branch.branchId) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="toggle-icon"></i>
          </div>

          <div v-show="expandedBranches.includes(branch.branchId)" class="branch-charts">
            <div class="branch-chart-grid">
              <div class="chart-wrapper compact">
                <BarChart
                  :labels="getBranchProductTypeLabels(branch)"
                  :datasets="getBranchProductTypeDatasets(branch)"
                  :title="'น้ำหนักตามประเภท'"
                  height="240px"
                  :stacked="true"
                />
              </div>
              <div class="chart-wrapper compact">
                <PieChart
                  :labels="getBranchGoldTypeLabels(branch)"
                  :data="getBranchGoldTypeData(branch)"
                  :title="'สัดส่วนทอง'"
                  height="240px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div v-else class="summary-container">
        <div v-for="branch in branches" :key="branch.branchId" class="branch-card">
          <div class="branch-header" @click="toggleBranch(branch.branchId)">
            <div class="branch-info">
              <i class="pi pi-building"></i>
              <h2>{{ branch.branchNameTh }}</h2>
              <span class="branch-total">{{ formatWeight(calculateBranchTotal(branch)) }} g</span>
            </div>
            <i :class="expandedBranches.includes(branch.branchId) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="toggle-icon"></i>
          </div>

          <div v-show="expandedBranches.includes(branch.branchId)" class="branch-content">
            <div v-if="!branch.productTypes || branch.productTypes.length === 0" class="no-data-message">
              <span>ไม่มีข้อมูลประเภทสินค้า</span>
            </div>

            <div v-else class="product-types-wrapper">
              <div v-for="productType in branch.productTypes" :key="productType.productTypeCode" class="product-type-section">
                <div class="product-type-header">
                  <span class="product-type-name">{{ productType.productTypeNameTh }}</span>
                  <span class="product-type-code">{{ productType.productTypeCode }}</span>
                </div>

                <div v-if="!productType.goldTypes || productType.goldTypes.length === 0" class="no-data-inline">
                  ไม่มีข้อมูลประเภททอง
                </div>

                <div v-else class="gold-types-grid">
                  <div v-for="goldType in productType.goldTypes" :key="goldType.typeCode" class="gold-type-card">
                    <div class="gold-type-header">
                      <span class="gold-dot"></span>
                      <span>{{ goldType.typeNameTh }}</span>
                      <span class="gold-total">{{ formatWeight(calculateGoldTypeTotal(goldType)) }} g</span>
                    </div>

                    <div v-if="goldType.goldKarats && goldType.goldKarats.length > 0" class="karats-list">
                      <div v-for="karat in goldType.goldKarats" :key="karat.typeCode2" class="karat-row">
                        <span class="karat-name">{{ karat.typeNameTh2 }}</span>
                        <span class="karat-weight">{{ formatWeight(karat.totalWeight) }} g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script>
import { useStockApiStore } from '@/stores/api/stock-api'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'

export default {
  name: 'StockSummaryView',

  components: {
    Toast,
    BarChart,
    PieChart,
    DoughnutChart
  },

  data() {
    return {
      stockApiStore: useStockApiStore(),
      toast: null,
      branches: [],
      isLoading: false,
      expandedBranches: [], // Track which branches are expanded
      viewMode: 'chart' // 'chart' or 'table'
    }
  },

  computed: {
    // Branch-level chart data (all branches comparison)
    branchChartData() {
      const labels = this.branches.map(b => b.branchNameTh)
      const totals = this.branches.map(b => this.calculateBranchTotal(b))

      return {
        labels,
        totals,
        datasets: [{
          label: this.$t('stockSummary.totalWeight') || 'น้ำหนักรวม',
          data: totals,
          backgroundColor: 'rgba(231, 222, 153, 0.8)',
          borderColor: 'rgba(231, 222, 153, 1)',
          borderWidth: 2
        }]
      }
    }
  },

  mounted() {
    this.toast = useToast()
    this.loadSummary()
  },

  methods: {
    async loadSummary() {
      this.isLoading = true

      try {
        const response = await this.stockApiStore.getSummary()

        if (response.success) {
          this.branches = response.data || []
          // Expand all branches by default
          this.expandedBranches = this.branches.map(b => b.branchId)

          if (this.branches.length === 0) {
            this.toast.add({
              severity: 'info',
              summary: this.$t('common.info') || 'แจ้งเตือน',
              detail: this.$t('stockSummary.noData') || 'ไม่มีข้อมูลสรุป',
              life: 3000
            })
          }
        } else {
          this.showError(response.message || this.$t('stockSummary.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
        }
      } catch (error) {
        console.error('Error loading summary:', error)
        this.showError(error.message || this.$t('stockSummary.loadError') || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
      } finally {
        this.isLoading = false
      }
    },

    toggleBranch(branchId) {
      const index = this.expandedBranches.indexOf(branchId)
      if (index > -1) {
        this.expandedBranches.splice(index, 1)
      } else {
        this.expandedBranches.push(branchId)
      }
    },

    toggleViewMode() {
      this.viewMode = this.viewMode === 'chart' ? 'table' : 'chart'
    },

    calculateBranchTotal(branch) {
      if (!branch.productTypes || branch.productTypes.length === 0) return 0

      return branch.productTypes.reduce((branchSum, productType) => {
        if (!productType.goldTypes || productType.goldTypes.length === 0) return branchSum

        const productTypeTotal = productType.goldTypes.reduce((typeSum, goldType) => {
          return typeSum + this.calculateGoldTypeTotal(goldType)
        }, 0)

        return branchSum + productTypeTotal
      }, 0)
    },

    calculateGoldTypeTotal(goldType) {
      if (!goldType.goldKarats || goldType.goldKarats.length === 0) return 0
      return goldType.goldKarats.reduce((sum, karat) => sum + (karat.totalWeight || 0), 0)
    },

    // Get product type labels for a specific branch
    getBranchProductTypeLabels(branch) {
      if (!branch.productTypes) return []
      return branch.productTypes.map(pt => pt.productTypeNameTh)
    },

    // Get product type datasets for a specific branch (stacked by gold type)
    getBranchProductTypeDatasets(branch) {
      if (!branch.productTypes) return []

      // Collect all unique gold type names across all product types
      const goldTypeNames = new Set()
      branch.productTypes.forEach(pt => {
        if (pt.goldTypes) {
          pt.goldTypes.forEach(gt => goldTypeNames.add(gt.typeNameTh))
        }
      })

      const goldTypeArray = Array.from(goldTypeNames)
      const colors = [
        'rgba(231, 222, 153, 0.8)', // Gold
        'rgba(59, 130, 246, 0.8)',  // Blue
        'rgba(16, 185, 129, 0.8)',  // Green
        'rgba(239, 68, 68, 0.8)',   // Red
        'rgba(147, 51, 234, 0.8)',  // Purple
        'rgba(245, 158, 11, 0.8)',  // Orange
        'rgba(6, 182, 212, 0.8)',   // Cyan
        'rgba(236, 72, 153, 0.8)'   // Pink
      ]

      return goldTypeArray.map((goldTypeName, index) => {
        const data = branch.productTypes.map(pt => {
          const goldType = pt.goldTypes?.find(gt => gt.typeNameTh === goldTypeName)
          return goldType ? this.calculateGoldTypeTotal(goldType) : 0
        })

        return {
          label: goldTypeName,
          data: data,
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length].replace('0.8', '1'),
          borderWidth: 2
        }
      })
    },

    // Get gold type labels for a branch (aggregated across all product types)
    getBranchGoldTypeLabels(branch) {
      if (!branch.productTypes) return []

      const goldTypeNames = new Set()
      branch.productTypes.forEach(pt => {
        if (pt.goldTypes) {
          pt.goldTypes.forEach(gt => goldTypeNames.add(gt.typeNameTh))
        }
      })

      return Array.from(goldTypeNames)
    },

    // Get gold type data for a branch (aggregated totals)
    getBranchGoldTypeData(branch) {
      if (!branch.productTypes) return []

      const goldTypeMap = new Map()

      branch.productTypes.forEach(pt => {
        if (pt.goldTypes) {
          pt.goldTypes.forEach(gt => {
            const currentTotal = goldTypeMap.get(gt.typeNameTh) || 0
            goldTypeMap.set(gt.typeNameTh, currentTotal + this.calculateGoldTypeTotal(gt))
          })
        }
      })

      return Array.from(goldTypeMap.values())
    },

    formatWeight(weight) {
      if (!weight && weight !== 0) return '0.00'
      return parseFloat(weight).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },

    showError(message) {
      this.toast.add({
        severity: 'error',
        summary: this.$t('common.error') || 'ผิดพลาด',
        detail: message,
        life: 5000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.stock-summary-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 0.75rem;
}

// Compact Header
.page-header {
  background: white;
  border-radius: 10px;
  padding: 0.875rem 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.625rem;

  > i {
    font-size: 1.5rem;
    color: #e7de99;
  }
}

.header-text {
  h1 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
    line-height: 1.2;
  }

  p {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-view-toggle {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: white;
  color: #374151;
  border: 1.5px solid #e7de99;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(231, 222, 153, 0.15);
  }

  i {
    font-size: 0.875rem;
    color: #c0ab28;
  }
}

.btn-refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(231, 222, 153, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  i {
    font-size: 0.9375rem;
  }
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

// Compact Loading & Empty States
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);

  i {
    font-size: 2rem;
    color: #d1d5db;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
}

.loading-state i {
  color: #e7de99;
}

// Charts Container
.charts-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.overview-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.chart-wrapper {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  &.compact {
    border-radius: 8px;
  }
}

// Branch Cards (Both Views)
.summary-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.branch-card,
.branch-chart-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.branch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
  color: white;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: linear-gradient(135deg, #d4cb8a 0%, #a89420 100%);
  }
}

.branch-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1rem;
  }

  h2 {
    font-size: 0.9375rem;
    font-weight: 700;
    margin: 0;
  }

  .branch-total {
    font-size: 0.75rem;
    background: rgba(255, 255, 255, 0.25);
    padding: 0.1875rem 0.5rem;
    border-radius: 4px;
    font-weight: 600;
  }
}

.toggle-icon {
  font-size: 0.75rem;
  opacity: 0.9;
  transition: transform 0.2s;
}

// Branch Content (Table View)
.branch-content {
  padding: 0.75rem;
}

.product-types-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-type-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.product-type-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;

  .product-type-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
  }

  .product-type-code {
    font-size: 0.6875rem;
    padding: 0.125rem 0.375rem;
    background: rgba(231, 222, 153, 0.2);
    color: #91801e;
    border-radius: 4px;
    font-weight: 600;
  }
}

.no-data-inline {
  padding: 0.625rem 0.75rem;
  font-size: 0.8125rem;
  color: #9ca3af;
  text-align: center;
}

.no-data-message {
  padding: 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.8125rem;
}

// Gold Types Grid
.gold-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.5rem;
  padding: 0.5rem;
}

.gold-type-card {
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.gold-type-header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.625rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;

  .gold-dot {
    width: 6px;
    height: 6px;
    background: #e7de99;
    border-radius: 50%;
  }

  .gold-total {
    margin-left: auto;
    font-size: 0.75rem;
    color: #059669;
    font-weight: 700;
  }
}

.karats-list {
  padding: 0.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.karat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0.5rem;
  background: white;
  border-radius: 4px;
  font-size: 0.8125rem;

  .karat-name {
    color: #374151;
  }

  .karat-weight {
    font-weight: 600;
    color: #059669;
  }
}

// Branch Charts (Chart View)
.branch-charts {
  padding: 0.5rem;
  background: #fafafa;
}

.branch-chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}
</style>
