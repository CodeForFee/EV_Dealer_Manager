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
    username: 'evm',
    password: 'evm123',
    email: 'evm@evdealer.com',
    full_name: 'EVM Staff User',
    role: 'evm_staff',
    dealer_id: null,
    status: 'active'
  },
  {
    id: 3,
    username: 'manager',
    password: 'manager123',
    email: 'manager@dealer1.com',
    full_name: 'Dealer Manager',
    role: 'dealer_manager',
    dealer_id: 1,
    status: 'active'
  },
  {
    id: 4,
    username: 'staff',
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
  },
  {
    id: 5,
    model_name: 'VinFast VF9',
    brand: 'VinFast',
    year: 2024,
    vehicle_type_id: 2,
    specifications: {
      range: '550km',
      acceleration: '5.0s 0-100km/h',
      top_speed: '200km/h',
      charging_time: '22 phút (DC Fast)'
    },
    status: 'active',
    battery_capacity: 106,
    listed_price: 1500000000,
    version: 'Eco',
    available_colors: ['Đen', 'Trắng', 'Xám', 'Xanh']
  },
  {
    id: 6,
    model_name: 'Hyundai IONIQ 5',
    brand: 'Hyundai',
    year: 2024,
    vehicle_type_id: 2,
    specifications: {
      range: '480km',
      acceleration: '5.2s 0-100km/h',
      top_speed: '185km/h',
      charging_time: '18 phút (350kW)'
    },
    status: 'active',
    battery_capacity: 77.4,
    listed_price: 1100000000,
    version: 'Limited',
    available_colors: ['Đen', 'Trắng', 'Xám', 'Xanh', 'Đỏ']
  },
  {
    id: 7,
    model_name: 'Kia EV6',
    brand: 'Kia',
    year: 2024,
    vehicle_type_id: 2,
    specifications: {
      range: '528km',
      acceleration: '3.5s 0-100km/h',
      top_speed: '260km/h',
      charging_time: '18 phút (350kW)'
    },
    status: 'active',
    battery_capacity: 77.4,
    listed_price: 1300000000,
    version: 'GT',
    available_colors: ['Đen', 'Trắng', 'Xám', 'Xanh', 'Vàng']
  },
  {
    id: 8,
    model_name: 'BMW iX3',
    brand: 'BMW',
    year: 2024,
    vehicle_type_id: 2,
    specifications: {
      range: '460km',
      acceleration: '6.8s 0-100km/h',
      top_speed: '180km/h',
      charging_time: '32 phút (DC Fast)'
    },
    status: 'active',
    battery_capacity: 80,
    listed_price: 2000000000,
    version: 'Impressive',
    available_colors: ['Đen', 'Trắng', 'Xám', 'Xanh', 'Bạc']
  },
  {
    id: 9,
    model_name: 'Mercedes EQS',
    brand: 'Mercedes-Benz',
    year: 2024,
    vehicle_type_id: 1,
    specifications: {
      range: '770km',
      acceleration: '4.3s 0-100km/h',
      top_speed: '210km/h',
      charging_time: '31 phút (DC Fast)'
    },
    status: 'active',
    battery_capacity: 108,
    listed_price: 3500000000,
    version: '450+',
    available_colors: ['Đen', 'Trắng', 'Xám', 'Bạc']
  },
  {
    id: 10,
    model_name: 'Audi e-tron GT',
    brand: 'Audi',
    year: 2024,
    vehicle_type_id: 1,
    specifications: {
      range: '487km',
      acceleration: '3.3s 0-100km/h',
      top_speed: '245km/h',
      charging_time: '22 phút (DC Fast)'
    },
    status: 'active',
    battery_capacity: 93.4,
    listed_price: 2800000000,
    version: 'RS',
    available_colors: ['Đen', 'Trắng', 'Xám', 'Xanh', 'Đỏ']
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
  },
  {
    id: 4,
    dealer_id: 1,
    inventory_type: 'available',
    vehicle_id: 4,
    available_quantity: 4,
    reserved_quantity: 1,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 5,
    dealer_id: 1,
    inventory_type: 'available',
    vehicle_id: 5,
    available_quantity: 2,
    reserved_quantity: 0,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 6,
    dealer_id: 1,
    inventory_type: 'available',
    vehicle_id: 6,
    available_quantity: 6,
    reserved_quantity: 2,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 7,
    dealer_id: 1,
    inventory_type: 'available',
    vehicle_id: 7,
    available_quantity: 3,
    reserved_quantity: 1,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 8,
    dealer_id: 1,
    inventory_type: 'available',
    vehicle_id: 8,
    available_quantity: 1,
    reserved_quantity: 0,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 9,
    dealer_id: 1,
    inventory_type: 'available',
    vehicle_id: 9,
    available_quantity: 1,
    reserved_quantity: 1,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 10,
    dealer_id: 1,
    inventory_type: 'available',
    vehicle_id: 10,
    available_quantity: 2,
    reserved_quantity: 0,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 11,
    dealer_id: 2,
    inventory_type: 'available',
    vehicle_id: 1,
    available_quantity: 7,
    reserved_quantity: 3,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 12,
    dealer_id: 2,
    inventory_type: 'available',
    vehicle_id: 2,
    available_quantity: 5,
    reserved_quantity: 2,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 13,
    dealer_id: 2,
    inventory_type: 'available',
    vehicle_id: 6,
    available_quantity: 4,
    reserved_quantity: 1,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 14,
    dealer_id: 2,
    inventory_type: 'available',
    vehicle_id: 7,
    available_quantity: 3,
    reserved_quantity: 0,
    last_updated: '2024-01-20T10:00:00Z'
  },
  {
    id: 15,
    dealer_id: 2,
    inventory_type: 'available',
    vehicle_id: 8,
    available_quantity: 2,
    reserved_quantity: 1,
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
    created_by: 1,
    dealer_id: null // null = áp dụng cho tất cả đại lý
  },
  {
    id: 2,
    program_name: 'Khuyến mãi Tesla Model 3',
    description: 'Giảm giá 10% cho Tesla Model 3',
    start_date: '2024-01-15',
    end_date: '2024-03-15',
    conditions: 'Áp dụng cho khách hàng mua trả thẳng',
    discount_value: 10,
    discount_type: 'percentage',
    status: 'active',
    created_by: 1,
    dealer_id: 1
  },
  {
    id: 3,
    program_name: 'Khuyến mãi VinFast',
    description: 'Tặng phụ kiện trị giá 5 triệu VNĐ',
    start_date: '2024-02-01',
    end_date: '2024-04-30',
    conditions: 'Mua xe VinFast bất kỳ',
    discount_value: 5000000,
    discount_type: 'fixed',
    status: 'active',
    created_by: 2,
    dealer_id: null
  }
]

export const mockDealerOrders = [
  {
    id: 1,
    dealer_id: 1,
    vehicle_id: 1,
    quantity: 5,
    unit_price: 1400000000, // Giá sỉ
    total_amount: 7000000000,
    order_date: '2024-01-15',
    delivery_date: '2024-02-15',
    status: 'pending',
    notes: 'Cần giao xe trước Tết',
    created_by: 3, // Dealer Manager
    approved_by: null
  },
  {
    id: 2,
    dealer_id: 1,
    vehicle_id: 2,
    quantity: 3,
    unit_price: 1700000000,
    total_amount: 5100000000,
    order_date: '2024-01-20',
    delivery_date: '2024-02-20',
    status: 'approved',
    notes: 'Khách hàng đã đặt trước',
    created_by: 3,
    approved_by: 2
  }
]

export const mockFeedbacks = [
  {
    id: 1,
    customer_id: 1,
    dealer_id: 1,
    vehicle_id: 1,
    type: 'complaint',
    title: 'Xe có tiếng ồn lạ',
    content: 'Sau khi lái thử, tôi nghe thấy tiếng ồn lạ từ động cơ',
    rating: 2,
    status: 'pending',
    created_date: '2024-01-20',
    resolved_date: null,
    resolved_by: null
  },
  {
    id: 2,
    customer_id: 2,
    dealer_id: 1,
    vehicle_id: 2,
    type: 'feedback',
    title: 'Dịch vụ tốt',
    content: 'Nhân viên tư vấn rất nhiệt tình và chuyên nghiệp',
    rating: 5,
    status: 'resolved',
    created_date: '2024-01-18',
    resolved_date: '2024-01-19',
    resolved_by: 4
  }
]

export const mockDebts = [
  {
    id: 1,
    dealer_id: 1,
    customer_id: 1,
    order_id: 1,
    total_amount: 1500000000,
    paid_amount: 500000000,
    remaining_amount: 1000000000,
    due_date: '2024-03-15',
    status: 'overdue',
    payment_schedule: 'monthly',
    installments_remaining: 8
  },
  {
    id: 2,
    dealer_id: 1,
    customer_id: 2,
    order_id: 2,
    total_amount: 1800000000,
    paid_amount: 900000000,
    remaining_amount: 900000000,
    due_date: '2024-04-20',
    status: 'current',
    payment_schedule: 'monthly',
    installments_remaining: 6
  }
]

export const mockPricing = [
  {
    id: 1,
    vehicle_id: 1,
    dealer_id: 1,
    wholesale_price: 1400000000,
    retail_price: 1500000000,
    discount_rate: 5,
    min_order_quantity: 3,
    valid_from: '2024-01-01',
    valid_to: '2024-12-31',
    status: 'active'
  },
  {
    id: 2,
    vehicle_id: 2,
    dealer_id: 1,
    wholesale_price: 1700000000,
    retail_price: 1800000000,
    discount_rate: 3,
    min_order_quantity: 2,
    valid_from: '2024-01-01',
    valid_to: '2024-12-31',
    status: 'active'
  },
  {
    id: 3,
    vehicle_id: 3,
    dealer_id: 2,
    wholesale_price: 750000000,
    retail_price: 800000000,
    discount_rate: 7,
    min_order_quantity: 5,
    valid_from: '2024-01-01',
    valid_to: '2024-12-31',
    status: 'active'
  }
]

