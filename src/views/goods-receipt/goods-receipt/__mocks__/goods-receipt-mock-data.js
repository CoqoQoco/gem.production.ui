/**
 * Mock Data for Goods Receipt Testing
 * Use this data to quickly fill the form during development
 */

export const mockProductData = {
  originNumber: 'ORG-2026-001',
  mold: 'MOLD-001',
  productNameEn: 'Gold Ring with Ruby',
  productNameTH: 'แหวนทองประดับทับทิม',
  qty: 1,
  qtyUnit: 'ชิ้น',
  price: 45000,
  unitPrice: 'THB'
}

export const mockBranchProductTypeData = {
  branchId: 1,
  branchNameTh: 'สาขากรุงเทพ',
  branchNameEn: 'Bangkok Branch',
  productTypeCode: 'RING',
  productTypeNameTh: 'แหวน',
  productTypeNameEn: 'Ring'
}

export const mockComponentsData = {
  components: [
    // Gold Component
    {
      type: 'gold',
      itemCode: 'GOLD-96.5',
      itemNameTh: 'ทองคำ 96.5%',
      itemNameEn: 'Gold 96.5%',
      shapeCode: 'ROUND',
      shapeNameTh: 'วงกลม',
      shapeNameEn: 'Round',
      wastePercent: 5,
      labelWeight: 10.5,
      weight: 10,
      weightUnit: 'g',
      qty: 1,
      qtyUnit: 'ชิ้น',
      price: 315000, // Same as cost
      cost: 315000 // (10 + (10 * 0.05)) * 30000 = 10.5 * 30000
    },
    // Gem Component
    {
      type: 'gem',
      itemCode: 'RUBY-001',
      itemNameTh: 'ทับทิม',
      itemNameEn: 'Ruby',
      shapeCode: 'OVAL',
      shapeNameTh: 'รูปไข่',
      shapeNameEn: 'Oval',
      size: '5x7 mm',
      origin: 'พม่า',
      weight: 1.5,
      weightUnit: 'กะรัต',
      qty: 1,
      qtyUnit: 'เม็ด',
      price: 12000, // Same as cost
      cost: 12000 // 1.5 * 8000
    },
    // Labor Component
    {
      type: 'labor',
      itemCode: 'LABOR-001',
      itemNameTh: 'ค่าแรงช่าง',
      itemNameEn: 'Labor Cost',
      description: 'ค่าแรงตีทอง + ฝังพลอย',
      cost: 3000
    }
  ],
  productImageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
  productImageBlobName: 'mock-image.jpg',
  costSummary: {
    actualCost: 45000,
    usedCost: 45000,
    discountPercent: 0,
    finalCost: 45000
  }
}

// Mock data set 2: Necklace with Diamond
export const mockProductData2 = {
  originNumber: 'ORG-2026-002',
  mold: 'MOLD-002',
  productNameEn: 'Gold Necklace with Diamond',
  productNameTH: 'สร้อยคอทองประดับเพชร',
  qty: 1,
  qtyUnit: 'ชิ้น',
  price: 85000,
  unitPrice: 'THB'
}

export const mockBranchProductTypeData2 = {
  branchId: 2,
  branchNameTh: 'สาขาเชียงใหม่',
  branchNameEn: 'Chiang Mai Branch',
  productTypeCode: 'NECKLACE',
  productTypeNameTh: 'สร้อยคอ',
  productTypeNameEn: 'Necklace'
}

export const mockComponentsData2 = {
  components: [
    // Gold Component
    {
      type: 'gold',
      itemCode: 'GOLD-99.99',
      itemNameTh: 'ทองคำ 99.99%',
      itemNameEn: 'Gold 99.99%',
      shapeCode: 'CHAIN',
      shapeNameTh: 'สายโซ่',
      shapeNameEn: 'Chain',
      wastePercent: 3,
      labelWeight: 20.6,
      weight: 20,
      weightUnit: 'g',
      qty: 1,
      qtyUnit: 'เส้น',
      price: 618000, // Same as cost
      cost: 618000 // (20 + (20 * 0.03)) * 30000 = 20.6 * 30000
    },
    // Gem Component - Diamond
    {
      type: 'gem',
      itemCode: 'DIAMOND-001',
      itemNameTh: 'เพชร',
      itemNameEn: 'Diamond',
      shapeCode: 'ROUND',
      shapeNameTh: 'กลม',
      shapeNameEn: 'Round',
      size: '0.5 กะรัต',
      origin: 'แอฟริกาใต้',
      weight: 0.5,
      weightUnit: 'กะรัต',
      qty: 3,
      qtyUnit: 'เม็ด',
      price: 18000, // Same as cost
      cost: 18000 // 0.5 * 36000
    },
    // Labor Component
    {
      type: 'labor',
      itemCode: 'LABOR-002',
      itemNameTh: 'ค่าแรงฝังเพชร',
      itemNameEn: 'Diamond Setting Cost',
      description: 'ค่าแรงฝังเพชร 3 เม็ด + ขัดเงา',
      cost: 7000
    }
  ],
  productImageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
  productImageBlobName: 'mock-necklace.jpg',
  costSummary: {
    actualCost: 85000,
    usedCost: 82000,
    discountPercent: 5,
    finalCost: 77900
  }
}

// Mock data set 3: Bracelet with Emerald
export const mockProductData3 = {
  originNumber: 'ORG-2026-003',
  mold: 'MOLD-003',
  productNameEn: 'Gold Bracelet with Emerald',
  productNameTH: 'กำไลทองประดับมรกต',
  qty: 1,
  qtyUnit: 'ชิ้น',
  price: 120000,
  unitPrice: 'THB'
}

export const mockBranchProductTypeData3 = {
  branchId: 1,
  branchNameTh: 'สาขากรุงเทพ',
  branchNameEn: 'Bangkok Branch',
  productTypeCode: 'BRACELET',
  productTypeNameTh: 'กำไล',
  productTypeNameEn: 'Bracelet'
}

export const mockComponentsData3 = {
  components: [
    // Gold Component
    {
      type: 'gold',
      itemCode: 'GOLD-96.5',
      itemNameTh: 'ทองคำ 96.5%',
      itemNameEn: 'Gold 96.5%',
      shapeCode: 'BANGLE',
      shapeNameTh: 'กำไล',
      shapeNameEn: 'Bangle',
      wastePercent: 7,
      labelWeight: 37.45,
      weight: 35,
      weightUnit: 'g',
      qty: 1,
      qtyUnit: 'ชิ้น',
      price: 1123500, // Same as cost
      cost: 1123500 // (35 + (35 * 0.07)) * 30000 = 37.45 * 30000
    },
    // Gem Component - Emerald
    {
      type: 'gem',
      itemCode: 'EMERALD-001',
      itemNameTh: 'มรกต',
      itemNameEn: 'Emerald',
      shapeCode: 'RECTANGLE',
      shapeNameTh: 'สี่เหลี่ยม',
      shapeNameEn: 'Rectangle',
      size: '8x6 mm',
      origin: 'โคลอมเบีย',
      weight: 2.5,
      weightUnit: 'กะรัต',
      qty: 5,
      qtyUnit: 'เม็ด',
      price: 18000, // Same as cost
      cost: 18000 // 2.5 * 7200
    },
    // Labor Component
    {
      type: 'labor',
      itemCode: 'LABOR-003',
      itemNameTh: 'ค่าแรงฝังมรกต',
      itemNameEn: 'Emerald Setting Cost',
      description: 'ค่าแรงฝังมรกต 5 เม็ด + ตกแต่งลายไทย',
      cost: 7000
    }
  ],
  productImageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
  productImageBlobName: 'mock-bracelet.jpg',
  costSummary: {
    actualCost: 120000,
    usedCost: 120000,
    discountPercent: 10,
    finalCost: 108000
  }
}

// Export all mock data sets
export const mockDataSets = [
  {
    name: 'แหวนทองประดับทับทิม',
    productData: mockProductData,
    branchProductTypeData: mockBranchProductTypeData,
    componentsData: mockComponentsData
  },
  {
    name: 'สร้อยคอทองประดับเพชร',
    productData: mockProductData2,
    branchProductTypeData: mockBranchProductTypeData2,
    componentsData: mockComponentsData2
  },
  {
    name: 'กำไลทองประดับมรกต',
    productData: mockProductData3,
    branchProductTypeData: mockBranchProductTypeData3,
    componentsData: mockComponentsData3
  }
]

// Expected API Payload format for testing
export const expectedApiPayload = {
  mold: 'MOLD-001',
  originNumber: 'ORG-2026-001',
  productNameTh: 'แหวนทองประดับทับทิม',
  productNameEn: 'Gold Ring with Ruby',
  qty: 1,
  qtyUnit: 'ชิ้น',
  price: 45000,
  priceUnit: 'THB',
  branchId: 1,
  branchNameTh: 'สาขากรุงเทพ',
  branchNameEn: 'Bangkok Branch',
  productTypeCode: 'RING',
  productTypeNameTh: 'แหวน',
  productTypeNameEn: 'Ring',
  productImageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
  components: [
    {
      type: 'gold',
      itemCode: 'GOLD-96.5',
      itemNameTh: 'ทองคำ 96.5%',
      itemNameEn: 'Gold 96.5%',
      shapeCode: 'ROUND',
      shapeNameTh: 'วงกลม',
      shapeNameEn: 'Round',
      wastePercent: 5,
      labelWeight: 10.5,
      weight: 10,
      weightUnit: 'g',
      qty: 1,
      qtyUnit: 'ชิ้น',
      price: 315000,
      cost: 315000
    },
    {
      type: 'gem',
      itemCode: 'RUBY-001',
      itemNameTh: 'ทับทิม',
      itemNameEn: 'Ruby',
      shapeCode: 'OVAL',
      shapeNameTh: 'รูปไข่',
      shapeNameEn: 'Oval',
      size: '5x7 mm',
      origin: 'พม่า',
      weight: 1.5,
      weightUnit: 'กะรัต',
      qty: 1,
      qtyUnit: 'เม็ด',
      price: 12000,
      cost: 12000
    },
    {
      type: 'labor',
      itemCode: 'LABOR-001',
      itemNameTh: 'ค่าแรงช่าง',
      itemNameEn: 'Labor Cost',
      description: 'ค่าแรงตีทอง + ฝังพลอย',
      cost: 3000
    }
  ],
  costSummary: {
    actualCost: 45000,
    usedCost: 45000,
    discountPercent: 0,
    finalCost: 45000
  }
}
