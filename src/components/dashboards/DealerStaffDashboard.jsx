import { Routes, Route, useLocation } from 'react-router-dom'
import { Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap'
import { mockVehicles, mockCustomers, mockOrders, mockTestDrives } from '../../data/mockData'
import Sales from './staff/Sales'
import TestDrives from './staff/TestDrives'
import Customers from './staff/Customers'
import Products from './staff/Products'
import PersonalReports from './staff/PersonalReports'
import Profile from '../Profile'

const DealerStaffDashboard = () => {
  const location = useLocation()

  // If on a specific route, render that component
  if (location.pathname !== '/dashboard') {
    return (
      <Routes>
        <Route path="/sales" element={<Sales />} />
        <Route path="/test-drives" element={<TestDrives />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/reports" element={<PersonalReports />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    )
  }
  const myOrders = mockOrders.filter(order => order.user_id === 4) // Assuming user_id 4 is dealer staff
  const myCustomers = mockCustomers
  const myTestDrives = mockTestDrives.filter(td => td.user_id === 4)
  const myRevenue = myOrders.reduce((sum, order) => sum + order.total_amount, 0)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Dashboard Nhân viên đại lý</h2>
        <Button variant="primary" className="ev-button">
          ➕ Tạo đơn hàng mới
        </Button>
      </div>

      {/* Welcome Message */}
      <Alert variant="info" className="mb-4">
        <h5>👋 Chào mừng trở lại!</h5>
        <p className="mb-0">
          Hôm nay bạn có {myOrders.length} đơn hàng cần xử lý và {myTestDrives.length} lịch hẹn lái thử.
        </p>
      </Alert>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">💰</div>
              <h3 className="text-primary">{myOrders.length}</h3>
              <p className="text-muted mb-0">Đơn hàng của tôi</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">👥</div>
              <h3 className="text-primary">{myCustomers.length}</h3>
              <p className="text-muted mb-0">Khách hàng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">💵</div>
              <h3 className="text-primary">{(myRevenue / 1000000).toFixed(0)}M</h3>
              <p className="text-muted mb-0">Doanh thu (VNĐ)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🚙</div>
              <h3 className="text-primary">{myTestDrives.length}</h3>
              <p className="text-muted mb-0">Lái thử</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* My Orders */}
        <Col lg={8}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📋 Đơn hàng của tôi</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {myOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>Khách hàng {order.customer_id}</td>
                      <td>{order.total_amount.toLocaleString('vi-VN')} VNĐ</td>
                      <td>
                        <Badge bg={order.status === 'pending' ? 'warning' : 'success'}>
                          {order.status === 'pending' ? 'Chờ xử lý' : 'Đang xử lý'}
                        </Badge>
                      </td>
                      <td>{new Date(order.order_date).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <Button size="sm" variant="outline-primary">
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions & Test Drives */}
        <Col lg={4}>
          <Card className="ev-card mb-4">
            <Card.Header>
              <h5 className="mb-0">🚙 Lịch hẹn lái thử</h5>
            </Card.Header>
            <Card.Body>
              {myTestDrives.length > 0 ? (
                myTestDrives.map((testDrive) => {
                  const vehicle = mockVehicles.find(v => v.id === testDrive.vehicle_id)
                  return (
                    <div key={testDrive.id} className="mb-3 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{vehicle?.model_name}</strong>
                          <br />
                          <small className="text-muted">
                            {new Date(testDrive.scheduled_datetime).toLocaleString('vi-VN')}
                          </small>
                          <br />
                          <small className="text-muted">{testDrive.location}</small>
                        </div>
                        <Badge bg="info">Đã lên lịch</Badge>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-muted text-center">Chưa có lịch hẹn nào</p>
              )}
            </Card.Body>
          </Card>

          <Card className="ev-card mb-4">
            <Card.Header>
              <h5 className="mb-0">🚗 Sản phẩm nổi bật</h5>
            </Card.Header>
            <Card.Body>
              {mockVehicles.slice(0, 3).map((vehicle) => (
                <div key={vehicle.id} className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong>{vehicle.brand} {vehicle.model_name}</strong>
                    <br />
                    <small className="text-muted">{vehicle.specifications.range}</small>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-primary">
                      {(vehicle.listed_price / 1000000).toFixed(0)}M VNĐ
                    </div>
                    <Button size="sm" variant="outline-primary">
                      Chi tiết
                    </Button>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">⚡ Hành động nhanh</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="sm">
                  ➕ Tạo báo giá mới
                </Button>
                <Button variant="outline-primary" size="sm">
                  👥 Thêm khách hàng
                </Button>
                <Button variant="outline-primary" size="sm">
                  🚙 Đặt lịch lái thử
                </Button>
                <Button variant="outline-primary" size="sm">
                  📊 Báo cáo cá nhân
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DealerStaffDashboard
