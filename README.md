# Electric Vehicle Dealer Management System

Hệ thống quản lý bán xe điện thông qua kênh đại lý - Phần mềm quản lý toàn diện cho đại lý xe điện.

## 🚗 Tính năng chính

### 1. Chức năng cho Đại lý (Dealer Staff, Dealer Manager)
- **Truy vấn thông tin xe**: Xem danh mục xe, cấu hình, giá bán, so sánh mẫu xe
- **Quản lý bán hàng**: Tạo báo giá, đơn hàng, hợp đồng, quản lý khuyến mãi
- **Quản lý khách hàng**: Lưu trữ hồ sơ, quản lý lịch hẹn lái thử, xử lý phản hồi
- **Báo cáo**: Doanh số theo nhân viên, báo cáo công nợ

### 2. Chức năng cho Hãng xe (EVM Staff, Admin)
- **Quản lý sản phẩm**: Danh mục xe điện, tồn kho, điều phối cho đại lý
- **Quản lý đại lý**: Hợp đồng, chỉ tiêu doanh số, tài khoản đại lý
- **Báo cáo & phân tích**: Doanh số theo khu vực, tồn kho, tốc độ tiêu thụ

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 19.1.1 + Vite
- **UI Framework**: React Bootstrap 5
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Styling**: Custom CSS với theme đỏ-đen

## 🚀 Cài đặt và chạy

1. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

2. **Chạy ứng dụng**:
   ```bash
   npm run dev
   ```

3. **Truy cập ứng dụng**:
   - Mở trình duyệt và truy cập `http://localhost:5173`

## 👥 Tài khoản demo

| Vai trò | Tên đăng nhập | Mật khẩu | Mô tả |
|---------|---------------|----------|-------|
| Admin | admin | admin123 | Quản trị viên hệ thống |
| EVM Staff | evm_staff | evm123 | Nhân viên hãng xe |
| Dealer Manager | dealer_manager | manager123 | Quản lý đại lý |
| Dealer Staff | dealer_staff | staff123 | Nhân viên đại lý |

## 📊 Cấu trúc dữ liệu

Hệ thống được thiết kế dựa trên database schema với các bảng chính:

- **User**: Quản lý người dùng và phân quyền
- **Dealer**: Thông tin đại lý
- **Vehicle**: Danh mục xe điện
- **Customer**: Thông tin khách hàng
- **Order**: Đơn hàng và thanh toán
- **Inventory**: Quản lý tồn kho
- **TestDrive**: Lịch hẹn lái thử
- **Feedback**: Phản hồi khách hàng

## 🎨 Giao diện

- **Theme**: Đỏ-đen chuyên nghiệp
- **Responsive**: Tương thích mobile và desktop
- **Modern UI**: Sử dụng React Bootstrap với custom styling
- **Dashboard**: Giao diện dashboard riêng cho từng vai trò

## 📱 Tính năng theo vai trò

### Admin Dashboard
- Tổng quan hệ thống
- Quản lý đại lý và người dùng
- Báo cáo tổng hợp
- Cài đặt hệ thống

### EVM Staff Dashboard
- Quản lý sản phẩm và tồn kho
- Phân phối xe cho đại lý
- Báo cáo sản phẩm
- Quản lý đơn đặt hàng

### Dealer Manager Dashboard
- Quản lý bán hàng và doanh thu
- Quản lý khách hàng và nhân viên
- Báo cáo doanh thu
- Quản lý tồn kho đại lý

### Dealer Staff Dashboard
- Bán hàng và tạo đơn hàng
- Quản lý khách hàng
- Đặt lịch lái thử
- Báo cáo cá nhân

## 🔧 Scripts

- `npm run dev`: Chạy development server
- `npm run build`: Build production
- `npm run preview`: Preview production build
- `npm run lint`: Chạy ESLint

## 📄 License

© 2024 EV Dealer Management System. All rights reserved.