// Mock data for EV Dealer Management System

export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@evdealer.com',
    full_name: 'System Administrator',
    role: 'admin',
    dealer_id: null,
    status: 'active'
  },
  {
    id: 2,
    username: 'evm_staff',
    password: 'evm123',
    email: 'evm@evdealer.com',
    full_name: 'EVM Staff User',
    role: 'evm_staff',
    dealer_id: null,
    status: 'active'
  },
  {
    id: 3,
    username: 'dealer_manager',
    password: 'manager123',
    email: 'manager@dealer1.com',
    full_name: 'Dealer Manager',
    role: 'dealer_manager',
    dealer_id: 1,
    status: 'active'
  },
  {
    id: 4,
    username: 'dealer_staff',
    password: 'staff123',
    email: 'staff@dealer1.com',
    full_name: 'Dealer Staff',
    role: 'dealer_staff',
    dealer_id: 1,
    status: 'active'
  }
]

export const mockDealers = [
  {
    id: 1,
    name: 'EV Dealer Hà Nội',
    address: '123 Đường Láng, Đống Đa, Hà Nội',
    phone: '024-1234-5678',
    representative_name: 'Nguyễn Văn A',
    region: 'Miền Bắc',
    status: 'active'
  },
  {
    id: 2,
    name: 'EV Dealer TP.HCM',
    address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '028-8765-4321',
    representative_name: 'Trần Thị B',
    region: 'Miền Nam',
    status: 'active'
  }
]

export const mockVehicleTypes = [
  {
    id: 1,
    type_name: 'Sedan',
    description: 'Xe sedan điện',
    status: 'active'
  },
  {
    id: 2,
    type_name: 'SUV',
    description: 'Xe SUV điện',
    status: 'active'
  },
  {
    id: 3,
    type_name: 'Hatchback',
    description: 'Xe hatchback điện',
    status: 'active'
  }
]

export const mockVehicles = [
  {
    id: 1,
    model_name: 'Tesla Model 3',
    brand: 'Tesla',
    year: 2024,
    vehicle_type_id: 1,
    specifications: {
      range: '500km',
      acceleration: '3.1s 0-100km/h',
      top_speed: '261km/h',
      charging_time: '15 phút (Supercharger)'
    },
    status: 'active',
    battery_capacity: 75,
    listed_price: 1500000000,
    version: 'Long Range',
    available_colors: ['Đen', 'Trắng', 'Xám', 'Đỏ']
  },
  {
    id: 2,
    model_name: 'Tesla Model Y',
    brand: 'Tesla',
    year: 2024,
    vehicle_type_id: 2,
    specifications: {
      range: '480km',
      acceleration: '3.5s 0-100km/h',
      top_speed: '250km/h',
      charging_time: '15 phút (Supercharger)'
    },
    status: 'active',
    battery_capacity: 75,
    listed_price: 1800000000,
    version: 'Performance',
    available_colors: ['Đen', 'Trắng', 'Xám', 'Xanh']
  },
  {
    id: 3,
    model_name: 'BYD Atto 3',
    brand: 'BYD',
    year: 2024,
    vehicle_type_id: 2,
    specifications: {
      range: '480km',
      acceleration: '7.3s 0-100km/h',
      top_speed: '160km/h',
      charging_time: '30 phút (DC Fast)'
    },
    status: 'active',
    battery_capacity: 60,
    listed_price: 800000000,
    version: 'Standard',
    available_colors: ['Trắng', 'Xám', 'Xanh', 'Đỏ']
  },
  {
    id: 4,
    model_name: 'VinFast VF8',
    brand: 'VinFast',
    year: 2024,
    vehicle_type_id: 2,
    specifications: {
      range: '450km',
      acceleration: '5.5s 0-100km/h',
      top_speed: '200km/h',
      charging_time: '25 phút (DC Fast)'
    },
    status: 'active',
    battery_capacity: 87,
    listed_price: 1200000000,
    version: 'Plus',
    available_colors: ['Đen', 'Trắng', 'Xám', 'Bạc']
  }
]

export const mockCustomers = [
  {
    id: 1,
    full_name: 'Nguyễn Văn Khách',
    phone: '0901234567',
    email: 'khach1@email.com',
    citizen_id: '123456789',
    dealer_id: 1
  },
  {
    id: 2,
    full_name: 'Trần Thị Mua',
    phone: '0907654321',
    email: 'khach2@email.com',
    citizen_id: '987654321',
    dealer_id: 1
  }
]

export const mockQuotes = [
  {
    id: 1,
    customer_id: 1,
    user_id: 4,
    created_date: '2024-01-15',
    total_amount: 1500000000,
    status: 'pending',
    valid_until: '2024-02-15'
  },
  {
    id: 2,
    customer_id: 2,
    user_id: 4,
    created_date: '2024-01-20',
    total_amount: 1800000000,
    status: 'accepted',
    valid_until: '2024-02-20'
  }
]

export const mockOrders = [
  {
    id: 1,
    quote_id: 1,
    customer_id: 1,
    dealer_id: 1,
    user_id: 4,
    order_date: '2024-01-15',
    total_amount: 1500000000,
    paid_amount: 0,
    remaining_amount: 1500000000,
    status: 'pending',
    payment_method: 'installment',
    notes: 'Khách hàng muốn trả góp 12 tháng'
  },
  {
    id: 2,
    quote_id: 2,
    customer_id: 2,
    dealer_id: 1,
    user_id: 4,
    order_date: '2024-01-20',
    total_amount: 1800000000,
    paid_amount: 900000000,
    remaining_amount: 900000000,
    status: 'processing',
    payment_method: 'installment',
    notes: 'Đã thanh toán 50%'
  }
]

export const mockInventory = [
  {
    id: 1,
    dealer_id: 1,
    inventory_type: 'available',
    vehicle_id: 1,
    available_quantity: 5,
    reserved_quantity: 2,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 2,
    dealer_id: 1,
    inventory_type: 'available',
    vehicle_id: 2,
    available_quantity: 3,
    reserved_quantity: 1,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 3,
    dealer_id: 1,
    inventory_type: 'available',
    vehicle_id: 3,
    available_quantity: 8,
    reserved_quantity: 0,
    last_updated: '2024-01-20T10:00:00Z'
  }
]

export const mockTestDrives = [
  {
    id: 1,
    customer_id: 1,
    vehicle_id: 1,
    vin: 'TESLA123456789',
    user_id: 4,
    scheduled_datetime: '2024-01-25T14:00:00Z',
    location: 'Showroom Hà Nội',
    status: 'scheduled',
    result: null,
    notes: null
  }
]

export const mockPromotions = [
  {
    id: 1,
    program_name: 'Khuyến mãi Tết 2024',
    description: 'Giảm giá 5% cho tất cả xe điện',
    start_date: '2024-01-01',
    end_date: '2024-02-29',
    conditions: 'Áp dụng cho khách hàng mới',
    discount_value: 5,
    discount_type: 'percentage',
    status: 'active',
    created_by: 1
  }
]

