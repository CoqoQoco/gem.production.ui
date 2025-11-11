// Mock Data for Worker Management Module
// Guide, Sales Staff, and Driver data

// ข้อมูล Guide
export const guidesData = [
  {
    id: 1,
    code: 'GD001',
    nameTh: 'สมชาย ใจดี',
    nameEn: 'Somchai Jaidee',
    gender: 'male',
    phone: '081-234-5678',
    email: 'somchai.j@example.com',
    address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    branchId: 1,
    status: 'active',
    joinDate: '2023-01-15',
    languages: ['TH', 'EN', 'CN'],
    rating: 4.8,
    totalTrips: 156,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 2,
    code: 'GD002',
    nameTh: 'สมหญิง รักษ์สุข',
    nameEn: 'Somying Raksuk',
    gender: 'female',
    phone: '082-345-6789',
    email: 'somying.r@example.com',
    address: '456 ถนนพระราม 4 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330',
    branchId: 1,
    status: 'active',
    joinDate: '2023-03-20',
    languages: ['TH', 'EN'],
    rating: 4.9,
    totalTrips: 203,
    createdAt: '2023-03-20T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 3,
    code: 'GD003',
    nameTh: 'ประเสริฐ วงศ์ทอง',
    nameEn: 'Prasert Wongthong',
    gender: 'male',
    phone: '083-456-7890',
    email: 'prasert.w@example.com',
    address: '789 ถนนรัชดาภิเษก แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900',
    branchId: 2,
    status: 'active',
    joinDate: '2023-05-10',
    languages: ['TH', 'EN', 'JP'],
    rating: 4.7,
    totalTrips: 98,
    createdAt: '2023-05-10T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 4,
    code: 'GD004',
    nameTh: 'วรรณา สุขสบาย',
    nameEn: 'Wanna Suksabai',
    gender: 'female',
    phone: '084-567-8901',
    email: 'wanna.s@example.com',
    address: '321 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
    branchId: 1,
    status: 'inactive',
    joinDate: '2023-07-01',
    languages: ['TH', 'EN'],
    rating: 4.6,
    totalTrips: 45,
    createdAt: '2023-07-01T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 5,
    code: 'GD005',
    nameTh: 'ธนา พลอยงาม',
    nameEn: 'Thana Ploynam',
    gender: 'male',
    phone: '085-678-9012',
    email: 'thana.p@example.com',
    address: '654 ถนนเพชรบุรี แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ 10400',
    branchId: 2,
    status: 'active',
    joinDate: '2023-09-15',
    languages: ['TH', 'EN', 'KR'],
    rating: 4.9,
    totalTrips: 134,
    createdAt: '2023-09-15T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  }
]

// ข้อมูลพนักงานขาย
export const salesData = [
  {
    id: 1,
    code: 'SL001',
    nameTh: 'กมลทิพย์ ขายดี',
    nameEn: 'Kamoltip Khaydee',
    gender: 'female',
    phone: '086-111-2222',
    email: 'kamoltip.k@example.com',
    address: '111 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
    branchId: 1,
    status: 'active',
    joinDate: '2022-06-01',
    salesTarget: 500000,
    totalSales: 2340000,
    commission: 35000,
    rating: 4.8,
    createdAt: '2022-06-01T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 2,
    code: 'SL002',
    nameTh: 'ภาณุพงศ์ รุ่งเรือง',
    nameEn: 'Panupong Rungruang',
    gender: 'male',
    phone: '087-222-3333',
    email: 'panupong.r@example.com',
    address: '222 ถนนอโศก แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    branchId: 1,
    status: 'active',
    joinDate: '2022-08-15',
    salesTarget: 600000,
    totalSales: 3120000,
    commission: 46800,
    rating: 4.9,
    createdAt: '2022-08-15T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 3,
    code: 'SL003',
    nameTh: 'นิภา สวยงาม',
    nameEn: 'Nipa Suayngam',
    gender: 'female',
    phone: '088-333-4444',
    email: 'nipa.s@example.com',
    address: '333 ถนนพระราม 3 แขวงบางโพงพาง เขตยานนาวา กรุงเทพฯ 10120',
    branchId: 2,
    status: 'active',
    joinDate: '2022-10-01',
    salesTarget: 550000,
    totalSales: 2890000,
    commission: 43350,
    rating: 4.7,
    createdAt: '2022-10-01T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 4,
    code: 'SL004',
    nameTh: 'วิชัย เจริญสุข',
    nameEn: 'Wichai Charoensuk',
    gender: 'male',
    phone: '089-444-5555',
    email: 'wichai.c@example.com',
    address: '444 ถนนลาดพร้าว แขวงจันทรเกษม เขตจตุจักร กรุงเทพฯ 10900',
    branchId: 2,
    status: 'active',
    joinDate: '2023-01-10',
    salesTarget: 450000,
    totalSales: 1980000,
    commission: 29700,
    rating: 4.6,
    createdAt: '2023-01-10T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 5,
    code: 'SL005',
    nameTh: 'ชญานิศ ทองคำ',
    nameEn: 'Chayanit Thongkham',
    gender: 'female',
    phone: '090-555-6666',
    email: 'chayanit.t@example.com',
    address: '555 ถนนบางนา-ตราด แขวงบางนา เขตบางนา กรุงเทพฯ 10260',
    branchId: 1,
    status: 'inactive',
    joinDate: '2023-03-20',
    salesTarget: 400000,
    totalSales: 890000,
    commission: 13350,
    rating: 4.4,
    createdAt: '2023-03-20T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 6,
    code: 'SL006',
    nameTh: 'รัตนา เพชรงาม',
    nameEn: 'Rattana Phetngam',
    gender: 'female',
    phone: '091-666-7777',
    email: 'rattana.p@example.com',
    address: '666 ถนนพระราม 9 แขวงสวนหลวง เขตสวนหลวง กรุงเทพฯ 10250',
    branchId: 1,
    status: 'active',
    joinDate: '2023-06-01',
    salesTarget: 520000,
    totalSales: 2650000,
    commission: 39750,
    rating: 4.8,
    createdAt: '2023-06-01T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  }
]

// ข้อมูลคนขับรถ
export const driversData = [
  {
    id: 1,
    code: 'DV001',
    nameTh: 'สมศักดิ์ ขับดี',
    nameEn: 'Somsak Khubdee',
    gender: 'male',
    phone: '092-111-2222',
    email: 'somsak.k@example.com',
    address: '777 ถนนวิภาวดีรังสิต แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900',
    branchId: 1,
    status: 'active',
    joinDate: '2022-03-01',
    licenseNumber: 'BK-123456',
    licenseExpiry: '2027-03-01',
    vehicleAssigned: 'รถตู้ Toyota Commuter - ABC-1234',
    totalTrips: 567,
    rating: 4.9,
    createdAt: '2022-03-01T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 2,
    code: 'DV002',
    nameTh: 'ประยุทธ์ รักษ์ดี',
    nameEn: 'Prayuth Rukdee',
    gender: 'male',
    phone: '093-222-3333',
    email: 'prayuth.r@example.com',
    address: '888 ถนนบรมราชชนนี แขวงบางบำหรุ เขตบางพลัด กรุงเทพฯ 10700',
    branchId: 1,
    status: 'active',
    joinDate: '2022-05-15',
    licenseNumber: 'BK-234567',
    licenseExpiry: '2027-05-15',
    vehicleAssigned: 'รถเก๋ง Honda Accord - XYZ-5678',
    totalTrips: 432,
    rating: 4.8,
    createdAt: '2022-05-15T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 3,
    code: 'DV003',
    nameTh: 'วิรัตน์ ปลอดภัย',
    nameEn: 'Wirat Plodphai',
    gender: 'male',
    phone: '094-333-4444',
    email: 'wirat.p@example.com',
    address: '999 ถนนรามอินทรา แขวงท่าแร้ง เขตบางเขน กรุงเทพฯ 10220',
    branchId: 2,
    status: 'active',
    joinDate: '2022-08-01',
    licenseNumber: 'CM-345678',
    licenseExpiry: '2027-08-01',
    vehicleAssigned: 'รถตู้ Nissan Urvan - DEF-9012',
    totalTrips: 389,
    rating: 4.7,
    createdAt: '2022-08-01T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 4,
    code: 'DV004',
    nameTh: 'สุรชัย มั่นคง',
    nameEn: 'Surachai Munkong',
    gender: 'male',
    phone: '095-444-5555',
    email: 'surachai.m@example.com',
    address: '101 ถนนเทพารักษ์ แขวงบางนา เขตบางนา กรุงเทพฯ 10260',
    branchId: 2,
    status: 'active',
    joinDate: '2023-02-01',
    licenseNumber: 'CM-456789',
    licenseExpiry: '2028-02-01',
    vehicleAssigned: 'รถเก๋ง Toyota Camry - GHI-3456',
    totalTrips: 234,
    rating: 4.8,
    createdAt: '2023-02-01T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  },
  {
    id: 5,
    code: 'DV005',
    nameTh: 'ชาติชาย ใจสู้',
    nameEn: 'Chatichai Jaisoo',
    gender: 'male',
    phone: '096-555-6666',
    email: 'chatichai.j@example.com',
    address: '202 ถนนเพชรเกษม แขวงบางแค เขตบางแค กรุงเทพฯ 10160',
    branchId: 1,
    status: 'inactive',
    joinDate: '2023-05-10',
    licenseNumber: 'BK-567890',
    licenseExpiry: '2028-05-10',
    vehicleAssigned: null,
    totalTrips: 78,
    rating: 4.5,
    createdAt: '2023-05-10T08:00:00Z',
    updatedAt: '2024-11-02T10:30:00Z'
  }
]

// Gender options
export const genderOptions = [
  { value: 'male', labelTh: 'ชาย', labelEn: 'Male' },
  { value: 'female', labelTh: 'หญิง', labelEn: 'Female' },
  { value: 'other', labelTh: 'อื่นๆ', labelEn: 'Other' }
]

// Status options
export const statusOptions = [
  { value: 'active', labelTh: 'ทำงาน', labelEn: 'Active' },
  { value: 'inactive', labelTh: 'ไม่ทำงาน', labelEn: 'Inactive' }
]

// Language options (for Guides)
export const languageOptions = [
  { value: 'TH', labelTh: 'ไทย', labelEn: 'Thai' },
  { value: 'EN', labelTh: 'อังกฤษ', labelEn: 'English' },
  { value: 'CN', labelTh: 'จีน', labelEn: 'Chinese' },
  { value: 'JP', labelTh: 'ญี่ปุ่น', labelEn: 'Japanese' },
  { value: 'KR', labelTh: 'เกาหลี', labelEn: 'Korean' },
  { value: 'FR', labelTh: 'ฝรั่งเศส', labelEn: 'French' },
  { value: 'DE', labelTh: 'เยอรมัน', labelEn: 'German' }
]

// Helper functions
export const getWorkerById = (workerType, id) => {
  let data = []

  switch (workerType) {
    case 'guide':
      data = guidesData
      break
    case 'sales':
      data = salesData
      break
    case 'driver':
      data = driversData
      break
    default:
      return null
  }

  return data.find(worker => worker.id === id)
}

export const getWorkerByCode = (workerType, code) => {
  let data = []

  switch (workerType) {
    case 'guide':
      data = guidesData
      break
    case 'sales':
      data = salesData
      break
    case 'driver':
      data = driversData
      break
    default:
      return null
  }

  return data.find(worker => worker.code === code)
}

export const generateWorkerCode = (workerType) => {
  let prefix = ''
  let data = []

  switch (workerType) {
    case 'guide':
      prefix = 'GD'
      data = guidesData
      break
    case 'sales':
      prefix = 'SL'
      data = salesData
      break
    case 'driver':
      prefix = 'DV'
      data = driversData
      break
    default:
      return null
  }

  const maxId = data.length > 0 ? Math.max(...data.map(w => w.id)) : 0
  const newId = maxId + 1

  return `${prefix}${String(newId).padStart(3, '0')}`
}
