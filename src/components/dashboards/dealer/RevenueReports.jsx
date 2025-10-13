import { useState } from 'react'
import { Row, Col, Card, Table, Button, Form, Badge, ProgressBar } from 'react-bootstrap'
import { mockOrders, mockCustomers, mockUsers, mockVehicles } from '../../../data/mockData'

const RevenueReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedStaff, setSelectedStaff] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Filter orders for current dealer (dealer_id = 1)
  const dealerOrders = mockOrders.filter(order => order.dealer_id === 1)
  
  // Calculate statistics
  const totalOrders = dealerOrders.length
  const totalRevenue = dealerOrders.reduce((sum, order) => sum + order.total_amount, 0)
  const paidAmount = dealerOrders.reduce((sum, order) => sum + order.paid_amount, 0)
  const pendingAmount = totalRevenue - paidAmount
  const completedOrders = dealerOrders.filter(order => order.status === 'completed').length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Revenue by staff
  const staffPerformance = mockUsers
    .filter(user => user.dealer_id === 1 && (user.role === 'dealer_staff' || user.role === 'dealer_manager'))
    .map(user => {
      const userOrders = dealerOrders.filter(order => order.user_id === user.id)
      const userRevenue = userOrders.reduce((sum, order) => sum + order.total_amount, 0)
      const userPaid = userOrders.reduce((sum, order) => sum + order.paid_amount, 0)
      return {
        ...user,
        orderCount: userOrders.length,
        revenue: userRevenue,
        paidAmount: userPaid,
        pendingAmount: userRevenue - userPaid,
        completionRate: userOrders.length > 0 ? (userOrders.filter(o => o.status === 'completed').length / userOrders.length) * 100 : 0
      }
    }).sort((a, b) => b.revenue - a.revenue)

  // Revenue by customer
  const customerRevenue = mockCustomers
    .filter(customer => customer.dealer_id === 1)
    .map(customer => {
      const customerOrders = dealerOrders.filter(order => order.customer_id === customer.id)
      const customerTotal = customerOrders.reduce((sum, order) => sum + order.total_amount, 0)
      const customerPaid = customerOrders.reduce((sum, order) => sum + order.paid_amount, 0)
      return {
        ...customer,
        orderCount: customerOrders.length,
        totalRevenue: customerTotal,
        paidAmount: customerPaid,
        pendingAmount: customerTotal - customerPaid
      }
    }).sort((a, b) => b.totalRevenue - a.totalRevenue)

  // Revenue by vehicle
  const vehicleRevenue = mockVehicles.map(vehicle => {
    const vehicleOrders = dealerOrders.filter(order => order.vehicle_id === vehicle.id)
    const vehicleTotal = vehicleOrders.reduce((sum, order) => sum + order.total_amount, 0)
    return {
      ...vehicle,
      orderCount: vehicleOrders.length,
      revenue: vehicleTotal,
      percentage: totalRevenue > 0 ? (vehicleTotal / totalRevenue) * 100 : 0
    }
  }).sort((a, b) => b.revenue - a.revenue)

  // Monthly trend (mock data)
  const monthlyTrend = [
    { month: 'Tháng 1', revenue: 1200000000, orders: 8 },
    { month: 'Tháng 2', revenue: 1500000000, orders: 10 },
    { month: 'Tháng 3', revenue: 1800000000, orders: 12 },
    { month: 'Tháng 4', revenue: 1600000000, orders: 11 },
    { month: 'Tháng 5', revenue: 2000000000, orders: 14 },
    { month: 'Tháng 6', revenue: 2200000000, orders: 15 }
  ]

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📊 Báo cáo doanh thu</h2>
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
                <Form.Label>Nhân viên</Form.Label>
                <Form.Select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                >
                  <option value="all">Tất cả nhân viên</option>
                  {staffPerformance.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.full_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Trạng thái đơn hàng</Form.Label>
                <Form.Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="completed">Hoàn thành</option>
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
        {/* Payment Status */}
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
              <div className="text-center">
                <small className="text-muted">
                  Tỷ lệ thu hồi: {((paidAmount / totalRevenue) * 100).toFixed(1)}%
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Monthly Trend */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📈 Xu hướng doanh thu</h5>
            </Card.Header>
            <Card.Body>
              {monthlyTrend.map((month, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold">{month.month}</span>
                    <span className="text-primary">
                      {(month.revenue / 1000000000).toFixed(1)}B VNĐ
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">{month.orders} đơn hàng</small>
                    <small className="text-muted">
                      {((month.revenue / Math.max(...monthlyTrend.map(m => m.revenue))) * 100).toFixed(1)}%
                    </small>
                  </div>
                  <ProgressBar 
                    now={(month.revenue / Math.max(...monthlyTrend.map(m => m.revenue))) * 100} 
                    variant="primary"
                    className="mb-2"
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-4">
        {/* Staff Performance */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">👨‍💼 Hiệu suất nhân viên</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Nhân viên</th>
                    <th>Đơn hàng</th>
                    <th>Doanh thu</th>
                    <th>Hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  {staffPerformance.map((staff) => (
                    <tr key={staff.id}>
                      <td>
                        <strong>{staff.full_name}</strong>
                        <br />
                        <small className="text-muted">{staff.username}</small>
                      </td>
                      <td>{staff.orderCount}</td>
                      <td>{staff.revenue.toLocaleString('vi-VN')} VNĐ</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <ProgressBar 
                            now={staff.completionRate} 
                            variant="success"
                            style={{ width: '60px', height: '8px' }}
                            className="me-2"
                          />
                          <small>{staff.completionRate.toFixed(1)}%</small>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
              {customerRevenue.slice(0, 5).map((customer, index) => (
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

      {/* Vehicle Performance */}
      <Row className="g-4 mt-4">
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
                  {vehicleRevenue.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>
                        <strong>{vehicle.brand}</strong>
                      </td>
                      <td>{vehicle.model_name}</td>
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
                      <td>{vehicle.listed_price.toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default RevenueReports
