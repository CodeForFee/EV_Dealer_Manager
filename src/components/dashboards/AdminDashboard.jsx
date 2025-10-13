import { Routes, Route, useLocation } from 'react-router-dom'
import { Row, Col, Card, Table, Badge, Button } from 'react-bootstrap'
import { mockUsers, mockDealers, mockVehicles, mockOrders } from '../../data/mockData'
import DealerManagement from './admin/DealerManagement'
import VehicleManagement from './admin/VehicleManagement'
import UserManagement from './admin/UserManagement'
import Reports from './admin/Reports'
import Settings from './admin/Settings'
import Profile from '../Profile'

const AdminDashboard = () => {
  const location = useLocation()
  const totalUsers = mockUsers.length
  const totalDealers = mockDealers.length
  const totalVehicles = mockVehicles.length
  const totalOrders = mockOrders.length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total_amount, 0)

  // If on a specific route, render that component
  if (location.pathname !== '/dashboard') {
    return (
      <Routes>
        <Route path="/dealers" element={<DealerManagement />} />
        <Route path="/vehicles" element={<VehicleManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Dashboard Quản trị viên</h2>
        <Button variant="primary" className="ev-button">
          📊 Báo cáo chi tiết
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">👥</div>
              <h3 className="text-primary">{totalUsers}</h3>
              <p className="text-muted mb-0">Tổng người dùng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🏢</div>
              <h3 className="text-primary">{totalDealers}</h3>
              <p className="text-muted mb-0">Đại lý</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🚗</div>
              <h3 className="text-primary">{totalVehicles}</h3>
              <p className="text-muted mb-0">Sản phẩm</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">💰</div>
              <h3 className="text-primary">{totalOrders}</h3>
              <p className="text-muted mb-0">Đơn hàng</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Recent Orders */}
        <Col lg={8}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📋 Đơn hàng gần đây</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Đại lý</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>Khách hàng {order.customer_id}</td>
                      <td>Đại lý {order.dealer_id}</td>
                      <td>{order.total_amount.toLocaleString('vi-VN')} VNĐ</td>
                      <td>
                        <Badge bg={order.status === 'pending' ? 'warning' : 'success'}>
                          {order.status === 'pending' ? 'Chờ xử lý' : 'Đang xử lý'}
                        </Badge>
                      </td>
                      <td>{new Date(order.order_date).toLocaleDateString('vi-VN')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* System Overview */}
        <Col lg={4}>
          <Card className="ev-card mb-4">
            <Card.Header>
              <h5 className="mb-0">📊 Tổng quan hệ thống</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Doanh thu tổng:</span>
                  <strong className="text-primary">
                    {totalRevenue.toLocaleString('vi-VN')} VNĐ
                  </strong>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Đơn hàng trung bình:</span>
                  <strong>
                    {Math.round(totalRevenue / totalOrders).toLocaleString('vi-VN')} VNĐ
                  </strong>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Tỷ lệ chuyển đổi:</span>
                  <strong className="text-success">85%</strong>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🚀 Hành động nhanh</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="sm">
                  ➕ Thêm đại lý mới
                </Button>
                <Button variant="outline-primary" size="sm">
                  👥 Quản lý người dùng
                </Button>
                <Button variant="outline-primary" size="sm">
                  🚗 Thêm sản phẩm
                </Button>
                <Button variant="outline-primary" size="sm">
                  📊 Xem báo cáo
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboard
