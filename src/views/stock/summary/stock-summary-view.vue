<template>
  <div class="stock-summary-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <i class="pi pi-chart-bar"></i>
          <div class="header-text">
            <h1>{{ $t('stockSummary.title') || 'ภาพรวม Stock' }}</h1>
            <p>{{ $t('stockSummary.subtitle') || 'สรุปข้อมูลสินค้าคงคลังตามสาขา ประเภทสินค้า และประเภททอง' }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-view-toggle" @click="toggleViewMode">
            <i :class="viewMode === 'chart' ? 'pi pi-table' : 'pi pi-chart-bar'"></i>
            <span>{{ viewMode === 'chart' ? ($t('stockSummary.tableView') || 'ตาราง') : ($t('stockSummary.chartView') || 'กราฟ') }}</span>
          </button>
          <button class="btn-refresh" @click="loadSummary" :disabled="isLoading">
            <i :class="isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"></i>
            <span>{{ $t('common.refresh') || 'รีเฟรช' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Page Content -->
    <div class="page-content">
      <!-- Loading State -->
      <div v-if="isLoading && !branches.length" class="loading-state">
        <i class="pi pi-spin pi-spinner"></i>
        <p>{{ $t('common.loading') || 'กำลังโหลดข้อมูล...' }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && !branches.length" class="empty-state">
        <i class="pi pi-inbox"></i>
        <p>{{ $t('stockSummary.noData') || 'ไม่มีข้อมูลสรุป' }}</p>
      </div>

      <!-- Chart View -->
      <div v-else-if="viewMode === 'chart'" class="charts-container">
        <!-- Overall Summary Charts -->
        <div class="overview-charts">
          <div class="chart-wrapper">
            <BarChart
              :labels="branchChartData.labels"
              :datasets="branchChartData.datasets"
              :title="$t('stockSummary.weightByBranch') || 'น้ำหนักตามสาขา'"
              :subtitle="$t('stockSummary.totalWeightComparison') || 'เปรียบเทียบน้ำหนักรวมแต่ละสาขา'"
              height="350px"
            />
          </div>

          <div class="chart-wrapper">
            <DoughnutChart
              :labels="branchChartData.labels"
              :data="branchChartData.totals"
              :title="$t('stockSummary.branchDistribution') || 'สัดส่วนตามสาขา'"
              :subtitle="$t('stockSummary.percentageByBranch') || 'เปอร์เซ็นต์แยกตามสาขา'"
              height="350px"
            />
          </div>
        </div>

        <!-- Branch Details Charts -->
        <div v-for="branch in branches" :key="branch.branchId" class="branch-chart-card">
          <div class="branch-header" @click="toggleBranch(branch.branchId)">
            <div class="branch-info">
              <i class="pi pi-building"></i>
              <h2>{{ branch.branchNameTh }}</h2>
              <span class="branch-id">#{{ branch.branchId }}</span>
            </div>
            <button
              class="btn-toggle"
              :class="{ active: expandedBranches.includes(branch.branchId) }"
            >
              <i :class="expandedBranches.includes(branch.branchId) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
            </button>
          </div>

          <div v-show="expandedBranches.includes(branch.branchId)" class="branch-charts">
            <div class="branch-chart-grid">
              <div class="chart-wrapper">
                <BarChart
                  :labels="getBranchProductTypeLabels(branch)"
                  :datasets="getBranchProductTypeDatasets(branch)"
                  :title="$t('stockSummary.weightByProductType') || 'น้ำหนักตามประเภทสินค้า'"
                  height="300px"
                  :stacked="true"
                />
              </div>

              <div class="chart-wrapper">
                <PieChart
                  :labels="getBranchGoldTypeLabels(branch)"
                  :data="getBranchGoldTypeData(branch)"
                  :title="$t('stockSummary.goldTypeDistribution') || 'สัดส่วนประเภททอง'"
                  height="300px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div v-else class="summary-container">
        <!-- Branch Cards -->
        <div v-for="branch in branches" :key="branch.branchId" class="branch-card">
          <div class="branch-header">
            <div class="branch-info">
              <i class="pi pi-building"></i>
              <h2>{{ branch.branchNameTh }}</h2>
              <span class="branch-id">#{{ branch.branchId }}</span>
            </div>
            <button
              class="btn-toggle"
              @click="toggleBranch(branch.branchId)"
              :class="{ active: expandedBranches.includes(branch.branchId) }"
            >
              <i :class="expandedBranches.includes(branch.branchId) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
            </button>
          </div>

          <!-- Product Types (collapsed/expanded) -->
          <div v-show="expandedBranches.includes(branch.branchId)" class="branch-content">
            <div v-if="!branch.productTypes || branch.productTypes.length === 0" class="no-data-message">
              <i class="pi pi-info-circle"></i>
              <span>{{ $t('stockSummary.noProductTypes') || 'ไม่มีข้อมูลประเภทสินค้า' }}</span>
            </div>

            <div v-else>
              <div v-for="productType in branch.productTypes" :key="productType.productTypeCode" class="product-type-section">
                <div class="product-type-header">
                  <i class="pi pi-tag"></i>
                  <h3>{{ productType.productTypeNameTh }}</h3>
                  <span class="product-type-code">{{ productType.productTypeCode }}</span>
                </div>

                <!-- Gold Types -->
                <div v-if="!productType.goldTypes || productType.goldTypes.length === 0" class="no-data-message small">
                  <i class="pi pi-info-circle"></i>
                  <span>{{ $t('stockSummary.noGoldTypes') || 'ไม่มีข้อมูลประเภททอง' }}</span>
                </div>

                <div v-else class="gold-types-grid">
                  <div v-for="goldType in productType.goldTypes" :key="goldType.typeCode" class="gold-type-card">
                    <div class="gold-type-header">
                      <i class="pi pi-circle-fill"></i>
                      <h4>{{ goldType.typeNameTh }}</h4>
                    </div>

                    <!-- Karats Table -->
                    <div v-if="!goldType.goldKarats || goldType.goldKarats.length === 0" class="no-data-message small">
                      <span>{{ $t('stockSummary.noKarats') || 'ไม่มีข้อมูล' }}</span>
                    </div>

                    <div v-else class="karats-table">
                      <div v-for="karat in goldType.goldKarats" :key="karat.typeCode2" class="karat-row">
                        <div class="karat-info">
                          <span class="karat-badge">{{ karat.typeNameTh2 }}</span>
                          <span class="karat-code">{{ karat.typeCode2 }}</span>
                        </div>
                        <div class="karat-weight">
                          <span class="weight-value">{{ formatWeight(karat.totalWeight) }}</span>
                          <span class="weight-unit">{{ $t('common.gram') || 'g' }}</span>
                        </div>
                      </div>

                      <!-- Total for this gold type -->
                      <div class="karat-row total-row">
                        <div class="karat-info">
                          <strong>{{ $t('stockSummary.total') || 'รวม' }}</strong>
                        </div>
                        <div class="karat-weight">
                          <strong class="weight-value">{{ formatWeight(calculateGoldTypeTotal(goldType)) }}</strong>
                          <span class="weight-unit">{{ $t('common.gram') || 'g' }}</span>
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
    </div>

    <!-- Toast -->
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
@import '@/assets/styles/components/list-page-templete/index-view.scss';

.stock-summary-page {
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
  margin-bottom: 1.5rem;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-view-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  color: #111827;
  border: 2px solid #e7de99;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9375rem;

  &:hover {
    background: rgba(231, 222, 153, 0.1);
    border-color: #c0ab28;
    transform: translateY(-1px);
  }

  i {
    font-size: 0.875rem;
    color: #e7de99;
  }
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9375rem;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  i {
    font-size: 0.875rem;
  }
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.loading-state i {
  color: #e7de99;
}

.summary-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.branch-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

.branch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
  }
}

.branch-info {
  display: flex;
  align-items: center;
  gap: 1rem;

  i {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }

  .branch-id {
    font-size: 0.875rem;
    opacity: 0.9;
  }
}

.btn-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &.active {
    transform: rotate(180deg);
  }

  i {
    font-size: 1rem;
  }
}

.branch-content {
  padding: 1.5rem;
}

.product-type-section {
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.product-type-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e7de99;

  i {
    font-size: 1.125rem;
    color: #e7de99;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .product-type-code {
    font-size: 0.875rem;
    padding: 0.25rem 0.75rem;
    background: rgba(231, 222, 153, 0.1);
    color: #e7de99;
    border: 1px solid rgba(231, 222, 153, 0.3);
    border-radius: 6px;
    font-weight: 600;
  }
}

.gold-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.gold-type-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.gold-type-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;

  i {
    font-size: 0.75rem;
    color: #e7de99;
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
}

.karats-table {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.karat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;

  &:hover:not(.total-row) {
    background: #fafafa;
    border-color: #e7de99;
  }

  &.total-row {
    background: rgba(231, 222, 153, 0.1);
    border-color: #e7de99;
    border-width: 2px;
    margin-top: 0.5rem;
  }
}

.karat-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .karat-badge {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
  }

  .karat-code {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    background: #e5e7eb;
    color: #6b7280;
    border-radius: 4px;
  }

  strong {
    font-size: 0.9375rem;
    color: #e7de99;
  }
}

.karat-weight {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;

  .weight-value {
    font-size: 1rem;
    font-weight: 600;
    color: #059669;
  }

  .weight-unit {
    font-size: 0.75rem;
    color: #6b7280;
  }

  strong.weight-value {
    color: #e7de99;
    font-size: 1.125rem;
  }
}

.no-data-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  color: #9ca3af;
  font-size: 0.9375rem;

  &.small {
    padding: 1rem;
    font-size: 0.875rem;
  }

  i {
    color: #d1d5db;
    font-size: 1rem;
  }
}

// Chart View Styles
.charts-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.overview-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.chart-wrapper {
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.branch-chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .branch-header {
    cursor: pointer;
  }
}

.branch-charts {
  padding: 1.5rem;
  background: #fafafa;
}

.branch-chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}
</style>
