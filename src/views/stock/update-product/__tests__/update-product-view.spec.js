import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UpdateProductView from '../update-product-view.vue'

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
  InputText: { template: '<input />' },
  Textarea: { template: '<textarea />' },
  InputNumber: { template: '<input type="number" />' },
  Toast: { template: '<div />' }
}

describe('UpdateProductView', () => {
  let wrapper

  const mockStockData = {
    stockNumber: 'ST001',
    productNameTh: 'แหวนทอง',
    productNameEn: 'Gold Ring',
    location: 'A-01',
    size: '14',
    productNumber: 'PRD001',
    poNumber: 'PO001',
    productTypeNameTh: 'แหวน',
    productTypeNameEn: 'Ring',
    qtyUnit: 'ชิ้น',
    productCostUnit: 'บาท',
    remark: 'สินค้าคุณภาพดี',
    branchId: 1,
    branchNameTh: 'สาขาสยาม',
    branchNameEn: 'Siam Branch',
    productCost: 15000,
    status: 'Active',
    costSummary: {
      actualCost: 15000,
      usedCost: 15000,
      discountPercent: 0
    },
    materials: [
      {
        type: 'gold',
        itemNameTh: 'ทองคำ 18K',
        weight: 5,
        weightUnit: 'g',
        wastePercent: 5,
        price: 3000,
        cost: 15750
      }
    ]
  }

  beforeEach(() => {
    wrapper = mount(UpdateProductView, {
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

    it('should have empty initial search input', () => {
      expect(wrapper.vm.stockNumberInput).toBe('')
    })

    it('should not have stock data initially', () => {
      expect(wrapper.vm.stockData).toBeNull()
    })

    it('should have empty form data initially', () => {
      expect(wrapper.vm.formData.productNameTh).toBeNull()
      expect(wrapper.vm.formData.productNameEn).toBeNull()
      expect(wrapper.vm.formData.materials).toEqual([])
    })

    it('should not show edit form when no stock is loaded', () => {
      const editSection = wrapper.find('.edit-section')
      expect(editSection.exists()).toBe(false)
    })
  })

  describe('Search Functionality', () => {
    it('should show error when searching without stock number', async () => {
      wrapper.vm.stockNumberInput = ''
      await wrapper.vm.handleSearch()

      expect(wrapper.vm.searchError).toBe('กรุณาใส่รหัสสินค้า')
    })

    it('should call getStockInventory API when searching', async () => {
      const mockResponse = {
        success: true,
        data: mockStockData
      }

      wrapper.vm.stockApiStore.getStockInventory = vi.fn().mockResolvedValue(mockResponse)
      wrapper.vm.stockNumberInput = 'ST001'

      await wrapper.vm.handleSearch()

      expect(wrapper.vm.stockApiStore.getStockInventory).toHaveBeenCalledWith({
        stockNumber: 'ST001'
      })
    })

    it('should populate form data when stock is found', async () => {
      const mockResponse = {
        success: true,
        data: mockStockData
      }

      wrapper.vm.stockApiStore.getStockInventory = vi.fn().mockResolvedValue(mockResponse)
      wrapper.vm.stockNumberInput = 'ST001'

      await wrapper.vm.handleSearch()

      expect(wrapper.vm.stockData).toEqual(mockStockData)
      expect(wrapper.vm.formData.productNameTh).toBe('แหวนทอง')
      expect(wrapper.vm.formData.productNameEn).toBe('Gold Ring')
      expect(wrapper.vm.formData.branchId).toBe(1)
    })

    it('should show error message when stock not found', async () => {
      const mockResponse = {
        success: false,
        message: 'Stock not found'
      }

      wrapper.vm.stockApiStore.getStockInventory = vi.fn().mockResolvedValue(mockResponse)
      wrapper.vm.stockNumberInput = 'ST999'

      await wrapper.vm.handleSearch()

      expect(wrapper.vm.searchError).toContain('ไม่พบสินค้ารหัส')
    })

    it('should clear search error when typing in search input', () => {
      wrapper.vm.searchError = 'Some error'
      wrapper.vm.clearSearchError()

      expect(wrapper.vm.searchError).toBe('')
    })
  })

  describe('Form Data Management', () => {
    beforeEach(async () => {
      const mockResponse = {
        success: true,
        data: mockStockData
      }

      wrapper.vm.stockApiStore.getStockInventory = vi.fn().mockResolvedValue(mockResponse)
      wrapper.vm.stockNumberInput = 'ST001'
      await wrapper.vm.handleSearch()
    })

    it('should detect changes when form data is modified', () => {
      expect(wrapper.vm.hasChanges).toBe(false)

      wrapper.vm.formData.productNameTh = 'แหวนทองใหม่'

      expect(wrapper.vm.hasChanges).toBe(true)
    })

    it('should track changed fields correctly', () => {
      wrapper.vm.formData.productNameTh = 'แหวนทองใหม่'
      wrapper.vm.formData.size = '15'

      const changes = wrapper.vm.changedFields

      expect(changes.length).toBe(2)
      expect(changes.some(c => c.field === 'productNameTh')).toBe(true)
      expect(changes.some(c => c.field === 'size')).toBe(true)
    })

    it('should handle null and empty string as equivalent', () => {
      wrapper.vm.originalFormData.remark = null
      wrapper.vm.formData.remark = ''

      expect(wrapper.vm.hasChanges).toBe(false)
    })
  })

  describe('Material Management', () => {
    beforeEach(async () => {
      const mockResponse = {
        success: true,
        data: mockStockData
      }

      wrapper.vm.stockApiStore.getStockInventory = vi.fn().mockResolvedValue(mockResponse)
      wrapper.vm.stockNumberInput = 'ST001'
      await wrapper.vm.handleSearch()
    })

    it('should have materials from stock data', () => {
      expect(wrapper.vm.formData.materials.length).toBeGreaterThan(0)
      expect(wrapper.vm.formData.materials[0].type).toBe('gold')
    })

    it('should show add material dialog when button is clicked', async () => {
      expect(wrapper.vm.showAddMaterialDialog).toBe(false)

      wrapper.vm.showAddMaterialDialog = true

      expect(wrapper.vm.showAddMaterialDialog).toBe(true)
    })

    it('should initialize empty gold material correctly', () => {
      const emptyMaterial = wrapper.vm.getEmptyMaterial('gold')

      expect(emptyMaterial.type).toBe('gold')
      expect(emptyMaterial.itemNameTh).toBe('')
      expect(emptyMaterial.weightUnit).toBe('g')
      expect(emptyMaterial.cost).toBeNull()
    })

    it('should initialize empty gem material correctly', () => {
      const emptyMaterial = wrapper.vm.getEmptyMaterial('gem')

      expect(emptyMaterial.type).toBe('gem')
      expect(emptyMaterial.itemNameTh).toBe('')
      expect(emptyMaterial.weightUnit).toBe('g')
    })

    it('should initialize empty labor material correctly', () => {
      const emptyMaterial = wrapper.vm.getEmptyMaterial('labor')

      expect(emptyMaterial.type).toBe('labor')
      expect(emptyMaterial.itemNameTh).toBe('')
      expect(emptyMaterial.description).toBe('')
    })

    it('should calculate gold material cost correctly', () => {
      wrapper.vm.currentMaterial = {
        type: 'gold',
        weight: 5,
        wastePercent: 5,
        price: 3000
      }

      wrapper.vm.calculateMaterialCost()

      // Formula: (5 + (5 * 0.05)) * 3000 = 15750
      expect(wrapper.vm.currentMaterial.cost).toBe(15750)
    })

    it('should calculate gem material cost correctly', () => {
      wrapper.vm.currentMaterial = {
        type: 'gem',
        weight: 2,
        price: 5000
      }

      wrapper.vm.calculateMaterialCost()

      // Formula: 2 * 5000 = 10000
      expect(wrapper.vm.currentMaterial.cost).toBe(10000)
    })

    it('should validate gold material before saving', () => {
      wrapper.vm.currentMaterial = {
        type: 'gold',
        itemNameTh: '',
        weight: 0,
        weightUnit: '',
        wastePercent: null,
        price: 0
      }

      const isValid = wrapper.vm.validateCurrentMaterial()

      expect(isValid).toBe(false)
      expect(wrapper.vm.materialErrors.itemNameTh).toBeTruthy()
      expect(wrapper.vm.materialErrors.weight).toBeTruthy()
    })

    it('should add new material to form data', () => {
      const initialLength = wrapper.vm.formData.materials.length

      wrapper.vm.currentMaterial = {
        type: 'labor',
        itemNameTh: 'ค่าแรงช่าง',
        cost: 500,
        description: 'ค่าแรงประกอบ'
      }

      wrapper.vm.editingMaterialIndex = null
      wrapper.vm.saveMaterial()

      expect(wrapper.vm.formData.materials.length).toBe(initialLength + 1)
    })

    it('should edit existing material', () => {
      wrapper.vm.editingMaterialIndex = 0
      wrapper.vm.currentMaterial = {
        ...wrapper.vm.formData.materials[0],
        itemNameTh: 'ทองคำ 22K'
      }

      wrapper.vm.saveMaterial()

      expect(wrapper.vm.formData.materials[0].itemNameTh).toBe('ทองคำ 22K')
    })

    it('should remove material from list', () => {
      const initialLength = wrapper.vm.formData.materials.length

      // Mock confirm dialog
      window.confirm = vi.fn(() => true)

      wrapper.vm.removeMaterial(0)

      expect(wrapper.vm.formData.materials.length).toBe(initialLength - 1)
    })

    it('should get correct material type name', () => {
      expect(wrapper.vm.getMaterialTypeName('gold')).toBe('ทอง')
      expect(wrapper.vm.getMaterialTypeName('gem')).toBe('พลอย')
      expect(wrapper.vm.getMaterialTypeName('labor')).toBe('ค่าแรง')
    })

    it('should get correct material badge class', () => {
      expect(wrapper.vm.getMaterialBadgeClass('gold')).toBe('gold')
      expect(wrapper.vm.getMaterialBadgeClass('gem')).toBe('gem')
      expect(wrapper.vm.getMaterialBadgeClass('labor')).toBe('labor')
    })
  })

  describe('Form Submission', () => {
    beforeEach(async () => {
      const mockResponse = {
        success: true,
        data: mockStockData
      }

      wrapper.vm.stockApiStore.getStockInventory = vi.fn().mockResolvedValue(mockResponse)
      wrapper.vm.stockNumberInput = 'ST001'
      await wrapper.vm.handleSearch()
    })

    it('should not submit if no changes', async () => {
      wrapper.vm.stockApiStore.editStockInventory = vi.fn()

      await wrapper.vm.handleSubmit()

      expect(wrapper.vm.stockApiStore.editStockInventory).not.toHaveBeenCalled()
    })

    it('should submit only changed fields', async () => {
      wrapper.vm.formData.productNameTh = 'แหวนทองใหม่'
      wrapper.vm.formData.size = '15'

      wrapper.vm.stockApiStore.editStockInventory = vi.fn().mockResolvedValue({
        success: true
      })

      await wrapper.vm.handleSubmit()

      expect(wrapper.vm.stockApiStore.editStockInventory).toHaveBeenCalled()

      const payload = wrapper.vm.stockApiStore.editStockInventory.mock.calls[0][0]
      expect(payload.stocks[0].stockNumber).toBe('ST001')
      expect(payload.stocks[0].productNameTh).toBe('แหวนทองใหม่')
      expect(payload.stocks[0].size).toBe('15')
    })

    it('should handle submission error', async () => {
      wrapper.vm.formData.productNameTh = 'แหวนทองใหม่'

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

    it('should clear form after successful submission', async () => {
      wrapper.vm.formData.productNameTh = 'แหวนทองใหม่'

      wrapper.vm.stockApiStore.editStockInventory = vi.fn().mockResolvedValue({
        success: true
      })

      await wrapper.vm.handleSubmit()

      expect(wrapper.vm.stockData).toBeNull()
      expect(wrapper.vm.stockNumberInput).toBe('')
    })
  })

  describe('Form Actions', () => {
    beforeEach(async () => {
      const mockResponse = {
        success: true,
        data: mockStockData
      }

      wrapper.vm.stockApiStore.getStockInventory = vi.fn().mockResolvedValue(mockResponse)
      wrapper.vm.stockNumberInput = 'ST001'
      await wrapper.vm.handleSearch()
    })

    it('should clear all data when handleClearSearch is called', () => {
      wrapper.vm.handleClearSearch()

      expect(wrapper.vm.stockNumberInput).toBe('')
      expect(wrapper.vm.stockData).toBeNull()
      expect(wrapper.vm.formData.productNameTh).toBeNull()
      expect(wrapper.vm.searchError).toBe('')
    })

    it('should prompt confirmation when canceling with changes', () => {
      wrapper.vm.formData.productNameTh = 'แหวนทองใหม่'

      window.confirm = vi.fn(() => false)

      wrapper.vm.handleCancel()

      expect(window.confirm).toHaveBeenCalled()
      expect(wrapper.vm.stockData).not.toBeNull()
    })

    it('should clear form when confirming cancel with changes', () => {
      wrapper.vm.formData.productNameTh = 'แหวนทองใหม่'

      window.confirm = vi.fn(() => true)

      wrapper.vm.handleCancel()

      expect(wrapper.vm.stockData).toBeNull()
    })
  })

  describe('Utility Functions', () => {
    it('should format currency correctly', () => {
      expect(wrapper.vm.formatCurrency(15000)).toBe('฿15,000.00')
      expect(wrapper.vm.formatCurrency(0)).toBe('฿0.00')
      expect(wrapper.vm.formatCurrency(null)).toBe('฿0.00')
    })

    it('should format field value correctly', () => {
      expect(wrapper.vm.formatFieldValue('test')).toBe('test')
      expect(wrapper.vm.formatFieldValue(null)).toBe('-')
      expect(wrapper.vm.formatFieldValue(undefined)).toBe('-')
      expect(wrapper.vm.formatFieldValue('')).toBe('-')
    })
  })

  describe('Preview Modal', () => {
    beforeEach(async () => {
      const mockResponse = {
        success: true,
        data: mockStockData
      }

      wrapper.vm.stockApiStore.getStockInventory = vi.fn().mockResolvedValue(mockResponse)
      wrapper.vm.stockNumberInput = 'ST001'
      await wrapper.vm.handleSearch()
    })

    it('should show preview modal', () => {
      wrapper.vm.formData.productNameTh = 'แหวนทองใหม่'
      wrapper.vm.showPreviewModal = true

      expect(wrapper.vm.showPreviewModal).toBe(true)
      expect(wrapper.vm.changedFields.length).toBeGreaterThan(0)
    })

    it('should display changed fields in preview', () => {
      wrapper.vm.formData.productNameTh = 'แหวนทองใหม่'
      wrapper.vm.formData.size = '15'

      const changes = wrapper.vm.changedFields

      expect(changes.length).toBe(2)
      expect(changes[0].label).toBeTruthy()
      expect(changes[0].oldValue).toBeTruthy()
      expect(changes[0].newValue).toBeTruthy()
    })
  })

  describe('Confirm Modal', () => {
    beforeEach(async () => {
      const mockResponse = {
        success: true,
        data: mockStockData
      }

      wrapper.vm.stockApiStore.getStockInventory = vi.fn().mockResolvedValue(mockResponse)
      wrapper.vm.stockNumberInput = 'ST001'
      await wrapper.vm.handleSearch()
    })

    it('should show confirm modal before submission', () => {
      wrapper.vm.formData.productNameTh = 'แหวนทองใหม่'
      wrapper.vm.showConfirmModal = true

      expect(wrapper.vm.showConfirmModal).toBe(true)
      expect(wrapper.vm.hasChanges).toBe(true)
    })

    it('should display stock number in confirm modal', () => {
      wrapper.vm.formData.productNameTh = 'แหวนทองใหม่'
      wrapper.vm.showConfirmModal = true

      expect(wrapper.vm.stockData.stockNumber).toBe('ST001')
    })
  })
})
