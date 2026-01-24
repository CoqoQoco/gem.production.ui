import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MassUpdateGoldPriceView from '../mass-update-gold-price-view.vue'

// Mock the stores
vi.mock('@/stores/api/stock-api', () => ({
  useStockApiStore: () => ({
    getStockInventory: vi.fn(),
    editStockInventory: vi.fn()
  })
}))

// Mock PrimeVue components
const mockComponents = {
  Dialog: { template: '<div><slot /></div>' },
  Button: { template: '<button><slot /></button>' },
  Textarea: { template: '<textarea />' },
  InputNumber: { template: '<input type="number" />' },
  Toast: { template: '<div />' }
}

describe('MassUpdateGoldPriceView', () => {
  let wrapper

  const mockStockData1 = {
    stockNumber: 'ST001',
    productNameTh: 'แหวนทอง',
    productNameEn: 'Gold Ring',
    productTypeNameTh: 'แหวน',
    productTypeNameEn: 'Ring',
    productCost: 15750,
    costSummary: {
      finalCost: 15750,
      discountPercent: 0
    },
    materials: [
      {
        type: 'gold',
        itemCode: 'GOLD18K',
        itemNameTh: 'ทองคำ 18K',
        shapeCode: 'ROUND',
        shapeNameTh: 'กลม',
        weight: 5,
        weightUnit: 'g',
        wastePercent: 5,
        price: 3000,
        cost: 15750,
        qty: 1,
        qtyUnit: 'ชิ้น'
      },
      {
        type: 'labor',
        itemNameTh: 'ค่าแรงช่าง',
        description: 'ค่าแรงประกอบ',
        cost: 500
      }
    ]
  }

  const mockStockData2 = {
    stockNumber: 'ST002',
    productNameTh: 'สร้อยคอทอง',
    productNameEn: 'Gold Necklace',
    productTypeNameTh: 'สร้อยคอ',
    productTypeNameEn: 'Necklace',
    productCost: 31500,
    costSummary: {
      finalCost: 31500,
      discountPercent: 0
    },
    materials: [
      {
        type: 'gold',
        itemCode: 'GOLD18K',
        itemNameTh: 'ทองคำ 18K',
        shapeCode: 'CHAIN',
        shapeNameTh: 'โซ่',
        weight: 10,
        weightUnit: 'g',
        wastePercent: 5,
        price: 3000,
        cost: 31500,
        qty: 1,
        qtyUnit: 'เส้น'
      }
    ]
  }

  beforeEach(() => {
    wrapper = mount(MassUpdateGoldPriceView, {
      global: {
        components: mockComponents,
        mocks: {
          $t: (key) => key,
          $toast: {
            add: vi.fn()
          }
        }
      }
    })
  })

  describe('Initial State', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('should have empty initial data', () => {
      expect(wrapper.vm.stockNumberInput).toBe('')
      expect(wrapper.vm.globalGoldPrice).toBeNull()
      expect(wrapper.vm.stocks).toEqual([])
    })

    it('should not show results section initially', () => {
      expect(wrapper.vm.stocks.length).toBe(0)
    })
  })

  describe('Stock Number Parsing', () => {
    it('should parse comma-separated stock numbers', () => {
      const input = 'ST001, ST002, ST003'
      const result = wrapper.vm.parseStockNumbers(input)

      expect(result).toEqual(['ST001', 'ST002', 'ST003'])
    })

    it('should parse space-separated stock numbers', () => {
      const input = 'ST001 ST002 ST003'
      const result = wrapper.vm.parseStockNumbers(input)

      expect(result).toEqual(['ST001', 'ST002', 'ST003'])
    })

    it('should parse newline-separated stock numbers', () => {
      const input = 'ST001\nST002\nST003'
      const result = wrapper.vm.parseStockNumbers(input)

      expect(result).toEqual(['ST001', 'ST002', 'ST003'])
    })

    it('should remove duplicate stock numbers', () => {
      const input = 'ST001, ST002, ST001, ST003'
      const result = wrapper.vm.parseStockNumbers(input)

      expect(result).toEqual(['ST001', 'ST002', 'ST003'])
    })

    it('should handle mixed separators', () => {
      const input = 'ST001, ST002\nST003 ST004'
      const result = wrapper.vm.parseStockNumbers(input)

      expect(result).toEqual(['ST001', 'ST002', 'ST003', 'ST004'])
    })

    it('should return empty array for empty input', () => {
      const result = wrapper.vm.parseStockNumbers('')
      expect(result).toEqual([])
    })
  })

  describe('Search Functionality', () => {
    it('should show error when searching without stock numbers', async () => {
      wrapper.vm.stockNumberInput = ''
      await wrapper.vm.handleSearch()

      expect(wrapper.vm.searchError).toBe('กรุณาใส่รหัสสินค้าอย่างน้อย 1 รายการ')
    })

    it('should fetch multiple stocks', async () => {
      wrapper.vm.stockApiStore.getStockInventory = vi.fn()
        .mockResolvedValueOnce({ success: true, data: mockStockData1 })
        .mockResolvedValueOnce({ success: true, data: mockStockData2 })

      wrapper.vm.stockNumberInput = 'ST001, ST002'
      await wrapper.vm.handleSearch()

      expect(wrapper.vm.stockApiStore.getStockInventory).toHaveBeenCalledTimes(2)
      expect(wrapper.vm.stocks.length).toBe(2)
    })

    it('should calculate original gold price correctly', async () => {
      wrapper.vm.stockApiStore.getStockInventory = vi.fn()
        .mockResolvedValue({ success: true, data: mockStockData1 })

      wrapper.vm.stockNumberInput = 'ST001'
      await wrapper.vm.handleSearch()

      expect(wrapper.vm.stocks[0].originalGoldPrice).toBe(3000)
      expect(wrapper.vm.stocks[0].newGoldPrice).toBe(3000)
    })

    it('should separate gold and other materials', async () => {
      wrapper.vm.stockApiStore.getStockInventory = vi.fn()
        .mockResolvedValue({ success: true, data: mockStockData1 })

      wrapper.vm.stockNumberInput = 'ST001'
      await wrapper.vm.handleSearch()

      expect(wrapper.vm.stocks[0].goldMaterials.length).toBe(1)
      expect(wrapper.vm.stocks[0].otherMaterials.length).toBe(1)
      expect(wrapper.vm.stocks[0].goldMaterials[0].type).toBe('gold')
      expect(wrapper.vm.stocks[0].otherMaterials[0].type).toBe('labor')
    })

    it('should handle stock not found', async () => {
      wrapper.vm.stockApiStore.getStockInventory = vi.fn()
        .mockResolvedValue({ success: false, message: 'Stock not found' })

      wrapper.vm.stockNumberInput = 'ST999'
      await wrapper.vm.handleSearch()

      expect(wrapper.vm.stocks.length).toBe(0)
      expect(wrapper.vm.$toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'warn'
        })
      )
    })

    it('should handle search errors', async () => {
      wrapper.vm.stockApiStore.getStockInventory = vi.fn()
        .mockRejectedValue(new Error('Network error'))

      wrapper.vm.stockNumberInput = 'ST001'
      await wrapper.vm.handleSearch()

      expect(wrapper.vm.searchError).toBeTruthy()
      expect(wrapper.vm.$toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'error'
        })
      )
    })
  })

  describe('Global Gold Price Application', () => {
    beforeEach(async () => {
      wrapper.vm.stockApiStore.getStockInventory = vi.fn()
        .mockResolvedValueOnce({ success: true, data: mockStockData1 })
        .mockResolvedValueOnce({ success: true, data: mockStockData2 })

      wrapper.vm.stockNumberInput = 'ST001, ST002'
      await wrapper.vm.handleSearch()
    })

    it('should apply global gold price to all stocks', () => {
      wrapper.vm.globalGoldPrice = 3500
      wrapper.vm.applyGlobalGoldPrice()

      expect(wrapper.vm.stocks[0].newGoldPrice).toBe(3500)
      expect(wrapper.vm.stocks[1].newGoldPrice).toBe(3500)
    })

    it('should not apply if global price is null or zero', () => {
      const originalPrice1 = wrapper.vm.stocks[0].newGoldPrice
      const originalPrice2 = wrapper.vm.stocks[1].newGoldPrice

      wrapper.vm.globalGoldPrice = null
      wrapper.vm.applyGlobalGoldPrice()

      expect(wrapper.vm.stocks[0].newGoldPrice).toBe(originalPrice1)
      expect(wrapper.vm.stocks[1].newGoldPrice).toBe(originalPrice2)
    })

    it('should recalculate costs after applying global price', () => {
      wrapper.vm.globalGoldPrice = 3500
      wrapper.vm.applyGlobalGoldPrice()

      // ST001: (5 + 5*0.05) * 3500 = 18375
      // ST002: (10 + 10*0.05) * 3500 = 36750
      expect(wrapper.vm.stocks[0].newCost).toBeGreaterThan(wrapper.vm.stocks[0].originalCost)
      expect(wrapper.vm.stocks[1].newCost).toBeGreaterThan(wrapper.vm.stocks[1].originalCost)
    })
  })

  describe('Cost Recalculation', () => {
    beforeEach(async () => {
      wrapper.vm.stockApiStore.getStockInventory = vi.fn()
        .mockResolvedValue({ success: true, data: mockStockData1 })

      wrapper.vm.stockNumberInput = 'ST001'
      await wrapper.vm.handleSearch()
    })

    it('should recalculate cost when gold price changes', () => {
      const stock = wrapper.vm.stocks[0]
      const originalCost = stock.newCost

      stock.newGoldPrice = 3500
      wrapper.vm.recalculateCost(stock)

      expect(stock.newCost).not.toBe(originalCost)
      expect(stock.newCost).toBeGreaterThan(originalCost)
    })

    it('should include waste percentage in calculation', () => {
      const stock = wrapper.vm.stocks[0]
      const goldMaterial = stock.goldMaterials[0]

      // weight = 5, wastePercent = 5, newGoldPrice = 3500
      // totalWeight = 5 + (5 * 0.05) = 5.25
      // goldCost = 5.25 * 3500 = 18375
      // otherCost = 500 (labor)
      // finalCost = 18375 + 500 = 18875

      stock.newGoldPrice = 3500
      wrapper.vm.recalculateCost(stock)

      const expectedGoldCost = (goldMaterial.weight + (goldMaterial.weight * (goldMaterial.wastePercent / 100))) * 3500
      const expectedTotalCost = expectedGoldCost + 500 // +labor cost

      expect(stock.newCost).toBeCloseTo(expectedTotalCost, 0)
    })

    it('should preserve other material costs', () => {
      const stock = wrapper.vm.stocks[0]
      const laborCost = stock.otherMaterials[0].cost

      stock.newGoldPrice = 3500
      wrapper.vm.recalculateCost(stock)

      // Labor cost should remain unchanged
      expect(stock.otherMaterials[0].cost).toBe(laborCost)
    })
  })

  describe('Cost Summary Computeds', () => {
    beforeEach(async () => {
      wrapper.vm.stockApiStore.getStockInventory = vi.fn()
        .mockResolvedValueOnce({ success: true, data: mockStockData1 })
        .mockResolvedValueOnce({ success: true, data: mockStockData2 })

      wrapper.vm.stockNumberInput = 'ST001, ST002'
      await wrapper.vm.handleSearch()
    })

    it('should calculate total original cost', () => {
      const expected = mockStockData1.productCost + mockStockData2.productCost

      expect(wrapper.vm.totalOriginalCost).toBe(expected)
    })

    it('should calculate total new cost', () => {
      expect(wrapper.vm.totalNewCost).toBe(wrapper.vm.totalOriginalCost) // Initially same
    })

    it('should calculate total difference', () => {
      expect(wrapper.vm.totalDifference).toBe(0) // Initially no difference

      wrapper.vm.stocks[0].newGoldPrice = 3500
      wrapper.vm.recalculateCost(wrapper.vm.stocks[0])

      expect(wrapper.vm.totalDifference).toBeGreaterThan(0)
    })

    it('should detect changes', () => {
      expect(wrapper.vm.hasChanges).toBe(false)

      wrapper.vm.stocks[0].newGoldPrice = 3500
      wrapper.vm.recalculateCost(wrapper.vm.stocks[0])

      expect(wrapper.vm.hasChanges).toBe(true)
    })

    it('should count changed stocks correctly', () => {
      expect(wrapper.vm.changedStocksCount).toBe(0)

      wrapper.vm.stocks[0].newGoldPrice = 3500
      wrapper.vm.recalculateCost(wrapper.vm.stocks[0])

      expect(wrapper.vm.changedStocksCount).toBe(1)

      wrapper.vm.stocks[1].newGoldPrice = 3500
      wrapper.vm.recalculateCost(wrapper.vm.stocks[1])

      expect(wrapper.vm.changedStocksCount).toBe(2)
    })
  })

  describe('Stock Management', () => {
    beforeEach(async () => {
      wrapper.vm.stockApiStore.getStockInventory = vi.fn()
        .mockResolvedValueOnce({ success: true, data: mockStockData1 })
        .mockResolvedValueOnce({ success: true, data: mockStockData2 })

      wrapper.vm.stockNumberInput = 'ST001, ST002'
      await wrapper.vm.handleSearch()
    })

    it('should remove stock from list', () => {
      expect(wrapper.vm.stocks.length).toBe(2)

      wrapper.vm.removeStock(0)

      expect(wrapper.vm.stocks.length).toBe(1)
      expect(wrapper.vm.stocks[0].stockNumber).toBe('ST002')
    })

    it('should view stock details', () => {
      wrapper.vm.viewStockDetails(wrapper.vm.stocks[0])

      expect(wrapper.vm.selectedStock).toEqual(wrapper.vm.stocks[0])
      expect(wrapper.vm.showDetailsModal).toBe(true)
    })
  })

  describe('Form Submission', () => {
    beforeEach(async () => {
      wrapper.vm.stockApiStore.getStockInventory = vi.fn()
        .mockResolvedValueOnce({ success: true, data: mockStockData1 })
        .mockResolvedValueOnce({ success: true, data: mockStockData2 })

      wrapper.vm.stockNumberInput = 'ST001, ST002'
      await wrapper.vm.handleSearch()
    })

    it('should not submit if no changes', async () => {
      wrapper.vm.stockApiStore.editStockInventory = vi.fn()

      await wrapper.vm.handleSubmit()

      expect(wrapper.vm.$toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'warn',
          summary: 'ไม่มีการเปลี่ยนแปลง'
        })
      )
      expect(wrapper.vm.stockApiStore.editStockInventory).not.toHaveBeenCalled()
    })

    it('should submit only changed stocks', async () => {
      wrapper.vm.stocks[0].newGoldPrice = 3500
      wrapper.vm.recalculateCost(wrapper.vm.stocks[0])

      wrapper.vm.stockApiStore.editStockInventory = vi.fn().mockResolvedValue({
        success: true
      })

      await wrapper.vm.handleSubmit()

      expect(wrapper.vm.stockApiStore.editStockInventory).toHaveBeenCalled()

      const payload = wrapper.vm.stockApiStore.editStockInventory.mock.calls[0][0]
      expect(payload.stocks.length).toBe(1)
      expect(payload.stocks[0].stockNumber).toBe('ST001')
    })

    it('should prepare correct material payload', async () => {
      wrapper.vm.stocks[0].newGoldPrice = 3500
      wrapper.vm.recalculateCost(wrapper.vm.stocks[0])

      wrapper.vm.stockApiStore.editStockInventory = vi.fn().mockResolvedValue({
        success: true
      })

      await wrapper.vm.handleSubmit()

      const payload = wrapper.vm.stockApiStore.editStockInventory.mock.calls[0][0]
      const materials = payload.stocks[0].materials

      // Should have gold materials with updated price
      const goldMaterial = materials.find(m => m.type === 'gold')
      expect(goldMaterial).toBeDefined()
      expect(goldMaterial.price).toBe(3500)

      // Should preserve other materials
      const laborMaterial = materials.find(m => m.type === 'labor')
      expect(laborMaterial).toBeDefined()
    })

    it('should handle submission success', async () => {
      wrapper.vm.stocks[0].newGoldPrice = 3500
      wrapper.vm.recalculateCost(wrapper.vm.stocks[0])

      wrapper.vm.stockApiStore.editStockInventory = vi.fn().mockResolvedValue({
        success: true
      })

      await wrapper.vm.handleSubmit()

      expect(wrapper.vm.$toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'success'
        })
      )
      expect(wrapper.vm.stocks.length).toBe(0)
      expect(wrapper.vm.showConfirmModal).toBe(false)
    })

    it('should handle submission error', async () => {
      wrapper.vm.stocks[0].newGoldPrice = 3500
      wrapper.vm.recalculateCost(wrapper.vm.stocks[0])

      wrapper.vm.stockApiStore.editStockInventory = vi.fn().mockResolvedValue({
        success: false,
        message: 'Update failed'
      })

      await wrapper.vm.handleSubmit()

      expect(wrapper.vm.$toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'error'
        })
      )
    })
  })

  describe('Form Actions', () => {
    beforeEach(async () => {
      wrapper.vm.stockApiStore.getStockInventory = vi.fn()
        .mockResolvedValue({ success: true, data: mockStockData1 })

      wrapper.vm.stockNumberInput = 'ST001'
      await wrapper.vm.handleSearch()
    })

    it('should clear all data when handleClearSearch is called', () => {
      wrapper.vm.handleClearSearch()

      expect(wrapper.vm.stockNumberInput).toBe('')
      expect(wrapper.vm.globalGoldPrice).toBeNull()
      expect(wrapper.vm.stocks).toEqual([])
      expect(wrapper.vm.searchError).toBe('')
      expect(wrapper.vm.showDetailsModal).toBe(false)
      expect(wrapper.vm.showConfirmModal).toBe(false)
    })

    it('should clear search error when input changes', () => {
      wrapper.vm.searchError = 'Some error'
      wrapper.vm.clearSearchError()

      expect(wrapper.vm.searchError).toBe('')
    })
  })

  describe('Utility Functions', () => {
    it('should format currency correctly', () => {
      expect(wrapper.vm.formatCurrency(15000)).toBe('฿15,000.00')
      expect(wrapper.vm.formatCurrency(0)).toBe('฿0.00')
      expect(wrapper.vm.formatCurrency(null)).toBe('฿0.00')
    })

    it('should format difference correctly', () => {
      expect(wrapper.vm.formatDifference(1000)).toBe('+฿1,000.00')
      expect(wrapper.vm.formatDifference(-1000)).toBe('-฿1,000.00')
      expect(wrapper.vm.formatDifference(0)).toBe('฿0.00')
    })
  })

  describe('Modals', () => {
    beforeEach(async () => {
      wrapper.vm.stockApiStore.getStockInventory = vi.fn()
        .mockResolvedValue({ success: true, data: mockStockData1 })

      wrapper.vm.stockNumberInput = 'ST001'
      await wrapper.vm.handleSearch()
    })

    it('should show confirm modal', () => {
      wrapper.vm.stocks[0].newGoldPrice = 3500
      wrapper.vm.recalculateCost(wrapper.vm.stocks[0])

      wrapper.vm.showConfirmModal = true

      expect(wrapper.vm.showConfirmModal).toBe(true)
      expect(wrapper.vm.changedStocksCount).toBe(1)
    })

    it('should show details modal with selected stock', () => {
      wrapper.vm.viewStockDetails(wrapper.vm.stocks[0])

      expect(wrapper.vm.showDetailsModal).toBe(true)
      expect(wrapper.vm.selectedStock).toEqual(wrapper.vm.stocks[0])
    })

    it('should display gold materials in details modal', () => {
      wrapper.vm.viewStockDetails(wrapper.vm.stocks[0])

      expect(wrapper.vm.selectedStock.goldMaterials).toBeDefined()
      expect(wrapper.vm.selectedStock.goldMaterials.length).toBeGreaterThan(0)
    })

    it('should display other materials in details modal', () => {
      wrapper.vm.viewStockDetails(wrapper.vm.stocks[0])

      expect(wrapper.vm.selectedStock.otherMaterials).toBeDefined()
      expect(wrapper.vm.selectedStock.otherMaterials.length).toBeGreaterThan(0)
    })
  })
})
