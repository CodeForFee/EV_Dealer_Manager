import { Routes, Route, useLocation } from 'react-router-dom'
import { Row, Col, Card, Table, Badge, Button, ProgressBar } from 'react-bootstrap'
import { mockOrders, mockCustomers, mockVehicles, mockTestDrives } from '../../data/mockData'
import SalesManagement from './dealer/SalesManagement'
import CustomerManagement from './dealer/CustomerManagement'
import StaffManagement from './dealer/StaffManagement'
import RevenueReports from './dealer/RevenueReports'
import InventoryManagement from './dealer/InventoryManagement'
import Profile from '../Profile'

const DealerManagerDashboard = () => {
  const location = useLocation()

  // If on a specific route, render that component
  if (location.pathname !== '/dashboard') {
    return (
      <Routes>
        <Route path="/sales" element={<SalesManagement />} />
        <Route path="/customers" element={<CustomerManagement />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/reports" element={<RevenueReports />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    )
  }
  const totalOrders = mockOrders.length
  const totalCustomers = mockCustomers.length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total_amount, 0)
  const paidAmount = mockOrders.reduce((sum, order) => sum + order.paid_amount, 0)
  const pendingAmount = totalRevenue - paidAmount
  const totalTestDrives = mockTestDrives.length

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Dashboard Quản lý đại lý</h2>
        <Button variant="primary" className="ev-button">
          📊 Báo cáo doanh thu
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">💰</div>
              <h3 className="text-primary">{totalOrders}</h3>
              <p className="text-muted mb-0">Đơn hàng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">👥</div>
              <h3 className="text-primary">{totalCustomers}</h3>
              <p className="text-muted mb-0">Khách hàng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">💵</div>
              <h3 className="text-primary">{(totalRevenue / 1000000000).toFixed(1)}B</h3>
              <p className="text-muted mb-0">Doanh thu (VNĐ)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🚙</div>
              <h3 className="text-primary">{totalTestDrives}</h3>
              <p className="text-muted mb-0">Lái thử</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Sales Overview */}
        <Col lg={8}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">💰 Tổng quan bán hàng</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>ID Đơn hàng</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Đã thanh toán</th>
                    <th>Còn lại</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>Khách hàng {order.customer_id}</td>
                      <td>{order.total_amount.toLocaleString('vi-VN')} VNĐ</td>
                      <td>{order.paid_amount.toLocaleString('vi-VN')} VNĐ</td>
                      <td>{order.remaining_amount.toLocaleString('vi-VN')} VNĐ</td>
                      <td>
                        <Badge bg={order.status === 'pending' ? 'warning' : 'success'}>
                          {order.status === 'pending' ? 'Chờ xử lý' : 'Đang xử lý'}
                        </Badge>
                      </td>
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

        {/* Revenue & Quick Actions */}
        <Col lg={4}>
          <Card className="ev-card mb-4">
            <Card.Header>
              <h5 className="mb-0">💵 Tình hình thanh toán</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Đã thanh toán:</span>
                  <strong className="text-success">
                    {paidAmount.toLocaleString('vi-VN')} VNĐ
                  </strong>
                </div>
                <ProgressBar 
                  now={(paidAmount / totalRevenue) * 100} 
                  variant="success"
                  className="mb-2"
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Còn lại:</span>
                  <strong className="text-warning">
                    {pendingAmount.toLocaleString('vi-VN')} VNĐ
                  </strong>
                </div>
                <ProgressBar 
                  now={(pendingAmount / totalRevenue) * 100} 
                  variant="warning"
                  className="mb-2"
                />
              </div>
              <div className="text-center">
                <small className="text-muted">
                  Tỷ lệ thu hồi: {((paidAmount / totalRevenue) * 100).toFixed(1)}%
                </small>
              </div>
            </Card.Body>
          </Card>

          <Card className="ev-card mb-4">
            <Card.Header>
              <h5 className="mb-0">👥 Khách hàng gần đây</h5>
            </Card.Header>
            <Card.Body>
              {mockCustomers.map((customer) => (
                <div key={customer.id} className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong>{customer.full_name}</strong>
                    <br />
                    <small className="text-muted">{customer.phone}</small>
                  </div>
                  <Badge bg="info">Mới</Badge>
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
                  ➕ Tạo đơn hàng mới
                </Button>
                <Button variant="outline-primary" size="sm">
                  👥 Quản lý khách hàng
                </Button>
                <Button variant="outline-primary" size="sm">
                  👨‍💼 Quản lý nhân viên
                </Button>
                <Button variant="outline-primary" size="sm">
                  📊 Báo cáo doanh thu
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DealerManagerDashboard
