import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, ProgressBar } from 'react-bootstrap'
import { mockDealerOrders, mockVehicles, mockUsers } from '../../../data/mockData'

const VehicleOrders = () => {
  const [orders, setOrders] = useState(mockDealerOrders.filter(order => order.created_by === 4)) // Filter for current staff
  const [showModal, setShowModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [formData, setFormData] = useState({
    vehicle_id: '',
    quantity: '',
    unit_price: '',
    total_amount: '',
    delivery_date: '',
    notes: ''
  })

  const handleShowModal = (order = null) => {
    setEditingOrder(order)
    if (order) {
      setFormData({
        vehicle_id: order.vehicle_id,
        quantity: order.quantity,
        unit_price: order.unit_price,
        total_amount: order.total_amount,
        delivery_date: order.delivery_date,
        notes: order.notes || ''
      })
    } else {
      setFormData({
        vehicle_id: '',
        quantity: '',
        unit_price: '',
        total_amount: '',
        delivery_date: '',
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
      vehicle_id: parseInt(formData.vehicle_id),
      quantity: parseInt(formData.quantity),
      unit_price: parseFloat(formData.unit_price),
      total_amount: parseFloat(formData.total_amount),
      order_date: new Date().toISOString().split('T')[0],
      dealer_id: 1, // Current dealer
      status: 'pending',
      created_by: 4, // Current staff
      approved_by: null
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
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn đặt xe này?')) {
      setOrders(orders.filter(o => o.id !== id))
    }
  }

  const getVehicleName = (vehicleId) => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId)
    return vehicle ? `${vehicle.brand} ${vehicle.model_name}` : 'Không xác định'
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { bg: 'warning', text: 'Chờ duyệt' },
      'approved': { bg: 'success', text: 'Đã duyệt' },
      'rejected': { bg: 'danger', text: 'Từ chối' },
      'delivered': { bg: 'info', text: 'Đã giao' },
      'cancelled': { bg: 'secondary', text: 'Đã hủy' }
    }
    const statusInfo = statusMap[status] || { bg: 'secondary', text: status }
    return <Badge bg={statusInfo.bg}>{statusInfo.text}</Badge>
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const approvedOrders = orders.filter(o => o.status === 'approved').length
  const totalValue = orders.reduce((sum, order) => sum + order.total_amount, 0)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">🚚 Đặt xe từ hãng</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Đặt xe mới
        </Button>
      </div>

      {/* Welcome Message */}
      <Alert variant="info" className="mb-4">
        <h5>🚚 Quản lý đặt xe từ hãng</h5>
        <p className="mb-0">
          Đặt xe từ hãng để đảm bảo có đủ hàng cho khách hàng. Đơn đặt sẽ được gửi đến EVM để duyệt.
        </p>
      </Alert>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">📦</div>
              <h3 className="text-primary">{totalOrders}</h3>
              <p className="text-muted mb-0">Tổng đơn đặt</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">⏳</div>
              <h3 className="text-warning">{pendingOrders}</h3>
              <p className="text-muted mb-0">Chờ duyệt</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">✅</div>
              <h3 className="text-success">{approvedOrders}</h3>
              <p className="text-muted mb-0">Đã duyệt</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">💰</div>
              <h3 className="text-info">{(totalValue / 1000000000).toFixed(1)}B</h3>
              <p className="text-muted mb-0">Tổng giá trị (VNĐ)</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Orders Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách đơn đặt xe</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Xe</th>
                <th>Số lượng</th>
                <th>Giá sỉ</th>
                <th>Tổng tiền</th>
                <th>Ngày đặt</th>
                <th>Ngày giao</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>#{order.id}</strong>
                  </td>
                  <td>
                    <div>
                      <strong>{getVehicleName(order.vehicle_id)}</strong>
                      {order.notes && (
                        <>
                          <br />
                          <small className="text-muted">{order.notes}</small>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="fw-bold text-primary">
                      {order.quantity} xe
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold text-info">
                      {(order.unit_price / 1000000).toFixed(0)}M VNĐ
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold text-success">
                      {(order.total_amount / 1000000).toFixed(0)}M VNĐ
                    </span>
                  </td>
                  <td>{order.order_date}</td>
                  <td>{order.delivery_date}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => handleShowModal(order)}
                        disabled={order.status === 'delivered'}
                      >
                        ✏️
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => handleDelete(order.id)}
                        disabled={order.status === 'delivered'}
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

      {/* Quick Actions */}
      <Row className="g-4 mt-4">
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">⚡ Hành động nhanh</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="lg">
                  📦 Xem tồn kho hãng
                </Button>
                <Button variant="outline-primary" size="lg">
                  📊 Báo cáo đặt hàng
                </Button>
                <Button variant="outline-primary" size="lg">
                  🚚 Theo dõi giao hàng
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📈 Thống kê nhanh</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Tỷ lệ duyệt:</span>
                  <span className="fw-bold text-success">
                    {totalOrders > 0 ? ((approvedOrders / totalOrders) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <ProgressBar 
                  variant="success" 
                  now={totalOrders > 0 ? (approvedOrders / totalOrders) * 100 : 0}
                  className="mt-1"
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Đơn chờ duyệt:</span>
                  <span className="fw-bold text-warning">{pendingOrders}</span>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <span>Tổng giá trị:</span>
                  <span className="fw-bold text-primary">
                    {(totalValue / 1000000000).toFixed(1)}B VNĐ
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingOrder ? '✏️ Chỉnh sửa đơn đặt xe' : '➕ Đặt xe mới từ hãng'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chọn xe</Form.Label>
                  <Form.Select
                    name="vehicle_id"
                    value={formData.vehicle_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn xe...</option>
                    {mockVehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model_name} - {(vehicle.listed_price / 1000000).toFixed(0)}M VNĐ
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá sỉ (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tổng tiền (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_amount"
                    value={formData.total_amount}
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày giao dự kiến</Form.Label>
                  <Form.Control
                    type="date"
                    name="delivery_date"
                    value={formData.delivery_date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ghi chú</Form.Label>
                  <Form.Control
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Cần giao trước Tết"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="info">
              <small>
                <strong>Lưu ý:</strong> Đơn đặt sẽ được gửi đến EVM để duyệt. 
                Bạn sẽ nhận được thông báo khi đơn đặt được xử lý.
              </small>
            </Alert>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                {editingOrder ? 'Cập nhật' : 'Đặt xe'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default VehicleOrders
