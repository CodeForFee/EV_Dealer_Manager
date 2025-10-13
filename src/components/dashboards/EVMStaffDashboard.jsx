import { Routes, Route, useLocation } from 'react-router-dom'
import { Row, Col, Card, Table, Badge, Button, ProgressBar } from 'react-bootstrap'
import { mockVehicles, mockInventory, mockOrders } from '../../data/mockData'
import InventoryManagement from './evm/InventoryManagement'
import OrderManagement from './evm/OrderManagement'
import VehicleManagement from './evm/VehicleManagement'
import DealerManagement from './evm/DealerManagement'
import ProductReports from './evm/ProductReports'
import PricingManagement from './evm/PricingManagement'
import PromotionManagement from './evm/PromotionManagement'
import DebtManagement from './evm/DebtManagement'
import Profile from '../Profile'

const EVMStaffDashboard = () => {
  const location = useLocation()

  // If on a specific route, render that component
  if (location.pathname !== '/dashboard') {
    return (
      <Routes>
        <Route path="/vehicles" element={<VehicleManagement />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/dealers" element={<DealerManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/reports" element={<ProductReports />} />
        <Route path="/pricing" element={<PricingManagement />} />
        <Route path="/promotions" element={<PromotionManagement />} />
        <Route path="/debt-management" element={<DebtManagement />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    )
  }
  const totalVehicles = mockVehicles.length
  const totalInventory = mockInventory.reduce((sum, inv) => sum + inv.available_quantity, 0)
  const reservedInventory = mockInventory.reduce((sum, inv) => sum + inv.reserved_quantity, 0)
  const totalOrders = mockOrders.length

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Dashboard EVM Staff</h2>
        <Button variant="primary" className="ev-button">
          📊 Báo cáo sản phẩm
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🚗</div>
              <h3 className="text-primary">{totalVehicles}</h3>
              <p className="text-muted mb-0">Mẫu xe</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">📦</div>
              <h3 className="text-primary">{totalInventory}</h3>
              <p className="text-muted mb-0">Tồn kho</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🔒</div>
              <h3 className="text-primary">{reservedInventory}</h3>
              <p className="text-muted mb-0">Đã đặt</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">📋</div>
              <h3 className="text-primary">{totalOrders}</h3>
              <p className="text-muted mb-0">Đơn đặt hàng</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Vehicle Management */}
        <Col lg={8}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🚗 Quản lý sản phẩm</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Mẫu xe</th>
                    <th>Thương hiệu</th>
                    <th>Năm</th>
                    <th>Giá bán</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {mockVehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>
                        <strong>{vehicle.model_name}</strong>
                        <br />
                        <small className="text-muted">{vehicle.version}</small>
                      </td>
                      <td>{vehicle.brand}</td>
                      <td>{vehicle.year}</td>
                      <td>{vehicle.listed_price.toLocaleString('vi-VN')} VNĐ</td>
                      <td>
                        <Badge bg="success">Hoạt động</Badge>
                      </td>
                      <td>
                        <Button size="sm" variant="outline-primary">
                          Chỉnh sửa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Inventory Status */}
        <Col lg={4}>
          <Card className="ev-card mb-4">
            <Card.Header>
              <h5 className="mb-0">📦 Tình trạng tồn kho</h5>
            </Card.Header>
            <Card.Body>
              {mockInventory.map((inv) => {
                const vehicle = mockVehicles.find(v => v.id === inv.vehicle_id)
                const total = inv.available_quantity + inv.reserved_quantity
                const percentage = total > 0 ? (inv.available_quantity / total) * 100 : 0
                
                return (
                  <div key={inv.id} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="fw-bold">{vehicle?.model_name}</small>
                      <small>{inv.available_quantity}/{total}</small>
                    </div>
                    <ProgressBar 
                      now={percentage} 
                      variant={percentage > 50 ? 'success' : percentage > 25 ? 'warning' : 'danger'}
                      className="mb-2"
                    />
                  </div>
                )
              })}
            </Card.Body>
          </Card>

          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">⚡ Hành động nhanh</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="sm">
                  ➕ Thêm mẫu xe mới
                </Button>
                <Button variant="outline-primary" size="sm">
                  📦 Cập nhật tồn kho
                </Button>
                <Button variant="outline-primary" size="sm">
                  🏢 Phân phối cho đại lý
                </Button>
                <Button variant="outline-primary" size="sm">
                  📊 Báo cáo tồn kho
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EVMStaffDashboard
