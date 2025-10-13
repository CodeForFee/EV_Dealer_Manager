import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, ProgressBar } from 'react-bootstrap'
import { mockUsers, mockOrders } from '../../../data/mockData'

const StaffManagement = () => {
  // Filter staff for current dealer (dealer_id = 1)
  const [staff, setStaff] = useState(mockUsers.filter(user => 
    user.dealer_id === 1 && (user.role === 'dealer_staff' || user.role === 'dealer_manager')
  ))
  const [showModal, setShowModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role: 'dealer_staff',
    status: 'active'
  })

  const handleShowModal = (staffMember = null) => {
    setEditingStaff(staffMember)
    if (staffMember) {
      setFormData({
        username: staffMember.username,
        email: staffMember.email,
        full_name: staffMember.full_name,
        role: staffMember.role,
        status: staffMember.status
      })
    } else {
      setFormData({
        username: '',
        email: '',
        full_name: '',
        role: 'dealer_staff',
        status: 'active'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingStaff(null)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const staffData = {
      ...formData,
      dealer_id: 1, // Current dealer ID
      password: editingStaff?.password || 'default123'
    }

    if (editingStaff) {
      setStaff(staff.map(s => 
        s.id === editingStaff.id ? { ...s, ...staffData } : s
      ))
    } else {
      const newStaff = {
        id: Math.max(...staff.map(s => s.id)) + 1,
        ...staffData
      }
      setStaff([...staff, newStaff])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setStaff(staff.filter(s => s.id !== id))
    }
  }

  const toggleStatus = (id) => {
    setStaff(staff.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
    ))
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'dealer_manager': return 'Quản lý đại lý'
      case 'dealer_staff': return 'Nhân viên đại lý'
      default: return role
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'dealer_manager': return 'warning'
      case 'dealer_staff': return 'primary'
      default: return 'secondary'
    }
  }

  const getStaffPerformance = (staffId) => {
    const staffOrders = mockOrders.filter(order => order.user_id === staffId)
    const totalOrders = staffOrders.length
    const totalRevenue = staffOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const completedOrders = staffOrders.filter(order => order.status === 'completed').length
    
    return { totalOrders, totalRevenue, completedOrders }
  }

  const totalStaff = staff.length
  const activeStaff = staff.filter(s => s.status === 'active').length
  const managers = staff.filter(s => s.role === 'dealer_manager').length
  const salesStaff = staff.filter(s => s.role === 'dealer_staff').length

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">👨‍💼 Quản lý nhân viên</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Thêm nhân viên mới
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">👥</div>
              <h3 className="text-primary">{totalStaff}</h3>
              <p className="text-muted mb-0">Tổng nhân viên</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">✅</div>
              <h3 className="text-success">{activeStaff}</h3>
              <p className="text-muted mb-0">Đang hoạt động</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">👨‍💼</div>
              <h3 className="text-warning">{managers}</h3>
              <p className="text-muted mb-0">Quản lý</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">💰</div>
              <h3 className="text-info">{salesStaff}</h3>
              <p className="text-muted mb-0">Nhân viên bán hàng</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Staff Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách nhân viên</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên đăng nhập</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Đơn hàng</th>
                <th>Doanh thu</th>
                <th>Hoàn thành</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((staffMember) => {
                const performance = getStaffPerformance(staffMember.id)
                return (
                  <tr key={staffMember.id}>
                    <td>#{staffMember.id}</td>
                    <td>
                      <strong>{staffMember.username}</strong>
                    </td>
                    <td>{staffMember.full_name}</td>
                    <td>{staffMember.email}</td>
                    <td>
                      <Badge bg={getRoleBadgeColor(staffMember.role)}>
                        {getRoleDisplayName(staffMember.role)}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="primary">{performance.totalOrders}</Badge>
                    </td>
                    <td>
                      <strong>{performance.totalRevenue.toLocaleString('vi-VN')} VNĐ</strong>
                    </td>
                    <td>
                      <Badge bg="success">{performance.completedOrders}</Badge>
                    </td>
                    <td>
                      <Badge bg={staffMember.status === 'active' ? 'success' : 'secondary'}>
                        {staffMember.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => handleShowModal(staffMember)}
                        >
                          ✏️
                        </Button>
                        <Button 
                          size="sm" 
                          variant={staffMember.status === 'active' ? 'outline-warning' : 'outline-success'}
                          onClick={() => toggleStatus(staffMember.id)}
                        >
                          {staffMember.status === 'active' ? '⏸️' : '▶️'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => handleDelete(staffMember.id)}
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

      {/* Performance Analysis */}
      <Row className="g-4 mt-4">
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📊 Hiệu suất nhân viên</h5>
            </Card.Header>
            <Card.Body>
              {staff
                .map(staffMember => ({
                  ...staffMember,
                  ...getStaffPerformance(staffMember.id)
                }))
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .map((staffMember, index) => (
                  <div key={staffMember.id} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold">{staffMember.full_name}</span>
                      <span className="text-primary">
                        {staffMember.totalRevenue.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">{staffMember.totalOrders} đơn hàng</small>
                      <small className="text-muted">
                        {staffMember.totalOrders > 0 ? 
                          ((staffMember.completedOrders / staffMember.totalOrders) * 100).toFixed(1) : 0}% hoàn thành
                      </small>
                    </div>
                    <ProgressBar 
                      now={staffMember.totalOrders > 0 ? (staffMember.completedOrders / staffMember.totalOrders) * 100 : 0} 
                      variant="primary"
                      className="mb-2"
                    />
                  </div>
                ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🏆 Top nhân viên</h5>
            </Card.Header>
            <Card.Body>
              {staff
                .map(staffMember => ({
                  ...staffMember,
                  ...getStaffPerformance(staffMember.id)
                }))
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .slice(0, 5)
                .map((staffMember, index) => (
                  <div key={staffMember.id} className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <strong>{staffMember.full_name}</strong>
                      <br />
                      <small className="text-muted">{getRoleDisplayName(staffMember.role)}</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-primary">
                        {staffMember.totalRevenue.toLocaleString('vi-VN')} VNĐ
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingStaff ? '✏️ Chỉnh sửa nhân viên' : '➕ Thêm nhân viên mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên đăng nhập *</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
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
            </Row>

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

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vai trò *</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="dealer_staff">Nhân viên đại lý</option>
                    <option value="dealer_manager">Quản lý đại lý</option>
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
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm dừng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {!editingStaff && (
              <Alert variant="info">
                <strong>Lưu ý:</strong> Mật khẩu mặc định sẽ là "default123". 
                Nhân viên sẽ được yêu cầu đổi mật khẩu khi đăng nhập lần đầu.
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit" className="ev-button">
              {editingStaff ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default StaffManagement
