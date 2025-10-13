import { useState } from 'react'
import { Row, Col, Card, Table, Button, Form, Badge, ProgressBar } from 'react-bootstrap'
import { mockOrders, mockDealers, mockVehicles, mockUsers } from '../../../data/mockData'

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedDealer, setSelectedDealer] = useState('all')

  // Calculate statistics
  const totalOrders = mockOrders.length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total_amount, 0)
  const paidAmount = mockOrders.reduce((sum, order) => sum + order.paid_amount, 0)
  const pendingAmount = totalRevenue - paidAmount
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Revenue by dealer
  const revenueByDealer = mockDealers.map(dealer => {
    const dealerOrders = mockOrders.filter(order => order.dealer_id === dealer.id)
    const dealerRevenue = dealerOrders.reduce((sum, order) => sum + order.total_amount, 0)
    return {
      ...dealer,
      orderCount: dealerOrders.length,
      revenue: dealerRevenue,
      percentage: totalRevenue > 0 ? (dealerRevenue / totalRevenue) * 100 : 0
    }
  }).sort((a, b) => b.revenue - a.revenue)

  // Top performing staff
  const staffPerformance = mockUsers
    .filter(user => user.role === 'dealer_staff' || user.role === 'dealer_manager')
    .map(user => {
      const userOrders = mockOrders.filter(order => order.user_id === user.id)
      const userRevenue = userOrders.reduce((sum, order) => sum + order.total_amount, 0)
      return {
        ...user,
        orderCount: userOrders.length,
        revenue: userRevenue
      }
    }).sort((a, b) => b.revenue - a.revenue)

  // Vehicle performance
  const vehiclePerformance = mockVehicles.map(vehicle => {
    // Mock data for vehicle sales
    const salesCount = Math.floor(Math.random() * 10) + 1
    const revenue = salesCount * vehicle.listed_price
    return {
      ...vehicle,
      salesCount,
      revenue,
      percentage: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0
    }
  }).sort((a, b) => b.revenue - a.revenue)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📊 Báo cáo tổng hợp</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" className="ev-button-outline">
            📄 Xuất PDF
          </Button>
          <Button variant="outline-primary" className="ev-button-outline">
            📊 Xuất Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="ev-card mb-4">
        <Card.Header>
          <h5 className="mb-0">🔍 Bộ lọc báo cáo</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Khoảng thời gian</Form.Label>
                <Form.Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                  <option value="quarter">Quý này</option>
                  <option value="year">Năm nay</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Đại lý</Form.Label>
                <Form.Select
                  value={selectedDealer}
                  onChange={(e) => setSelectedDealer(e.target.value)}
                >
                  <option value="all">Tất cả đại lý</option>
                  {mockDealers.map(dealer => (
                    <option key={dealer.id} value={dealer.id}>
                      {dealer.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="primary" className="ev-button w-100">
                🔄 Cập nhật báo cáo
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Key Metrics */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">💰</div>
              <h3 className="text-primary">{(totalRevenue / 1000000000).toFixed(1)}B</h3>
              <p className="text-muted mb-0">Tổng doanh thu (VNĐ)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">📋</div>
              <h3 className="text-success">{totalOrders}</h3>
              <p className="text-muted mb-0">Tổng đơn hàng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">📈</div>
              <h3 className="text-info">{averageOrderValue.toLocaleString('vi-VN')}</h3>
              <p className="text-muted mb-0">Giá trị TB/đơn (VNĐ)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">💵</div>
              <h3 className="text-warning">{((paidAmount / totalRevenue) * 100).toFixed(1)}%</h3>
              <p className="text-muted mb-0">Tỷ lệ thu hồi</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Revenue by Dealer */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🏢 Doanh thu theo đại lý</h5>
            </Card.Header>
            <Card.Body>
              {revenueByDealer.map((dealer, index) => (
                <div key={dealer.id} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold">{dealer.name}</span>
                    <span className="text-primary">
                      {dealer.revenue.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">{dealer.orderCount} đơn hàng</small>
                    <small className="text-muted">{dealer.percentage.toFixed(1)}%</small>
                  </div>
                  <ProgressBar 
                    now={dealer.percentage} 
                    variant="primary"
                    className="mb-2"
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Top Performing Staff */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">👨‍💼 Top nhân viên bán hàng</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nhân viên</th>
                    <th>Đơn hàng</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {staffPerformance.slice(0, 5).map((staff, index) => (
                    <tr key={staff.id}>
                      <td>
                        <Badge bg={index === 0 ? 'warning' : index === 1 ? 'secondary' : index === 2 ? 'success' : 'light'}>
                          {index + 1}
                        </Badge>
                      </td>
                      <td>
                        <strong>{staff.full_name}</strong>
                        <br />
                        <small className="text-muted">{staff.username}</small>
                      </td>
                      <td>{staff.orderCount}</td>
                      <td>{staff.revenue.toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-4">
        {/* Vehicle Performance */}
        <Col lg={12}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🚗 Hiệu suất sản phẩm</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Thương hiệu</th>
                    <th>Mẫu xe</th>
                    <th>Số lượng bán</th>
                    <th>Doanh thu</th>
                    <th>Tỷ lệ</th>
                    <th>Giá bán</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiclePerformance.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>
                        <strong>{vehicle.brand}</strong>
                      </td>
                      <td>{vehicle.model_name}</td>
                      <td>
                        <Badge bg="primary">{vehicle.salesCount}</Badge>
                      </td>
                      <td>{vehicle.revenue.toLocaleString('vi-VN')} VNĐ</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <ProgressBar 
                            now={vehicle.percentage} 
                            variant="success"
                            style={{ width: '60px', height: '8px' }}
                            className="me-2"
                          />
                          <small>{vehicle.percentage.toFixed(1)}%</small>
                        </div>
                      </td>
                      <td>{vehicle.listed_price.toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Payment Status */}
      <Row className="g-4 mt-4">
        <Col lg={6}>
          <Card className="ev-card">
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
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📊 Thống kê nhanh</h5>
            </Card.Header>
            <Card.Body>
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="h4 text-primary">{mockDealers.length}</div>
                  <small className="text-muted">Đại lý</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="h4 text-success">{mockUsers.length}</div>
                  <small className="text-muted">Người dùng</small>
                </div>
                <div className="col-6">
                  <div className="h4 text-info">{mockVehicles.length}</div>
                  <small className="text-muted">Sản phẩm</small>
                </div>
                <div className="col-6">
                  <div className="h4 text-warning">85%</div>
                  <small className="text-muted">Tỷ lệ chuyển đổi</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Reports

