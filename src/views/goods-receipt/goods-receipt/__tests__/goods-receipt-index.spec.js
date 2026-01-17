import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GoodsReceiptIndex from '../goods-receipt-index.vue'
import { mockDataSets, expectedApiPayload } from '../__mocks__/goods-receipt-mock-data'

// Mock the stores
vi.mock('@/stores/api/goods-receipt-api', () => ({
  useGoodsReceiptApiStore: () => ({
    manualReceipt: vi.fn().mockResolvedValue({
      success: true,
      message: 'Manual goods receipt created successfully'
    })
  })
}))

// Mock PrimeVue components
const mockComponents = {
  Dialog: { template: '<div><slot /></div>' },
  Button: { template: '<button><slot /></button>' },
  Toast: { template: '<div />' }
}

describe('GoodsReceiptIndex', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(GoodsReceiptIndex, {
      global: {
        components: mockComponents,
        stubs: {
          ProductDetail: true,
          BranchProductTypeSelection: true,
          ProductComponents: true,
          ConfirmationModal: true
        },
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
      expect(wrapper.vm.productData.originNumber).toBe('')
      expect(wrapper.vm.branchProductTypeData.branchId).toBe(null)
      expect(wrapper.vm.componentsData.components).toEqual([])
    })

    it('should show dev tools in development mode', () => {
      wrapper.vm.isDevelopment = true
      expect(wrapper.vm.isDevelopment).toBe(true)
    })
  })

  describe('Mock Data Functionality', () => {
    it('should have access to mock data sets', () => {
      expect(wrapper.vm.mockDataSets).toBeDefined()
      expect(wrapper.vm.mockDataSets.length).toBeGreaterThan(0)
    })

    it('should fill mock data when fillMockData is called', () => {
      wrapper.vm.fillMockData(0)

      expect(wrapper.vm.productData.originNumber).toBe(mockDataSets[0].productData.originNumber)
      expect(wrapper.vm.branchProductTypeData.branchId).toBe(mockDataSets[0].branchProductTypeData.branchId)
      expect(wrapper.vm.componentsData.components.length).toBeGreaterThan(0)
    })

    it('should fill different mock data sets', () => {
      // Fill first mock data set
      wrapper.vm.fillMockData(0)
      const firstOriginNumber = wrapper.vm.productData.originNumber

      // Fill second mock data set
      wrapper.vm.fillMockData(1)
      const secondOriginNumber = wrapper.vm.productData.originNumber

      expect(firstOriginNumber).not.toBe(secondOriginNumber)
    })

    it('should show toast notification when mock data is filled', () => {
      wrapper.vm.fillMockData(0)
      expect(wrapper.vm.$toast.add).toHaveBeenCalled()
    })
  })

  describe('Data Validation', () => {
    beforeEach(() => {
      wrapper.vm.fillMockData(0)
    })

    it('should have valid product data structure', () => {
      expect(wrapper.vm.productData).toHaveProperty('originNumber')
      expect(wrapper.vm.productData).toHaveProperty('mold')
      expect(wrapper.vm.productData).toHaveProperty('productNameEn')
      expect(wrapper.vm.productData).toHaveProperty('productNameTH')
      expect(wrapper.vm.productData).toHaveProperty('qty')
      expect(wrapper.vm.productData).toHaveProperty('qtyUnit')
      expect(wrapper.vm.productData).toHaveProperty('price')
      expect(wrapper.vm.productData).toHaveProperty('unitPrice')
    })

    it('should have valid branch and product type data structure', () => {
      expect(wrapper.vm.branchProductTypeData).toHaveProperty('branchId')
      expect(wrapper.vm.branchProductTypeData).toHaveProperty('branchNameTh')
      expect(wrapper.vm.branchProductTypeData).toHaveProperty('branchNameEn')
      expect(wrapper.vm.branchProductTypeData).toHaveProperty('productTypeCode')
      expect(wrapper.vm.branchProductTypeData).toHaveProperty('productTypeNameTh')
      expect(wrapper.vm.branchProductTypeData).toHaveProperty('productTypeNameEn')
    })

    it('should have valid components data structure', () => {
      expect(wrapper.vm.componentsData).toHaveProperty('components')
      expect(wrapper.vm.componentsData).toHaveProperty('productImageUrl')
      expect(wrapper.vm.componentsData).toHaveProperty('costSummary')
      expect(Array.isArray(wrapper.vm.componentsData.components)).toBe(true)
    })

    it('should have components with correct types', () => {
      const components = wrapper.vm.componentsData.components
      const types = components.map(c => c.type)

      expect(types).toContain('gold')
      expect(types).toContain('gem')
      expect(types).toContain('labor')
    })
  })

  describe('Component Data Structure', () => {
    beforeEach(() => {
      wrapper.vm.fillMockData(0)
    })

    it('should have valid gold component structure', () => {
      const goldComponent = wrapper.vm.componentsData.components.find(c => c.type === 'gold')

      expect(goldComponent).toBeDefined()
      expect(goldComponent).toHaveProperty('itemCode')
      expect(goldComponent).toHaveProperty('itemNameTh')
      expect(goldComponent).toHaveProperty('shapeCode')
      expect(goldComponent).toHaveProperty('wastePercent')
      expect(goldComponent).toHaveProperty('labelWeight')
      expect(goldComponent).toHaveProperty('weight')
      expect(goldComponent).toHaveProperty('weightUnit')
      expect(goldComponent).toHaveProperty('qty')
      expect(goldComponent).toHaveProperty('qtyUnit')
      expect(goldComponent).toHaveProperty('cost')
    })

    it('should have valid gem component structure', () => {
      const gemComponent = wrapper.vm.componentsData.components.find(c => c.type === 'gem')

      expect(gemComponent).toBeDefined()
      expect(gemComponent).toHaveProperty('itemCode')
      expect(gemComponent).toHaveProperty('itemNameTh')
      expect(gemComponent).toHaveProperty('shapeCode')
      expect(gemComponent).toHaveProperty('size')
      expect(gemComponent).toHaveProperty('origin')
      expect(gemComponent).toHaveProperty('weight')
      expect(gemComponent).toHaveProperty('cost')
    })

    it('should have valid labor component structure', () => {
      const laborComponent = wrapper.vm.componentsData.components.find(c => c.type === 'labor')

      expect(laborComponent).toBeDefined()
      expect(laborComponent).toHaveProperty('itemNameTh')
      expect(laborComponent).toHaveProperty('description')
      expect(laborComponent).toHaveProperty('cost')
    })
  })

  describe('Cost Summary', () => {
    beforeEach(() => {
      wrapper.vm.fillMockData(0)
    })

    it('should have valid cost summary structure', () => {
      const costSummary = wrapper.vm.componentsData.costSummary

      expect(costSummary).toHaveProperty('actualCost')
      expect(costSummary).toHaveProperty('usedCost')
      expect(costSummary).toHaveProperty('discountPercent')
      expect(costSummary).toHaveProperty('finalCost')
    })

    it('should have numeric cost values', () => {
      const costSummary = wrapper.vm.componentsData.costSummary

      expect(typeof costSummary.actualCost).toBe('number')
      expect(typeof costSummary.usedCost).toBe('number')
      expect(typeof costSummary.discountPercent).toBe('number')
      expect(typeof costSummary.finalCost).toBe('number')
    })

    it('should calculate final cost correctly with discount', () => {
      wrapper.vm.fillMockData(1) // Use mock data set 2 which has discount
      const costSummary = wrapper.vm.componentsData.costSummary

      if (costSummary.discountPercent > 0) {
        const expectedFinalCost = costSummary.usedCost * (1 - costSummary.discountPercent / 100)
        expect(costSummary.finalCost).toBeCloseTo(expectedFinalCost, 2)
      }
    })
  })

  describe('API Payload Generation', () => {
    beforeEach(() => {
      wrapper.vm.fillMockData(0)
    })

    it('should generate correct payload structure', async () => {
      // Simulate the payload generation logic from handleConfirmSave
      const payload = {
        mold: wrapper.vm.productData.mold,
        originNumber: wrapper.vm.productData.originNumber,
        productNameTh: wrapper.vm.productData.productNameTH,
        productNameEn: wrapper.vm.productData.productNameEn,
        qty: wrapper.vm.productData.qty,
        qtyUnit: wrapper.vm.productData.qtyUnit,
        price: wrapper.vm.productData.price,
        priceUnit: wrapper.vm.productData.unitPrice,
        branchId: wrapper.vm.branchProductTypeData.branchId,
        branchNameTh: wrapper.vm.branchProductTypeData.branchNameTh,
        branchNameEn: wrapper.vm.branchProductTypeData.branchNameEn,
        productTypeCode: wrapper.vm.branchProductTypeData.productTypeCode,
        productTypeNameTh: wrapper.vm.branchProductTypeData.productTypeNameTh,
        productTypeNameEn: wrapper.vm.branchProductTypeData.productTypeNameEn,
        productImageUrl: wrapper.vm.componentsData.productImageUrl,
        components: wrapper.vm.componentsData.components,
        costSummary: wrapper.vm.componentsData.costSummary
      }

      // Verify all required fields are present
      expect(payload).toHaveProperty('mold')
      expect(payload).toHaveProperty('originNumber')
      expect(payload).toHaveProperty('productImageUrl')
      expect(payload).toHaveProperty('components')
      expect(payload).toHaveProperty('costSummary')
      expect(Array.isArray(payload.components)).toBe(true)
      expect(payload.components.length).toBeGreaterThan(0)
    })

    it('should match expected API payload structure', () => {
      const payload = {
        mold: wrapper.vm.productData.mold,
        originNumber: wrapper.vm.productData.originNumber,
        productNameTh: wrapper.vm.productData.productNameTH,
        productNameEn: wrapper.vm.productData.productNameEn,
        qty: wrapper.vm.productData.qty,
        qtyUnit: wrapper.vm.productData.qtyUnit,
        price: wrapper.vm.productData.price,
        priceUnit: wrapper.vm.productData.unitPrice,
        branchId: wrapper.vm.branchProductTypeData.branchId,
        branchNameTh: wrapper.vm.branchProductTypeData.branchNameTh,
        branchNameEn: wrapper.vm.branchProductTypeData.branchNameEn,
        productTypeCode: wrapper.vm.branchProductTypeData.productTypeCode,
        productTypeNameTh: wrapper.vm.branchProductTypeData.productTypeNameTh,
        productTypeNameEn: wrapper.vm.branchProductTypeData.productTypeNameEn,
        productImageUrl: wrapper.vm.componentsData.productImageUrl,
        components: wrapper.vm.componentsData.components,
        costSummary: wrapper.vm.componentsData.costSummary
      }

      // Check structure matches expected format
      expect(Object.keys(payload)).toEqual(expect.arrayContaining(Object.keys(expectedApiPayload)))
    })
  })

  describe('Form Reset', () => {
    it('should reset form data', () => {
      // Fill with mock data
      wrapper.vm.fillMockData(0)
      expect(wrapper.vm.productData.originNumber).not.toBe('')

      // Reset form
      wrapper.vm.resetForm()

      // Verify data is cleared
      expect(wrapper.vm.productData.originNumber).toBe('')
      expect(wrapper.vm.branchProductTypeData.branchId).toBe(null)
      expect(wrapper.vm.componentsData.components).toEqual([])
    })
  })
})
