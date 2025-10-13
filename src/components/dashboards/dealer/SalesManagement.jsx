import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, ProgressBar } from 'react-bootstrap'
import { mockOrders, mockCustomers, mockVehicles, mockUsers } from '../../../data/mockData'

const SalesManagement = () => {
  const [orders, setOrders] = useState(mockOrders)
  const [showModal, setShowModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_id: '',
    quantity: '',
    unit_price: '',
    total_amount: '',
    payment_method: 'cash',
    status: 'pending',
    notes: ''
  })

  const handleShowModal = (order = null) => {
    setEditingOrder(order)
    if (order) {
      setFormData({
        customer_id: order.customer_id,
        vehicle_id: order.vehicle_id || '',
        quantity: order.quantity || '',
        unit_price: order.unit_price || '',
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        status: order.status,
        notes: order.notes || ''
      })
    } else {
      setFormData({
        customer_id: '',
        vehicle_id: '',
        quantity: '',
        unit_price: '',
        total_amount: '',
        payment_method: 'cash',
        status: 'pending',
        notes: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingOrder(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Auto calculate total amount
    if (name === 'quantity' || name === 'unit_price') {
      const quantity = name === 'quantity' ? parseFloat(value) : parseFloat(formData.quantity)
      const unitPrice = name === 'unit_price' ? parseFloat(value) : parseFloat(formData.unit_price)
      if (quantity && unitPrice) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          total_amount: (quantity * unitPrice).toString()
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const orderData = {
      ...formData,
      customer_id: parseInt(formData.customer_id),
      vehicle_id: parseInt(formData.vehicle_id),
      quantity: parseInt(formData.quantity),
      unit_price: parseFloat(formData.unit_price),
      total_amount: parseFloat(formData.total_amount),
      paid_amount: 0,
      remaining_amount: parseFloat(formData.total_amount),
      order_date: new Date().toISOString().split('T')[0],
      dealer_id: 1, // Current dealer ID
      user_id: 3 // Dealer Manager ID
    }

    if (editingOrder) {
      setOrders(orders.map(o => 
        o.id === editingOrder.id ? { ...o, ...orderData } : o
      ))
    } else {
      const newOrder = {
        id: Math.max(...orders.map(o => o.id)) + 1,
        ...orderData
      }
      setOrders([...orders, newOrder])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      setOrders(orders.filter(o => o.id !== id))
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ))
  }

  const getCustomerName = (customerId) => {
    const customer = mockCustomers.find(c => c.id === customerId)
    return customer ? customer.full_name : 'Không xác định'
  }

  const getVehicleName = (vehicleId) => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId)
    return vehicle ? `${vehicle.brand} ${vehicle.model_name}` : 'Không xác định'
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { bg: 'warning', text: 'Chờ xử lý' },
      'processing': { bg: 'info', text: 'Đang xử lý' },
      'completed': { bg: 'success', text: 'Hoàn thành' },
      'cancelled': { bg: 'danger', text: 'Đã hủy' }
    }
    const statusInfo = statusMap[status] || { bg: 'secondary', text: status }
    return <Badge bg={statusInfo.bg}>{statusInfo.text}</Badge>
  }

  const getPaymentMethodText = (method) => {
    const methodMap = {
      'cash': 'Tiền mặt',
      'installment': 'Trả góp',
      'bank_transfer': 'Chuyển khoản',
      'credit_card': 'Thẻ tín dụng'
    }
    return methodMap[method] || method
  }

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
  const paidAmount = orders.reduce((sum, order) => sum + order.paid_amount, 0)
  const pendingAmount = totalRevenue - paidAmount
  const completedOrders = orders.filter(o => o.status === 'completed').length

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">💰 Quản lý bán hàng</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Tạo đơn hàng mới
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">💰</div>
              <h3 className="text-primary">{totalOrders}</h3>
              <p className="text-muted mb-0">Tổng đơn hàng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">✅</div>
              <h3 className="text-success">{completedOrders}</h3>
              <p className="text-muted mb-0">Đã hoàn thành</p>
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
              <div className="display-4 text-warning mb-2">⏳</div>
              <h3 className="text-warning">{((paidAmount / totalRevenue) * 100).toFixed(1)}%</h3>
              <p className="text-muted mb-0">Tỷ lệ thu hồi</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Payment Status */}
      <Row className="g-4 mb-4">
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
                  <div className="h4 text-primary">{totalOrders}</div>
                  <small className="text-muted">Tổng đơn hàng</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="h4 text-success">{completedOrders}</div>
                  <small className="text-muted">Hoàn thành</small>
                </div>
                <div className="col-6">
                  <div className="h4 text-info">{(totalRevenue / totalOrders).toLocaleString('vi-VN')}</div>
                  <small className="text-muted">TB/đơn hàng (VNĐ)</small>
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

      {/* Orders Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách đơn hàng</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                <th>Đã thanh toán</th>
                <th>Còn lại</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <strong>{getCustomerName(order.customer_id)}</strong>
                  </td>
                  <td>{getVehicleName(order.vehicle_id)}</td>
                  <td>{order.quantity || 'N/A'}</td>
                  <td>{order.total_amount.toLocaleString('vi-VN')} VNĐ</td>
                  <td className="text-success">
                    {order.paid_amount.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="text-warning">
                    {order.remaining_amount.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td>{getPaymentMethodText(order.payment_method)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    {new Date(order.order_date).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => handleShowModal(order)}
                      >
                        👁️
                      </Button>
                      {order.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline-success"
                          onClick={() => handleStatusChange(order.id, 'processing')}
                        >
                          ▶️
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button 
                          size="sm" 
                          variant="outline-success"
                          onClick={() => handleStatusChange(order.id, 'completed')}
                        >
                          ✅
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => handleDelete(order.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingOrder ? '👁️ Chi tiết đơn hàng' : '➕ Tạo đơn hàng mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Khách hàng *</Form.Label>
                  <Form.Select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleInputChange}
                    required
                    disabled={editingOrder}
                  >
                    <option value="">Chọn khách hàng</option>
                    {mockCustomers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.full_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sản phẩm *</Form.Label>
                  <Form.Select
                    name="vehicle_id"
                    value={formData.vehicle_id}
                    onChange={handleInputChange}
                    required
                    disabled={editingOrder}
                  >
                    <option value="">Chọn sản phẩm</option>
                    {mockVehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model_name} - {vehicle.listed_price.toLocaleString('vi-VN')} VNĐ
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng *</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                    disabled={editingOrder}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Đơn giá (VNĐ) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    required
                    disabled={editingOrder}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tổng tiền (VNĐ) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_amount"
                    value={formData.total_amount}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    required
                    disabled={editingOrder}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phương thức thanh toán *</Form.Label>
                  <Form.Select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="cash">Tiền mặt</option>
                    <option value="installment">Trả góp</option>
                    <option value="bank_transfer">Chuyển khoản</option>
                    <option value="credit_card">Thẻ tín dụng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              {editingOrder ? 'Đóng' : 'Hủy'}
            </Button>
            {!editingOrder && (
              <Button type="submit" className="ev-button">
                Tạo đơn hàng
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default SalesManagement

