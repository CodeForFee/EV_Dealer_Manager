import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, ProgressBar } from 'react-bootstrap'
import { mockFeedbacks, mockCustomers, mockVehicles, mockUsers } from '../../../data/mockData'

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks.filter(f => f.dealer_id === 1))
  const [showModal, setShowModal] = useState(false)
  const [editingFeedback, setEditingFeedback] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_id: '',
    type: 'feedback',
    title: '',
    content: '',
    rating: 5,
    status: 'pending',
    resolution_notes: ''
  })

  const handleShowModal = (feedback = null) => {
    setEditingFeedback(feedback)
    if (feedback) {
      setFormData({
        customer_id: feedback.customer_id,
        vehicle_id: feedback.vehicle_id,
        type: feedback.type,
        title: feedback.title,
        content: feedback.content,
        rating: feedback.rating,
        status: feedback.status,
        resolution_notes: feedback.resolution_notes || ''
      })
    } else {
      setFormData({
        customer_id: '',
        vehicle_id: '',
        type: 'feedback',
        title: '',
        content: '',
        rating: 5,
        status: 'pending',
        resolution_notes: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingFeedback(null)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const feedbackData = {
      ...formData,
      customer_id: parseInt(formData.customer_id),
      vehicle_id: parseInt(formData.vehicle_id),
      rating: parseInt(formData.rating),
      dealer_id: 1,
      created_date: editingFeedback ? editingFeedback.created_date : new Date().toISOString().split('T')[0],
      resolved_date: formData.status === 'resolved' ? new Date().toISOString().split('T')[0] : null,
      resolved_by: formData.status === 'resolved' ? 4 : null // Current staff
    }

    if (editingFeedback) {
      setFeedbacks(feedbacks.map(f => 
        f.id === editingFeedback.id ? { ...f, ...feedbackData } : f
      ))
    } else {
      const newFeedback = {
        id: Math.max(...feedbacks.map(f => f.id)) + 1,
        ...feedbackData
      }
      setFeedbacks([...feedbacks, newFeedback])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa feedback này?')) {
      setFeedbacks(feedbacks.filter(f => f.id !== id))
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setFeedbacks(feedbacks.map(f => 
      f.id === id ? { 
        ...f, 
        status: newStatus,
        resolved_date: newStatus === 'resolved' ? new Date().toISOString().split('T')[0] : null,
        resolved_by: newStatus === 'resolved' ? 4 : null
      } : f
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

  const getTypeBadge = (type) => {
    const typeMap = {
      'feedback': { bg: 'info', text: 'Phản hồi' },
      'complaint': { bg: 'danger', text: 'Khiếu nại' },
      'suggestion': { bg: 'primary', text: 'Đề xuất' }
    }
    const typeInfo = typeMap[type] || { bg: 'secondary', text: type }
    return <Badge bg={typeInfo.bg}>{typeInfo.text}</Badge>
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { bg: 'warning', text: 'Chờ xử lý' },
      'processing': { bg: 'info', text: 'Đang xử lý' },
      'resolved': { bg: 'success', text: 'Đã giải quyết' },
      'closed': { bg: 'secondary', text: 'Đã đóng' }
    }
    const statusInfo = statusMap[status] || { bg: 'secondary', text: status }
    return <Badge bg={statusInfo.bg}>{statusInfo.text}</Badge>
  }

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const typeMatch = filterType === 'all' || feedback.type === filterType
    const statusMatch = filterStatus === 'all' || feedback.status === filterStatus
    return typeMatch && statusMatch
  })

  const totalFeedbacks = feedbacks.length
  const pendingFeedbacks = feedbacks.filter(f => f.status === 'pending').length
  const resolvedFeedbacks = feedbacks.filter(f => f.status === 'resolved').length
  const complaints = feedbacks.filter(f => f.type === 'complaint').length
  const avgRating = feedbacks.length > 0 ? 
    (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : 0

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">💬 Quản lý phản hồi & khiếu nại</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Thêm phản hồi
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">💬</div>
              <h3 className="text-primary">{totalFeedbacks}</h3>
              <p className="text-muted mb-0">Tổng phản hồi</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">⏳</div>
              <h3 className="text-warning">{pendingFeedbacks}</h3>
              <p className="text-muted mb-0">Chờ xử lý</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-danger mb-2">🚨</div>
              <h3 className="text-danger">{complaints}</h3>
              <p className="text-muted mb-0">Khiếu nại</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">⭐</div>
              <h3 className="text-success">{avgRating}</h3>
              <p className="text-muted mb-0">Điểm TB</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="ev-card mb-4">
        <Card.Header>
          <h5 className="mb-0">🔍 Bộ lọc</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Loại phản hồi</Form.Label>
                <Form.Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="feedback">Phản hồi</option>
                  <option value="complaint">Khiếu nại</option>
                  <option value="suggestion">Đề xuất</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="resolved">Đã giải quyết</option>
                  <option value="closed">Đã đóng</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <div className="d-flex align-items-end h-100">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    setFilterType('all')
                    setFilterStatus('all')
                  }}
                >
                  🔄 Reset
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Feedbacks Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách phản hồi</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Xe</th>
                <th>Tiêu đề</th>
                <th>Loại</th>
                <th>Đánh giá</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((feedback) => (
                <tr key={feedback.id}>
                  <td>
                    <strong>{getCustomerName(feedback.customer_id)}</strong>
                  </td>
                  <td>{getVehicleName(feedback.vehicle_id)}</td>
                  <td>
                    <div>
                      <strong>{feedback.title}</strong>
                      <br />
                      <small className="text-muted">
                        {feedback.content.length > 50 
                          ? feedback.content.substring(0, 50) + '...' 
                          : feedback.content
                        }
                      </small>
                    </div>
                  </td>
                  <td>{getTypeBadge(feedback.type)}</td>
                  <td>
                    <div>
                      <span className="text-warning">{getRatingStars(feedback.rating)}</span>
                      <br />
                      <small className="text-muted">({feedback.rating}/5)</small>
                    </div>
                  </td>
                  <td>{getStatusBadge(feedback.status)}</td>
                  <td>{feedback.created_date}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => handleShowModal(feedback)}
                      >
                        👁️
                      </Button>
                      {feedback.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline-success"
                          onClick={() => handleStatusChange(feedback.id, 'processing')}
                        >
                          ▶️
                        </Button>
                      )}
                      {feedback.status === 'processing' && (
                        <Button 
                          size="sm" 
                          variant="outline-success"
                          onClick={() => handleStatusChange(feedback.id, 'resolved')}
                        >
                          ✅
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => handleDelete(feedback.id)}
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

      {/* Resolution Progress */}
      <Row className="g-4 mt-4">
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📊 Tỷ lệ giải quyết</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Đã giải quyết:</span>
                  <span className="fw-bold text-success">
                    {totalFeedbacks > 0 ? ((resolvedFeedbacks / totalFeedbacks) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <ProgressBar 
                  variant="success" 
                  now={totalFeedbacks > 0 ? (resolvedFeedbacks / totalFeedbacks) * 100 : 0}
                  className="mt-1"
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Chờ xử lý:</span>
                  <span className="fw-bold text-warning">{pendingFeedbacks}</span>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <span>Khiếu nại:</span>
                  <span className="fw-bold text-danger">{complaints}</span>
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
                  📊 Báo cáo phản hồi
                </Button>
                <Button variant="outline-warning" size="lg">
                  🚨 Xem khiếu nại khẩn cấp
                </Button>
                <Button variant="outline-info" size="lg">
                  📧 Gửi email khách hàng
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
            {editingFeedback ? '✏️ Chỉnh sửa phản hồi' : '➕ Thêm phản hồi mới'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Khách hàng</Form.Label>
                  <Form.Select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn khách hàng...</option>
                    {mockCustomers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.full_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Xe</Form.Label>
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
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Loại</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="feedback">Phản hồi</option>
                    <option value="complaint">Khiếu nại</option>
                    <option value="suggestion">Đề xuất</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Đánh giá (1-5 sao)</Form.Label>
                  <Form.Select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                  >
                    <option value={1}>1 sao</option>
                    <option value={2}>2 sao</option>
                    <option value={3}>3 sao</option>
                    <option value={4}>4 sao</option>
                    <option value={5}>5 sao</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {editingFeedback && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="resolved">Đã giải quyết</option>
                    <option value="closed">Đã đóng</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ghi chú giải quyết</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="resolution_notes"
                    value={formData.resolution_notes}
                    onChange={handleInputChange}
                    placeholder="Ghi chú về cách giải quyết..."
                  />
                </Form.Group>
              </>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                {editingFeedback ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default FeedbackManagement
