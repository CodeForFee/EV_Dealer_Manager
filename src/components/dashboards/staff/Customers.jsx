import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap'
import { mockCustomers, mockOrders, mockTestDrives } from '../../../data/mockData'

const Customers = () => {
  // Filter customers for current dealer (dealer_id = 1)
  const [customers, setCustomers] = useState(mockCustomers.filter(customer => customer.dealer_id === 1))
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    citizen_id: ''
  })

  const handleShowModal = (customer = null) => {
    setEditingCustomer(customer)
    if (customer) {
      setFormData({
        full_name: customer.full_name,
        phone: customer.phone,
        email: customer.email,
        citizen_id: customer.citizen_id
      })
    } else {
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        citizen_id: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCustomer(null)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const customerData = {
      ...formData,
      dealer_id: 1 // Current dealer ID
    }

    if (editingCustomer) {
      setCustomers(customers.map(c => 
        c.id === editingCustomer.id ? { ...c, ...customerData } : c
      ))
    } else {
      const newCustomer = {
        id: Math.max(...customers.map(c => c.id)) + 1,
        ...customerData
      }
      setCustomers([...customers, newCustomer])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      setCustomers(customers.filter(c => c.id !== id))
    }
  }

  const getCustomerStats = (customerId) => {
    const customerOrders = mockOrders.filter(order => 
      order.customer_id === customerId && order.dealer_id === 1
    )
    const totalOrders = customerOrders.length
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const testDrives = mockTestDrives.filter(td => 
      td.customer_id === customerId && td.user_id === 4 // Current staff ID
    ).length
    
    return { totalOrders, totalSpent, testDrives }
  }

  const getCustomerLevel = (totalSpent) => {
    if (totalSpent >= 2000000000) return { level: 'VIP', bg: 'danger' }
    if (totalSpent >= 1000000000) return { level: 'Gold', bg: 'warning' }
    if (totalSpent >= 500000000) return { level: 'Silver', bg: 'secondary' }
    return { level: 'Bronze', bg: 'info' }
  }

  const totalCustomers = customers.length
  const vipCustomers = customers.filter(c => {
    const stats = getCustomerStats(c.id)
    return stats.totalSpent >= 2000000000
  }).length

  const totalRevenue = customers.reduce((sum, customer) => {
    const stats = getCustomerStats(customer.id)
    return sum + stats.totalSpent
  }, 0)

  const averageOrderValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">👥 Khách hàng</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Thêm khách hàng mới
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">👥</div>
              <h3 className="text-primary">{totalCustomers}</h3>
              <p className="text-muted mb-0">Tổng khách hàng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-danger mb-2">👑</div>
              <h3 className="text-danger">{vipCustomers}</h3>
              <p className="text-muted mb-0">Khách VIP</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">💵</div>
              <h3 className="text-info">{(totalRevenue / 1000000000).toFixed(1)}B</h3>
              <p className="text-muted mb-0">Tổng doanh thu (VNĐ)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">📈</div>
              <h3 className="text-success">{averageOrderValue.toLocaleString('vi-VN')}</h3>
              <p className="text-muted mb-0">TB/khách hàng (VNĐ)</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Customers Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách khách hàng</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>CCCD</th>
                <th>Đơn hàng</th>
                <th>Tổng chi tiêu</th>
                <th>Lái thử</th>
                <th>Cấp độ</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const stats = getCustomerStats(customer.id)
                const level = getCustomerLevel(stats.totalSpent)
                
                return (
                  <tr key={customer.id}>
                    <td>#{customer.id}</td>
                    <td>
                      <strong>{customer.full_name}</strong>
                    </td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>{customer.citizen_id}</td>
                    <td>
                      <Badge bg="primary">{stats.totalOrders}</Badge>
                    </td>
                    <td>
                      <strong>{stats.totalSpent.toLocaleString('vi-VN')} VNĐ</strong>
                    </td>
                    <td>
                      <Badge bg="info">{stats.testDrives}</Badge>
                    </td>
                    <td>
                      <Badge bg={level.bg}>{level.level}</Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => handleShowModal(customer)}
                        >
                          ✏️
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline-info"
                          onClick={() => {/* Navigate to customer details */}}
                        >
                          👁️
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => handleDelete(customer.id)}
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Customer Segments */}
      <Row className="g-4 mt-4">
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📊 Phân khúc khách hàng</h5>
            </Card.Header>
            <Card.Body>
              {['VIP', 'Gold', 'Silver', 'Bronze'].map(level => {
                const levelCustomers = customers.filter(c => {
                  const stats = getCustomerStats(c.id)
                  const customerLevel = getCustomerLevel(stats.totalSpent)
                  return customerLevel.level === level
                }).length
                
                const percentage = totalCustomers > 0 ? (levelCustomers / totalCustomers) * 100 : 0
                
                return (
                  <div key={level} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold">{level}</span>
                      <span>{levelCustomers} khách hàng ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🏆 Top khách hàng</h5>
            </Card.Header>
            <Card.Body>
              {customers
                .map(customer => ({
                  ...customer,
                  ...getCustomerStats(customer.id)
                }))
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 5)
                .map((customer, index) => (
                  <div key={customer.id} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <strong>{customer.full_name}</strong>
                      <br />
                      <small className="text-muted">{customer.phone}</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-primary">
                        {customer.totalSpent.toLocaleString('vi-VN')} VNĐ
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

      {/* Quick Actions */}
      <Row className="g-4 mt-4">
        <Col lg={12}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">⚡ Hành động nhanh</h5>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Button variant="outline-primary" className="w-100">
                    ➕ Thêm khách hàng mới
                  </Button>
                </div>
                <div className="col-md-3 mb-3">
                  <Button variant="outline-primary" className="w-100">
                    📞 Gọi điện cho khách
                  </Button>
                </div>
                <div className="col-md-3 mb-3">
                  <Button variant="outline-primary" className="w-100">
                    🚙 Đặt lịch lái thử
                  </Button>
                </div>
                <div className="col-md-3 mb-3">
                  <Button variant="outline-primary" className="w-100">
                    💰 Tạo báo giá
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCustomer ? '✏️ Chỉnh sửa khách hàng' : '➕ Thêm khách hàng mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên *</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số CCCD/CMND *</Form.Label>
                  <Form.Control
                    type="text"
                    name="citizen_id"
                    value={formData.citizen_id}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit" className="ev-button">
              {editingCustomer ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default Customers
