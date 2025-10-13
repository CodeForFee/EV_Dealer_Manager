import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, ProgressBar } from 'react-bootstrap'
import { mockPricing, mockVehicles, mockDealers } from '../../../data/mockData'

const PricingManagement = () => {
  const [pricing, setPricing] = useState(mockPricing)
  const [showModal, setShowModal] = useState(false)
  const [editingPricing, setEditingPricing] = useState(null)
  const [formData, setFormData] = useState({
    vehicle_id: '',
    dealer_id: '',
    wholesale_price: '',
    retail_price: '',
    discount_rate: '',
    min_order_quantity: '',
    valid_from: '',
    valid_to: '',
    status: 'active'
  })

  const handleShowModal = (pricingItem = null) => {
    setEditingPricing(pricingItem)
    if (pricingItem) {
      setFormData({
        ...pricingItem,
        valid_from: pricingItem.valid_from,
        valid_to: pricingItem.valid_to
      })
    } else {
      setFormData({
        vehicle_id: '',
        dealer_id: '',
        wholesale_price: '',
        retail_price: '',
        discount_rate: '',
        min_order_quantity: '',
        valid_from: '',
        valid_to: '',
        status: 'active'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPricing(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Auto calculate discount rate
    if (name === 'wholesale_price' || name === 'retail_price') {
      const wholesale = name === 'wholesale_price' ? parseFloat(value) : parseFloat(formData.wholesale_price)
      const retail = name === 'retail_price' ? parseFloat(value) : parseFloat(formData.retail_price)
      if (wholesale && retail && retail > 0) {
        const discountRate = ((retail - wholesale) / retail) * 100
        setFormData(prev => ({
          ...prev,
          [name]: value,
          discount_rate: discountRate.toFixed(2)
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
    const pricingData = {
      ...formData,
      vehicle_id: parseInt(formData.vehicle_id),
      dealer_id: parseInt(formData.dealer_id),
      wholesale_price: parseFloat(formData.wholesale_price),
      retail_price: parseFloat(formData.retail_price),
      discount_rate: parseFloat(formData.discount_rate),
      min_order_quantity: parseInt(formData.min_order_quantity)
    }

    if (editingPricing) {
      setPricing(pricing.map(p => 
        p.id === editingPricing.id ? { ...p, ...pricingData } : p
      ))
    } else {
      const newPricing = {
        id: Math.max(...pricing.map(p => p.id)) + 1,
        ...pricingData
      }
      setPricing([...pricing, newPricing])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bảng giá này?')) {
      setPricing(pricing.filter(p => p.id !== id))
    }
  }

  const toggleStatus = (id) => {
    setPricing(pricing.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ))
  }

  const getVehicleName = (vehicleId) => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId)
    return vehicle ? `${vehicle.brand} ${vehicle.model_name}` : 'Không xác định'
  }

  const getDealerName = (dealerId) => {
    const dealer = mockDealers.find(d => d.id === dealerId)
    return dealer ? dealer.name : 'Không xác định'
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { bg: 'success', text: 'Hoạt động' },
      'inactive': { bg: 'secondary', text: 'Tạm dừng' },
      'expired': { bg: 'warning', text: 'Hết hạn' }
    }
    const statusInfo = statusMap[status] || { bg: 'secondary', text: status }
    return <Badge bg={statusInfo.bg}>{statusInfo.text}</Badge>
  }

  const isExpired = (validTo) => {
    return new Date(validTo) < new Date()
  }

  const totalPricing = pricing.length
  const activePricing = pricing.filter(p => p.status === 'active' && !isExpired(p.valid_to)).length
  const expiredPricing = pricing.filter(p => isExpired(p.valid_to)).length
  const avgDiscountRate = pricing.length > 0 ? 
    (pricing.reduce((sum, p) => sum + p.discount_rate, 0) / pricing.length).toFixed(1) : 0

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">💰 Quản lý giá sỉ</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Thêm bảng giá
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">💰</div>
              <h3 className="text-primary">{totalPricing}</h3>
              <p className="text-muted mb-0">Tổng bảng giá</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">✅</div>
              <h3 className="text-success">{activePricing}</h3>
              <p className="text-muted mb-0">Đang hoạt động</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">⏰</div>
              <h3 className="text-warning">{expiredPricing}</h3>
              <p className="text-muted mb-0">Hết hạn</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">📊</div>
              <h3 className="text-info">{avgDiscountRate}%</h3>
              <p className="text-muted mb-0">Chiết khấu TB</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Expired Alert */}
      {expiredPricing > 0 && (
        <Alert variant="warning" className="mb-4">
          <h5>⏰ Cảnh báo bảng giá hết hạn!</h5>
          <p className="mb-0">
            Có {expiredPricing} bảng giá đã hết hạn cần cập nhật.
          </p>
        </Alert>
      )}

      {/* Pricing Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách bảng giá</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Xe</th>
                <th>Đại lý</th>
                <th>Giá sỉ</th>
                <th>Giá bán lẻ</th>
                <th>Chiết khấu</th>
                <th>Số lượng tối thiểu</th>
                <th>Hiệu lực</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{getVehicleName(item.vehicle_id)}</strong>
                  </td>
                  <td>{getDealerName(item.dealer_id)}</td>
                  <td>
                    <span className="fw-bold text-success">
                      {(item.wholesale_price / 1000000).toFixed(0)}M VNĐ
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold text-primary">
                      {(item.retail_price / 1000000).toFixed(0)}M VNĐ
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold text-info">
                      {item.discount_rate}%
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold text-warning">
                      {item.min_order_quantity} xe
                    </span>
                  </td>
                  <td>
                    <div>
                      <small>Từ: {item.valid_from}</small>
                      <br />
                      <small>Đến: {item.valid_to}</small>
                    </div>
                  </td>
                  <td>
                    {isExpired(item.valid_to) ? (
                      <Badge bg="warning">Hết hạn</Badge>
                    ) : (
                      getStatusBadge(item.status)
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => handleShowModal(item)}
                      >
                        ✏️
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        🗑️
                      </Button>
                      {!isExpired(item.valid_to) && (
                        <Button 
                          size="sm" 
                          variant={item.status === 'active' ? 'outline-warning' : 'outline-success'}
                          onClick={() => toggleStatus(item.id)}
                        >
                          {item.status === 'active' ? '⏸️' : '▶️'}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Pricing Analysis */}
      <Row className="g-4 mt-4">
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📊 Phân tích giá</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Chiết khấu trung bình:</span>
                  <span className="fw-bold text-info">{avgDiscountRate}%</span>
                </div>
                <ProgressBar 
                  variant="info" 
                  now={avgDiscountRate}
                  className="mt-1"
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Bảng giá hoạt động:</span>
                  <span className="fw-bold text-success">{activePricing}</span>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <span>Bảng giá hết hạn:</span>
                  <span className="fw-bold text-warning">{expiredPricing}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">⚡ Hành động nhanh</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="lg">
                  📊 Báo cáo giá sỉ
                </Button>
                <Button variant="outline-warning" size="lg">
                  🔄 Cập nhật giá hàng loạt
                </Button>
                <Button variant="outline-info" size="lg">
                  📈 Phân tích xu hướng giá
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingPricing ? '✏️ Chỉnh sửa bảng giá' : '➕ Thêm bảng giá mới'}
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
                        {vehicle.brand} {vehicle.model_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chọn đại lý</Form.Label>
                  <Form.Select
                    name="dealer_id"
                    value={formData.dealer_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn đại lý...</option>
                    {mockDealers.map((dealer) => (
                      <option key={dealer.id} value={dealer.id}>
                        {dealer.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá sỉ (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    name="wholesale_price"
                    value={formData.wholesale_price}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá bán lẻ (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    name="retail_price"
                    value={formData.retail_price}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tỷ lệ chiết khấu (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount_rate"
                    value={formData.discount_rate}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng đặt tối thiểu</Form.Label>
                  <Form.Control
                    type="number"
                    name="min_order_quantity"
                    value={formData.min_order_quantity}
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
                  <Form.Label>Có hiệu lực từ</Form.Label>
                  <Form.Control
                    type="date"
                    name="valid_from"
                    value={formData.valid_from}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Có hiệu lực đến</Form.Label>
                  <Form.Control
                    type="date"
                    name="valid_to"
                    value={formData.valid_to}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </Form.Select>
            </Form.Group>

            <Alert variant="info">
              <small>
                <strong>Lưu ý:</strong> Tỷ lệ chiết khấu sẽ được tự động tính toán dựa trên giá sỉ và giá bán lẻ.
              </small>
            </Alert>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                {editingPricing ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default PricingManagement
