export const branches = [
  { value: 1, label: 'สาขาสำนักงานใหญ่ (กรุงเทพ)' },
  { value: 2, label: 'สาขาเชียงใหม่' },
  { value: 3, label: 'สาขาภูเก็ต' }
]

export const roles = [
  { value: 'sales', label: 'พนักงานขาย (Sales)' },
  { value: 'guide', label: 'ไกด์ (Guide)' },
  { value: 'driver', label: 'คนขับรถ (Driver)' },
  { value: 'warehouse', label: 'พนักงานคลังสินค้า' },
  { value: 'manager', label: 'ผู้จัดการ (Manager)' },
  { value: 'admin', label: 'ผู้ดูแลระบบ (Admin)' }
]

// Dashboard Quick Stats
export const quickStats = [
  {
    id: 'sales',
    icon: '💰',
    label: 'ยอดขายวันนี้',
    value: '125,000 ฿',
    change: '+12.5%',
    changeType: 'positive'
  },
  {
    id: 'stock',
    icon: '📦',
    label: 'สินค้าคงเหลือ',
    value: '456 ชิ้น',
    change: '-8 ชิ้น',
    changeType: 'neutral'
  },
  {
    id: 'customers',
    icon: '👥',
    label: 'ลูกค้าวันนี้',
    value: '28 คน',
    change: '+5 คน',
    changeType: 'positive'
  },
  {
    id: 'orders',
    icon: '💎',
    label: 'ออเดอร์รอดำเนินการ',
    value: '12 รายการ',
    change: '2 รายการ',
    changeType: 'neutral'
  }
]

// Dashboard Modules
export const modules = [
  {
    id: 'master-data',
    icon: 'pi pi-database',
    iconEmoji: '👥',
    title: 'ข้อมูลหลัก',
    subtitle: 'Master Data Management',
    features: [
      'พนักงานขาย (Salesperson)',
      'ไกด์ (Guide)',
      'คนขับรถ (Driver)',
      'ข้อมูลสินค้าจิวเวลรี่',
      'ผู้ใช้งานระบบ'
    ],
    route: '/master-data',
    accentColor: '#3b82f6'
  },
  {
    id: 'goods-receipt',
    icon: 'pi pi-box',
    iconEmoji: '📦',
    title: 'รับสินค้าเข้า Stock',
    subtitle: 'Goods Receipt & Warehouse',
    features: [
      'บันทึกรับสินค้าเข้า',
      'รับสินค้าจากฝ่ายผลิต',
      'โอนสินค้าระหว่างสาขา',
      'ตรวจสอบ Stock คงเหลือ'
    ],
    route: '/goods-receipt',
    accentColor: '#f97316'
  },
  {
    id: 'pos',
    icon: 'pi pi-shopping-cart',
    iconEmoji: '🛒',
    title: 'ขายหน้าร้าน',
    subtitle: 'Point of Sale (POS)',
    features: [
      'ขายจิวเวลรี่ + ระบุ Location',
      'ขาย Gift Shop',
      'จัดการคิวไกด์',
      'ชำระเงิน 3 วิธี'
    ],
    route: '/pos',
    accentColor: '#10b981'
  },
  {
    id: 'documents',
    icon: 'pi pi-print',
    iconEmoji: '🖨️',
    title: 'พิมพ์เอกสาร',
    subtitle: 'Document Printing',
    features: [
      'ใบส่งของ/ใบเสร็จแบบย่อ (A5)',
      'ใบกำกับภาษีแบบเต็ม',
      'VAT Refund + Passport',
      'Export PDF'
    ],
    route: '/documents',
    accentColor: '#8b5cf6'
  },
  {
    id: 'commission',
    icon: 'pi pi-money-bill',
    iconEmoji: '💰',
    title: 'คำนวณคอมมิชชั่น',
    subtitle: 'Commission Calculation',
    features: [
      'คอมมิชชั่นไกด์รายวัน',
      'คอมมิชชั่น Sales',
      'คอมมิชชั่น Marketing',
      'สรุปรายการจ่ายเงิน'
    ],
    route: '/commission',
    accentColor: '#eab308'
  },
  {
    id: 'reports',
    icon: 'pi pi-chart-bar',
    iconEmoji: '📊',
    title: 'รายงาน',
    subtitle: 'Reports & Analytics',
    features: [
      'รายงานขายรายวัน-เดือน-ปี',
      'รายงาน Stock คงเหลือ',
      'รายงานคอมมิชชั่นทุกประเภท',
      'Dashboard สำหรับผู้บริหาร'
    ],
    route: '/reports',
    accentColor: '#ef4444'
  }
]
