import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, ProgressBar } from 'react-bootstrap'
import { mockPromotions, mockVehicles, mockDealers } from '../../../data/mockData'

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState(mockPromotions)
  const [showModal, setShowModal] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState(null)
  const [formData, setFormData] = useState({
    program_name: '',
    description: '',
    start_date: '',
    end_date: '',
    conditions: '',
    discount_value: '',
    discount_type: 'percentage',
    dealer_id: '',
    vehicle_ids: '',
    status: 'active'
  })

  const handleShowModal = (promotion = null) => {
    setEditingPromotion(promotion)
    if (promotion) {
      setFormData({
        ...promotion,
        vehicle_ids: promotion.vehicle_ids ? promotion.vehicle_ids.join(', ') : '',
        start_date: promotion.start_date,
        end_date: promotion.end_date
      })
    } else {
      setFormData({
        program_name: '',
        description: '',
        start_date: '',
        end_date: '',
        conditions: '',
        discount_value: '',
        discount_type: 'percentage',
        dealer_id: '',
        vehicle_ids: '',
        status: 'active'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPromotion(null)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const promotionData = {
      ...formData,
      vehicle_ids: formData.vehicle_ids ? formData.vehicle_ids.split(',').map(id => parseInt(id.trim())) : [],
      discount_value: parseFloat(formData.discount_value),
      dealer_id: formData.dealer_id ? parseInt(formData.dealer_id) : null,
      created_by: 1 // EVM Admin
    }

    if (editingPromotion) {
      setPromotions(promotions.map(p => 
        p.id === editingPromotion.id ? { ...p, ...promotionData } : p
      ))
    } else {
      const newPromotion = {
        id: Math.max(...promotions.map(p => p.id)) + 1,
        ...promotionData
      }
      setPromotions([...promotions, newPromotion])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chương trình khuyến mãi này?')) {
      setPromotions(promotions.filter(p => p.id !== id))
    }
  }

  const toggleStatus = (id) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ))
  }

  const getDealerName = (dealerId) => {
    if (!dealerId) return 'Tất cả đại lý'
    const dealer = mockDealers.find(d => d.id === dealerId)
    return dealer ? dealer.name : 'Không xác định'
  }

  const getVehicleNames = (vehicleIds) => {
    if (!vehicleIds || vehicleIds.length === 0) return 'Tất cả xe'
    return vehicleIds.map(id => {
      const vehicle = mockVehicles.find(v => v.id === id)
      return vehicle ? `${vehicle.brand} ${vehicle.model_name}` : 'Không xác định'
    }).join(', ')
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { bg: 'success', text: 'Đang hoạt động' },
      'inactive': { bg: 'secondary', text: 'Tạm dừng' },
      'expired': { bg: 'warning', text: 'Hết hạn' }
    }
    const statusInfo = statusMap[status] || { bg: 'secondary', text: status }
    return <Badge bg={statusInfo.bg}>{statusInfo.text}</Badge>
  }

  const getDiscountText = (promotion) => {
    if (promotion.discount_type === 'percentage') {
      return `${promotion.discount_value}%`
    } else {
      return `${(promotion.discount_value / 1000000).toFixed(0)}M VNĐ`
    }
  }

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date()
  }

  const activePromotions = promotions.filter(p => p.status === 'active' && !isExpired(p.end_date))
  const expiredPromotions = promotions.filter(p => isExpired(p.end_date))
  const totalPromotions = promotions.length
  const totalDiscountValue = activePromotions.reduce((sum, p) => sum + (p.discount_value || 0), 0)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">🎁 Quản lý khuyến mãi</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Tạo chương trình khuyến mãi
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🎁</div>
              <h3 className="text-primary">{totalPromotions}</h3>
              <p className="text-muted mb-0">Tổng chương trình</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">✅</div>
              <h3 className="text-success">{activePromotions.length}</h3>
              <p className="text-muted mb-0">Đang hoạt động</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">⏰</div>
              <h3 className="text-warning">{expiredPromotions.length}</h3>
              <p className="text-muted mb-0">Hết hạn</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">💰</div>
              <h3 className="text-info">{totalDiscountValue}</h3>
              <p className="text-muted mb-0">Tổng giá trị KM</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Active Promotions Alert */}
      {activePromotions.length > 0 && (
        <Alert variant="success" className="mb-4">
          <h5>🎉 Chương trình khuyến mãi đang hoạt động!</h5>
          <p className="mb-0">
            Hiện có {activePromotions.length} chương trình khuyến mãi đang diễn ra trên toàn hệ thống.
          </p>
        </Alert>
      )}

      {/* Promotions Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách chương trình khuyến mãi</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Tên chương trình</th>
                <th>Mô tả</th>
                <th>Đại lý áp dụng</th>
                <th>Xe áp dụng</th>
                <th>Giá trị</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => (
                <tr key={promotion.id}>
                  <td>
                    <strong>{promotion.program_name}</strong>
                    <br />
                    <small className="text-muted">{promotion.conditions}</small>
                  </td>
                  <td>{promotion.description}</td>
                  <td>
                    <span className="fw-bold text-primary">
                      {getDealerName(promotion.dealer_id)}
                    </span>
                  </td>
                  <td>
                    <small className="text-muted">
                      {getVehicleNames(promotion.vehicle_ids)}
                    </small>
                  </td>
                  <td>
                    <span className="fw-bold text-success">
                      {getDiscountText(promotion)}
                    </span>
                  </td>
                  <td>
                    <div>
                      <small>Từ: {promotion.start_date}</small>
                      <br />
                      <small>Đến: {promotion.end_date}</small>
                    </div>
                  </td>
                  <td>
                    {isExpired(promotion.end_date) ? (
                      <Badge bg="warning">Hết hạn</Badge>
                    ) : (
                      getStatusBadge(promotion.status)
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => handleShowModal(promotion)}
                      >
                        ✏️
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => handleDelete(promotion.id)}
                      >
                        🗑️
                      </Button>
                      {!isExpired(promotion.end_date) && (
                        <Button 
                          size="sm" 
                          variant={promotion.status === 'active' ? 'outline-warning' : 'outline-success'}
                          onClick={() => toggleStatus(promotion.id)}
                        >
                          {promotion.status === 'active' ? '⏸️' : '▶️'}
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

      {/* Promotion Analytics */}
      <Row className="g-4 mt-4">
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📊 Phân tích khuyến mãi</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Tỷ lệ hoạt động:</span>
                  <span className="fw-bold text-success">
                    {totalPromotions > 0 ? ((activePromotions.length / totalPromotions) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <ProgressBar 
                  variant="success" 
                  now={totalPromotions > 0 ? (activePromotions.length / totalPromotions) * 100 : 0}
                  className="mt-1"
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Chương trình hết hạn:</span>
                  <span className="fw-bold text-warning">{expiredPromotions.length}</span>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <span>Tổng giá trị KM:</span>
                  <span className="fw-bold text-info">{totalDiscountValue}</span>
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
                  📊 Báo cáo hiệu quả KM
                </Button>
                <Button variant="outline-warning" size="lg">
                  🔄 Gia hạn chương trình
                </Button>
                <Button variant="outline-info" size="lg">
                  📈 Phân tích ROI
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
            {editingPromotion ? '✏️ Chỉnh sửa chương trình khuyến mãi' : '➕ Tạo chương trình khuyến mãi mới'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên chương trình</Form.Label>
                  <Form.Control
                    type="text"
                    name="program_name"
                    value={formData.program_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Loại khuyến mãi</Form.Label>
                  <Form.Select
                    name="discount_type"
                    value={formData.discount_type}
                    onChange={handleInputChange}
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá trị khuyến mãi</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount_value"
                    value={formData.discount_value}
                    onChange={handleInputChange}
                    placeholder={formData.discount_type === 'percentage' ? 'Ví dụ: 10' : 'Ví dụ: 5000000'}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Đại lý áp dụng</Form.Label>
                  <Form.Select
                    name="dealer_id"
                    value={formData.dealer_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Tất cả đại lý</option>
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
                  <Form.Label>Ngày bắt đầu</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày kết thúc</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Điều kiện áp dụng</Form.Label>
              <Form.Control
                type="text"
                name="conditions"
                value={formData.conditions}
                onChange={handleInputChange}
                placeholder="Ví dụ: Áp dụng cho khách hàng mua trả thẳng"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ID xe áp dụng (tùy chọn)</Form.Label>
              <Form.Control
                type="text"
                name="vehicle_ids"
                value={formData.vehicle_ids}
                onChange={handleInputChange}
                placeholder="Ví dụ: 1, 2, 3 (để trống = tất cả xe)"
              />
              <Form.Text className="text-muted">
                Nhập ID xe cách nhau bởi dấu phẩy. Để trống nếu áp dụng cho tất cả xe.
              </Form.Text>
            </Form.Group>

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
                <strong>Lưu ý:</strong> Chương trình khuyến mãi sẽ được áp dụng cho tất cả đại lý nếu không chọn đại lý cụ thể.
              </small>
            </Alert>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                {editingPromotion ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default PromotionManagement
