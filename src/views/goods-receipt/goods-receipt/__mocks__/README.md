# Goods Receipt Mock Data

ไฟล์นี้จัดเตรียมข้อมูลจำลองสำหรับการพัฒนาและทดสอบระบบรับสินค้า

## การใช้งาน Mock Data

### 1. ในหน้า Development

เมื่อรันโปรเจ็กต์ในโหมด Development (`npm run dev`), คุณจะเห็นปุ่ม "Development Tools" ที่ด้านบนของหน้ารับสินค้า

ปุ่มที่มีให้เลือก:
- **แหวนทองประดับทับทิม** - ข้อมูลจำลองแหวนทอง + ทับทิม + ค่าแรง
- **สร้อยคอทองประดับเพชร** - ข้อมูลจำลองสร้อยคอทอง + เพชร 3 เม็ด + ค่าแรง (มีส่วนลด 5%)
- **กำไลทองประดับมรกต** - ข้อมูลจำลองกำไลทอง + มรกต 5 เม็ด + ค่าแรง (มีส่วนลด 10%)

### 2. การเพิ่ม Mock Data Set ใหม่

แก้ไขไฟล์ `goods-receipt-mock-data.js`:

```javascript
export const mockProductData4 = {
  originNumber: 'ORG-2026-004',
  mold: 'MOLD-004',
  productNameEn: 'Your Product Name EN',
  productNameTH: 'ชื่อสินค้าของคุณ',
  qty: 1,
  qtyUnit: 'ชิ้น',
  price: 50000,
  unitPrice: 'THB'
}

export const mockBranchProductTypeData4 = {
  branchId: 1,
  branchNameTh: 'สาขากรุงเทพ',
  branchNameEn: 'Bangkok Branch',
  productTypeCode: 'YOUR_TYPE',
  productTypeNameTh: 'ประเภทของคุณ',
  productTypeNameEn: 'Your Type'
}

export const mockComponentsData4 = {
  components: [
    // เพิ่ม components ของคุณที่นี่
  ],
  productImageUrl: 'https://your-image-url.com/image.jpg',
  productImageBlobName: 'your-image.jpg',
  costSummary: {
    actualCost: 50000,
    usedCost: 50000,
    discountPercent: 0,
    finalCost: 50000
  }
}

// เพิ่มเข้าไปใน mockDataSets
export const mockDataSets = [
  // ... existing sets
  {
    name: 'ชื่อสินค้าของคุณ',
    productData: mockProductData4,
    branchProductTypeData: mockBranchProductTypeData4,
    componentsData: mockComponentsData4
  }
]
```

## โครงสร้างข้อมูล

### Product Data
```javascript
{
  originNumber: string,    // หมายเลขต้นทาง
  mold: string,            // รหัสแม่พิมพ์
  productNameEn: string,   // ชื่อสินค้า (EN)
  productNameTH: string,   // ชื่อสินค้า (TH)
  qty: number,             // จำนวน
  qtyUnit: string,         // หน่วยนับ
  price: number,           // ราคา
  unitPrice: string        // หน่วยราคา (THB, USD, etc.)
}
```

### Branch & Product Type Data
```javascript
{
  branchId: number,
  branchNameTh: string,
  branchNameEn: string,
  productTypeCode: string,
  productTypeNameTh: string,
  productTypeNameEn: string
}
```

### Components Data

#### Gold Component
```javascript
{
  type: 'gold',
  itemCode: string,
  itemNameTh: string,
  itemNameEn: string,
  shapeCode: string,
  shapeNameTh: string,
  shapeNameEn: string,
  wastePercent: number,      // %waste
  labelWeight: number,       // น้ำหนักป้าย
  weight: number,            // น้ำหนัก
  weightUnit: string,        // หน่วยน้ำหนัก (g, กรัม)
  qty: number,               // จำนวน
  qtyUnit: string,           // หน่วยนับ
  cost: number               // ต้นทุน
}
```

#### Gem Component
```javascript
{
  type: 'gem',
  itemCode: string,
  itemNameTh: string,
  itemNameEn: string,
  shapeCode: string,
  shapeNameTh: string,
  shapeNameEn: string,
  size: string,              // ขนาด
  origin: string,            // แหล่งที่มา
  weight: number,
  weightUnit: string,
  qty: number,
  qtyUnit: string,
  cost: number
}
```

#### Labor Component
```javascript
{
  type: 'labor',
  itemCode: string,
  itemNameTh: string,
  itemNameEn: string,
  description: string,       // รายละเอียด
  cost: number
}
```

### Cost Summary
```javascript
{
  actualCost: number,        // ราคาต้นทุนจริง (รวมจาก components ทั้งหมด)
  usedCost: number,          // ราคาต้นทุนที่ใช้
  discountPercent: number,   // ส่วนลด (%)
  finalCost: number          // ราคาสุดท้าย (หลังหักส่วนลด)
}
```

## API Payload Format

เมื่อกดบันทึก, ระบบจะส่งข้อมูลในรูปแบบนี้ไปยัง API:

```javascript
{
  // ข้อมูลสินค้า
  mold: string,
  originNumber: string,
  productNameTh: string,
  productNameEn: string,
  qty: number,
  qtyUnit: string,
  price: number,
  priceUnit: string,

  // ข้อมูลสาขาและประเภทสินค้า
  branchId: number,
  branchNameTh: string,
  branchNameEn: string,
  productTypeCode: string,
  productTypeNameTh: string,
  productTypeNameEn: string,

  // ข้อมูลใหม่
  productImageUrl: string,   // URL รูปภาพจาก Azure Blob Storage
  components: [              // ส่วนประกอบทั้งหมด (gold, gem, labor)
    // ... component objects
  ],
  costSummary: {
    actualCost: number,
    usedCost: number,
    discountPercent: number,
    finalCost: number
  }
}
```

## ข้อควรระวัง

1. **ข้อมูลรูปภาพ**: Mock data ใช้รูปจาก Unsplash เป็นตัวอย่าง ในการใช้งานจริงจะต้อง upload รูปผ่าน API
2. **Branch ID**: ตรวจสอบว่า Branch ID ที่ใช้มีอยู่ในระบบจริง
3. **Product Type Code**: ตรวจสอบว่า Product Type Code ที่ใช้ถูกต้อง
4. **Cost Calculation**: ตรวจสอบว่า actualCost = ผลรวมของ cost ทุก component

## การทดสอบ

รัน unit tests:
```bash
npm run test
```

หรือ test เฉพาะ goods receipt:
```bash
npm run test goods-receipt
```

## Tips

- กด Console (F12) เพื่อดูข้อมูลที่ถูกโหลดจาก Mock Data
- ตรวจสอบ Network tab เพื่อดู payload ที่ส่งไปยัง API
- ใช้ mock data set ที่แตกต่างกันเพื่อทดสอบกรณีต่างๆ (มีส่วนลด, ไม่มีส่วนลด, ฯลฯ)
