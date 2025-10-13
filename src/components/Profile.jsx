import { useState } from 'react'
import { Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user, login } = useAuth()
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Update user data
    const updatedUser = { ...user, ...formData }
    login(updatedUser)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Quản trị viên'
      case 'evm_staff': return 'Nhân viên EVM'
      case 'dealer_manager': return 'Quản lý đại lý'
      case 'dealer_staff': return 'Nhân viên đại lý'
      default: return role
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'danger'
      case 'evm_staff': return 'info'
      case 'dealer_manager': return 'warning'
      case 'dealer_staff': return 'primary'
      default: return 'secondary'
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">👤 Thông tin cá nhân</h2>
        <Button variant="primary" className="ev-button">
          🔒 Đổi mật khẩu
        </Button>
      </div>

      {showSuccess && (
        <Alert variant="success" className="mb-4">
          ✅ Thông tin đã được cập nhật thành công!
        </Alert>
      )}

      <Row className="g-4">
        {/* Profile Info */}
        <Col lg={8}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📝 Thông tin cơ bản</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
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

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Địa chỉ</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Avatar URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </Form.Group>

                <Button type="submit" className="ev-button">
                  💾 Cập nhật thông tin
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Account Info */}
        <Col lg={4}>
          <Card className="ev-card mb-4">
            <Card.Header>
              <h5 className="mb-0">👤 Thông tin tài khoản</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <div className="display-4 text-primary mb-2">👤</div>
                <h5>{user?.full_name}</h5>
                <Badge bg={getRoleBadgeColor(user?.role)} className="mb-2">
                  {getRoleDisplayName(user?.role)}
                </Badge>
              </div>
              
              <div className="mb-3">
                <strong>Username:</strong>
                <br />
                <code>{user?.username}</code>
              </div>
              
              <div className="mb-3">
                <strong>Email:</strong>
                <br />
                <small>{user?.email}</small>
              </div>
              
              <div className="mb-3">
                <strong>Trạng thái:</strong>
                <br />
                <Badge bg="success">Hoạt động</Badge>
              </div>
              
              <div className="mb-3">
                <strong>Ngày tạo:</strong>
                <br />
                <small>{new Date().toLocaleDateString('vi-VN')}</small>
              </div>
            </Card.Body>
          </Card>

          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🔒 Bảo mật</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="sm">
                  🔑 Đổi mật khẩu
                </Button>
                <Button variant="outline-info" size="sm">
                  📱 Xác thực 2 yếu tố
                </Button>
                <Button variant="outline-warning" size="sm">
                  📧 Cập nhật email
                </Button>
                <Button variant="outline-danger" size="sm">
                  🚪 Đăng xuất tất cả thiết bị
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Activity Log */}
      <Row className="g-4 mt-4">
        <Col lg={12}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📊 Hoạt động gần đây</h5>
            </Card.Header>
            <Card.Body>
              <div className="timeline">
                <div className="timeline-item mb-3">
                  <div className="d-flex align-items-center">
                    <div className="timeline-marker bg-primary rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                    <div>
                      <strong>Đăng nhập hệ thống</strong>
                      <br />
                      <small className="text-muted">Hôm nay, 14:30</small>
                    </div>
                  </div>
                </div>
                
                <div className="timeline-item mb-3">
                  <div className="d-flex align-items-center">
                    <div className="timeline-marker bg-success rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                    <div>
                      <strong>Tạo đơn hàng mới #123</strong>
                      <br />
                      <small className="text-muted">Hôm qua, 16:45</small>
                    </div>
                  </div>
                </div>
                
                <div className="timeline-item mb-3">
                  <div className="d-flex align-items-center">
                    <div className="timeline-marker bg-info rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                    <div>
                      <strong>Cập nhật thông tin khách hàng</strong>
                      <br />
                      <small className="text-muted">2 ngày trước, 10:20</small>
                    </div>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="d-flex align-items-center">
                    <div className="timeline-marker bg-warning rounded-circle me-3" style={{ width: '12px', height: '12px' }}></div>
                    <div>
                      <strong>Đặt lịch lái thử</strong>
                      <br />
                      <small className="text-muted">3 ngày trước, 14:15</small>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Profile

