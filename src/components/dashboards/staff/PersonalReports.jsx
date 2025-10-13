import { useState } from 'react'
import { Row, Col, Card, Table, Button, Form, Badge, ProgressBar } from 'react-bootstrap'
import { mockOrders, mockCustomers, mockTestDrives, mockVehicles } from '../../../data/mockData'

const PersonalReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  // Filter data for current staff (user_id = 4)
  const myOrders = mockOrders.filter(order => order.user_id === 4)
  const myCustomers = mockCustomers.filter(customer => 
    myOrders.some(order => order.customer_id === customer.id)
  )
  const myTestDrives = mockTestDrives.filter(td => td.user_id === 4)

  // Calculate personal statistics
  const totalOrders = myOrders.length
  const totalRevenue = myOrders.reduce((sum, order) => sum + order.total_amount, 0)
  const paidAmount = myOrders.reduce((sum, order) => sum + order.paid_amount, 0)
  const pendingAmount = totalRevenue - paidAmount
  const completedOrders = myOrders.filter(order => order.status === 'completed').length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Monthly performance (mock data)
  const monthlyPerformance = [
    { month: 'Tháng 1', orders: 3, revenue: 4500000000, testDrives: 5 },
    { month: 'Tháng 2', orders: 4, revenue: 6000000000, testDrives: 7 },
    { month: 'Tháng 3', orders: 5, revenue: 7500000000, testDrives: 8 },
    { month: 'Tháng 4', orders: 6, revenue: 9000000000, testDrives: 10 },
    { month: 'Tháng 5', orders: 7, revenue: 10500000000, testDrives: 12 },
    { month: 'Tháng 6', orders: 8, revenue: 12000000000, testDrives: 15 }
  ]

  // Customer analysis
  const customerAnalysis = myCustomers.map(customer => {
    const customerOrders = myOrders.filter(order => order.customer_id === customer.id)
    const customerRevenue = customerOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const customerTestDrives = myTestDrives.filter(td => td.customer_id === customer.id).length
    
    return {
      ...customer,
      orderCount: customerOrders.length,
      totalRevenue: customerRevenue,
      testDriveCount: customerTestDrives,
      averageOrderValue: customerOrders.length > 0 ? customerRevenue / customerOrders.length : 0
    }
  }).sort((a, b) => b.totalRevenue - a.totalRevenue)

  // Vehicle performance
  const vehiclePerformance = mockVehicles.map(vehicle => {
    const vehicleOrders = myOrders.filter(order => order.vehicle_id === vehicle.id)
    const vehicleRevenue = vehicleOrders.reduce((sum, order) => sum + order.total_amount, 0)
    
    return {
      ...vehicle,
      orderCount: vehicleOrders.length,
      revenue: vehicleRevenue,
      percentage: totalRevenue > 0 ? (vehicleRevenue / totalRevenue) * 100 : 0
    }
  }).filter(v => v.orderCount > 0).sort((a, b) => b.revenue - a.revenue)

  // Goals and targets
  const monthlyGoal = 15000000000 // 15B VND
  const orderGoal = 20 // 20 orders
  const testDriveGoal = 30 // 30 test drives
  const customerGoal = 15 // 15 new customers

  const goalProgress = {
    revenue: (totalRevenue / monthlyGoal) * 100,
    orders: (totalOrders / orderGoal) * 100,
    testDrives: (myTestDrives.length / testDriveGoal) * 100,
    customers: (myCustomers.length / customerGoal) * 100
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📊 Báo cáo cá nhân</h2>
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
            <Col md={6}>
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
            <Col md={6}>
              <Form.Group>
                <Form.Label>Chỉ số hiển thị</Form.Label>
                <Form.Select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                >
                  <option value="revenue">Doanh thu</option>
                  <option value="orders">Đơn hàng</option>
                  <option value="testDrives">Lái thử</option>
                  <option value="customers">Khách hàng</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="primary" className="ev-button">
              🔄 Cập nhật báo cáo
            </Button>
          </div>
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
              <div className="display-4 text-info mb-2">🚙</div>
              <h3 className="text-info">{myTestDrives.length}</h3>
              <p className="text-muted mb-0">Lái thử</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">👥</div>
              <h3 className="text-warning">{myCustomers.length}</h3>
              <p className="text-muted mb-0">Khách hàng</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Goals Progress */}
      <Row className="g-4 mb-4">
        <Col lg={12}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🎯 Tiến độ mục tiêu tháng</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center mb-3">
                    <h6>Doanh thu</h6>
                    <div className="h4 text-primary">
                      {(totalRevenue / 1000000000).toFixed(1)}B / 15B VNĐ
                    </div>
                    <ProgressBar 
                      now={goalProgress.revenue} 
                      variant="primary"
                      className="mb-2"
                    />
                    <small className="text-muted">{goalProgress.revenue.toFixed(1)}%</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center mb-3">
                    <h6>Đơn hàng</h6>
                    <div className="h4 text-success">
                      {totalOrders} / 20 đơn
                    </div>
                    <ProgressBar 
                      now={goalProgress.orders} 
                      variant="success"
                      className="mb-2"
                    />
                    <small className="text-muted">{goalProgress.orders.toFixed(1)}%</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center mb-3">
                    <h6>Lái thử</h6>
                    <div className="h4 text-info">
                      {myTestDrives.length} / 30 lần
                    </div>
                    <ProgressBar 
                      now={goalProgress.testDrives} 
                      variant="info"
                      className="mb-2"
                    />
                    <small className="text-muted">{goalProgress.testDrives.toFixed(1)}%</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center mb-3">
                    <h6>Khách hàng</h6>
                    <div className="h4 text-warning">
                      {myCustomers.length} / 15 khách
                    </div>
                    <ProgressBar 
                      now={goalProgress.customers} 
                      variant="warning"
                      className="mb-2"
                    />
                    <small className="text-muted">{goalProgress.customers.toFixed(1)}%</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Monthly Performance */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📈 Hiệu suất theo tháng</h5>
            </Card.Header>
            <Card.Body>
              {monthlyPerformance.map((month, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold">{month.month}</span>
                    <span className="text-primary">
                      {(month.revenue / 1000000000).toFixed(1)}B VNĐ
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">{month.orders} đơn hàng</small>
                    <small className="text-muted">{month.testDrives} lái thử</small>
                  </div>
                  <ProgressBar 
                    now={(month.revenue / Math.max(...monthlyPerformance.map(m => m.revenue))) * 100} 
                    variant="primary"
                    className="mb-2"
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Top Customers */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">👥 Top khách hàng</h5>
            </Card.Header>
            <Card.Body>
              {customerAnalysis.slice(0, 5).map((customer, index) => (
                <div key={customer.id} className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong>{customer.full_name}</strong>
                    <br />
                    <small className="text-muted">{customer.phone}</small>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-primary">
                      {customer.totalRevenue.toLocaleString('vi-VN')} VNĐ
                    </div>
                    <Badge bg={index === 0 ? 'warning' : index === 1 ? 'secondary' : index === 2 ? 'success' : 'light'}>
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-4">
        {/* Vehicle Performance */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🚗 Hiệu suất sản phẩm</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn hàng</th>
                    <th>Doanh thu</th>
                    <th>Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiclePerformance.slice(0, 5).map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>
                        <strong>{vehicle.brand} {vehicle.model_name}</strong>
                      </td>
                      <td>
                        <Badge bg="primary">{vehicle.orderCount}</Badge>
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
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Performance Summary */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📊 Tóm tắt hiệu suất</h5>
            </Card.Header>
            <Card.Body>
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="h4 text-primary">{averageOrderValue.toLocaleString('vi-VN')}</div>
                  <small className="text-muted">TB/đơn hàng (VNĐ)</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="h4 text-success">{((paidAmount / totalRevenue) * 100).toFixed(1)}%</div>
                  <small className="text-muted">Tỷ lệ thu hồi</small>
                </div>
                <div className="col-6">
                  <div className="h4 text-info">{((completedOrders / totalOrders) * 100).toFixed(1)}%</div>
                  <small className="text-muted">Tỷ lệ hoàn thành</small>
                </div>
                <div className="col-6">
                  <div className="h4 text-warning">{((myTestDrives.length / myCustomers.length) * 100).toFixed(1)}%</div>
                  <small className="text-muted">Tỷ lệ chuyển đổi</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Payment Status */}
      <Row className="g-4 mt-4">
        <Col lg={12}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">💵 Tình hình thanh toán</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="text-center">
                    <div className="h4 text-success">{paidAmount.toLocaleString('vi-VN')} VNĐ</div>
                    <small className="text-muted">Đã thanh toán</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <div className="h4 text-warning">{pendingAmount.toLocaleString('vi-VN')} VNĐ</div>
                    <small className="text-muted">Còn lại</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <div className="h4 text-primary">{((paidAmount / totalRevenue) * 100).toFixed(1)}%</div>
                    <small className="text-muted">Tỷ lệ thu hồi</small>
                  </div>
                </Col>
              </Row>
              <div className="mt-3">
                <ProgressBar 
                  now={(paidAmount / totalRevenue) * 100} 
                  variant="success"
                  className="mb-2"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PersonalReports
