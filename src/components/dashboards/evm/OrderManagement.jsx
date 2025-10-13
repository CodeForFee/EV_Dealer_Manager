import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap'
import { mockOrders, mockDealers, mockUsers, mockVehicles } from '../../../data/mockData'

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockOrders)
  const [showModal, setShowModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [formData, setFormData] = useState({
    dealer_id: '',
    vehicle_id: '',
    quantity: '',
    total_amount: '',
    status: 'pending',
    notes: ''
  })

  const handleShowModal = (order = null) => {
    setEditingOrder(order)
    if (order) {
      setFormData({
        dealer_id: order.dealer_id,
        vehicle_id: order.vehicle_id || '',
        quantity: order.quantity || '',
        total_amount: order.total_amount,
        status: order.status,
        notes: order.notes || ''
      })
    } else {
      setFormData({
        dealer_id: '',
        vehicle_id: '',
        quantity: '',
        total_amount: '',
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const orderData = {
      ...formData,
      dealer_id: parseInt(formData.dealer_id),
      vehicle_id: parseInt(formData.vehicle_id),
      quantity: parseInt(formData.quantity),
      total_amount: parseFloat(formData.total_amount),
      created_date: new Date().toISOString().split('T')[0],
      created_by: 2, // EVM Staff ID
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
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn đặt hàng này?')) {
      setOrders(orders.filter(o => o.id !== id))
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ))
  }

  const getDealerName = (dealerId) => {
    const dealer = mockDealers.find(d => d.id === dealerId)
    return dealer ? dealer.name : 'Không xác định'
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
      'processing': { bg: 'info', text: 'Đang xử lý' },
      'completed': { bg: 'primary', text: 'Hoàn thành' }
    }
    const statusInfo = statusMap[status] || { bg: 'secondary', text: status }
    return <Badge bg={statusInfo.bg}>{statusInfo.text}</Badge>
  }

  const totalOrders = orders.length
  const totalValue = orders.reduce((sum, order) => sum + order.total_amount, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const approvedOrders = orders.filter(o => o.status === 'approved').length

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📋 Quản lý đơn đặt hàng</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Tạo đơn đặt hàng
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">📋</div>
              <h3 className="text-primary">{totalOrders}</h3>
              <p className="text-muted mb-0">Tổng đơn hàng</p>
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
          <h5 className="mb-0">📋 Danh sách đơn đặt hàng</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Đại lý</th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
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
                    <strong>{getDealerName(order.dealer_id)}</strong>
                  </td>
                  <td>{getVehicleName(order.vehicle_id)}</td>
                  <td>{order.quantity || 'N/A'}</td>
                  <td>{order.total_amount.toLocaleString('vi-VN')} VNĐ</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    {new Date(order.created_date).toLocaleDateString('vi-VN')}
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
                        <>
                          <Button 
                            size="sm" 
                            variant="outline-success"
                            onClick={() => handleStatusChange(order.id, 'approved')}
                          >
                            ✅
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-danger"
                            onClick={() => handleStatusChange(order.id, 'rejected')}
                          >
                            ❌
                          </Button>
                        </>
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

      {/* Pending Orders Alert */}
      {pendingOrders > 0 && (
        <Alert variant="warning" className="mt-4">
          <h5>⏳ Có {pendingOrders} đơn hàng chờ duyệt</h5>
          <p className="mb-0">
            Vui lòng xem xét và duyệt các đơn đặt hàng từ đại lý.
          </p>
        </Alert>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingOrder ? '👁️ Chi tiết đơn đặt hàng' : '➕ Tạo đơn đặt hàng mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Đại lý *</Form.Label>
                  <Form.Select
                    name="dealer_id"
                    value={formData.dealer_id}
                    onChange={handleInputChange}
                    required
                    disabled={editingOrder}
                  >
                    <option value="">Chọn đại lý</option>
                    {mockDealers.map(dealer => (
                      <option key={dealer.id} value={dealer.id}>
                        {dealer.name}
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
                        {vehicle.brand} {vehicle.model_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
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
              <Col md={6}>
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
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="rejected">Từ chối</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày tạo</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingOrder ? new Date(editingOrder.created_date).toLocaleDateString('vi-VN') : 'Tự động'}
                    disabled
                  />
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

export default OrderManagement

