import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap'
import { mockTestDrives, mockCustomers, mockVehicles } from '../../../data/mockData'

const TestDrives = () => {
  const [testDrives, setTestDrives] = useState(mockTestDrives.filter(td => td.user_id === 4)) // Filter for current staff
  const [showModal, setShowModal] = useState(false)
  const [editingTestDrive, setEditingTestDrive] = useState(null)
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_id: '',
    vin: '',
    scheduled_datetime: '',
    location: '',
    status: 'scheduled',
    notes: ''
  })

  const handleShowModal = (testDrive = null) => {
    setEditingTestDrive(testDrive)
    if (testDrive) {
      setFormData({
        customer_id: testDrive.customer_id,
        vehicle_id: testDrive.vehicle_id,
        vin: testDrive.vin || '',
        scheduled_datetime: testDrive.scheduled_datetime ? 
          new Date(testDrive.scheduled_datetime).toISOString().slice(0, 16) : '',
        location: testDrive.location,
        status: testDrive.status,
        notes: testDrive.notes || ''
      })
    } else {
      setFormData({
        customer_id: '',
        vehicle_id: '',
        vin: '',
        scheduled_datetime: '',
        location: '',
        status: 'scheduled',
        notes: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTestDrive(null)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const testDriveData = {
      ...formData,
      customer_id: parseInt(formData.customer_id),
      vehicle_id: parseInt(formData.vehicle_id),
      scheduled_datetime: new Date(formData.scheduled_datetime).toISOString(),
      user_id: 4 // Current staff ID
    }

    if (editingTestDrive) {
      setTestDrives(testDrives.map(td => 
        td.id === editingTestDrive.id ? { ...td, ...testDriveData } : td
      ))
    } else {
      const newTestDrive = {
        id: Math.max(...testDrives.map(td => td.id)) + 1,
        ...testDriveData
      }
      setTestDrives([...testDrives, newTestDrive])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      setTestDrives(testDrives.filter(td => td.id !== id))
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setTestDrives(testDrives.map(td => 
      td.id === id ? { ...td, status: newStatus } : td
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
      'scheduled': { bg: 'info', text: 'Đã lên lịch' },
      'in_progress': { bg: 'warning', text: 'Đang thực hiện' },
      'completed': { bg: 'success', text: 'Hoàn thành' },
      'cancelled': { bg: 'danger', text: 'Đã hủy' },
      'no_show': { bg: 'secondary', text: 'Không đến' }
    }
    const statusInfo = statusMap[status] || { bg: 'secondary', text: status }
    return <Badge bg={statusInfo.bg}>{statusInfo.text}</Badge>
  }

  const totalTestDrives = testDrives.length
  const scheduledTestDrives = testDrives.filter(td => td.status === 'scheduled').length
  const completedTestDrives = testDrives.filter(td => td.status === 'completed').length
  const todayTestDrives = testDrives.filter(td => {
    const today = new Date().toDateString()
    const testDriveDate = new Date(td.scheduled_datetime).toDateString()
    return today === testDriveDate
  }).length

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">🚙 Lịch hẹn lái thử</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Đặt lịch lái thử
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🚙</div>
              <h3 className="text-primary">{totalTestDrives}</h3>
              <p className="text-muted mb-0">Tổng lịch hẹn</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">📅</div>
              <h3 className="text-info">{scheduledTestDrives}</h3>
              <p className="text-muted mb-0">Đã lên lịch</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">✅</div>
              <h3 className="text-success">{completedTestDrives}</h3>
              <p className="text-muted mb-0">Hoàn thành</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">📆</div>
              <h3 className="text-warning">{todayTestDrives}</h3>
              <p className="text-muted mb-0">Hôm nay</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Today's Test Drives */}
      {todayTestDrives > 0 && (
        <Alert variant="info" className="mb-4">
          <h5>📅 Lịch hẹn hôm nay</h5>
          <p className="mb-0">
            Bạn có {todayTestDrives} lịch hẹn lái thử cần thực hiện hôm nay.
          </p>
        </Alert>
      )}

      {/* Test Drives Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách lịch hẹn lái thử</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>VIN</th>
                <th>Thời gian</th>
                <th>Địa điểm</th>
                <th>Trạng thái</th>
                <th>Kết quả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {testDrives.map((testDrive) => (
                <tr key={testDrive.id}>
                  <td>#{testDrive.id}</td>
                  <td>
                    <strong>{getCustomerName(testDrive.customer_id)}</strong>
                  </td>
                  <td>{getVehicleName(testDrive.vehicle_id)}</td>
                  <td>
                    <code>{testDrive.vin || 'N/A'}</code>
                  </td>
                  <td>
                    {new Date(testDrive.scheduled_datetime).toLocaleString('vi-VN')}
                  </td>
                  <td>{testDrive.location}</td>
                  <td>{getStatusBadge(testDrive.status)}</td>
                  <td>
                    {testDrive.result ? (
                      <Badge bg="success">Có kết quả</Badge>
                    ) : (
                      <Badge bg="secondary">Chưa có</Badge>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => handleShowModal(testDrive)}
                      >
                        👁️
                      </Button>
                      {testDrive.status === 'scheduled' && (
                        <Button 
                          size="sm" 
                          variant="outline-warning"
                          onClick={() => handleStatusChange(testDrive.id, 'in_progress')}
                        >
                          ▶️
                        </Button>
                      )}
                      {testDrive.status === 'in_progress' && (
                        <Button 
                          size="sm" 
                          variant="outline-success"
                          onClick={() => handleStatusChange(testDrive.id, 'completed')}
                        >
                          ✅
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => handleDelete(testDrive.id)}
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
                  ➕ Đặt lịch mới
                </Button>
                <Button variant="outline-primary" size="lg">
                  📅 Xem lịch tuần
                </Button>
                <Button variant="outline-primary" size="lg">
                  📊 Báo cáo lái thử
                </Button>
                <Button variant="outline-primary" size="lg">
                  🚗 Quản lý xe demo
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📈 Thống kê</h5>
            </Card.Header>
            <Card.Body>
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="h4 text-primary">{totalTestDrives}</div>
                  <small className="text-muted">Tổng lịch hẹn</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="h4 text-success">{completedTestDrives}</div>
                  <small className="text-muted">Hoàn thành</small>
                </div>
                <div className="col-6">
                  <div className="h4 text-info">
                    {totalTestDrives > 0 ? ((completedTestDrives / totalTestDrives) * 100).toFixed(1) : 0}%
                  </div>
                  <small className="text-muted">Tỷ lệ hoàn thành</small>
                </div>
                <div className="col-6">
                  <div className="h4 text-warning">{todayTestDrives}</div>
                  <small className="text-muted">Hôm nay</small>
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
            {editingTestDrive ? '✏️ Chỉnh sửa lịch hẹn' : '➕ Đặt lịch lái thử mới'}
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
                    disabled={editingTestDrive}
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
                    disabled={editingTestDrive}
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
                  <Form.Label>VIN (tùy chọn)</Form.Label>
                  <Form.Control
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    placeholder="Nhập VIN của xe demo"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Địa điểm *</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Showroom Hà Nội"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thời gian hẹn *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="scheduled_datetime"
                    value={formData.scheduled_datetime}
                    onChange={handleInputChange}
                    required
                  />
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
                    <option value="scheduled">Đã lên lịch</option>
                    <option value="in_progress">Đang thực hiện</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                    <option value="no_show">Không đến</option>
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
                placeholder="Ghi chú về lịch hẹn lái thử..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit" className="ev-button">
              {editingTestDrive ? 'Cập nhật' : 'Đặt lịch'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default TestDrives

