import { useState } from 'react'
import { Row, Col, Card, Form, Button, Alert, Table, Badge } from 'react-bootstrap'

const Settings = () => {
  const [systemSettings, setSystemSettings] = useState({
    site_name: 'EV Dealer Management System',
    site_description: 'Hệ thống quản lý bán xe điện thông qua kênh đại lý',
    admin_email: 'admin@evdealer.com',
    support_phone: '1900-1234',
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    maintenance_mode: false,
    auto_backup: true,
    backup_frequency: 'daily',
    max_file_size: '10',
    session_timeout: '30'
  })

  const [emailSettings, setEmailSettings] = useState({
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_username: 'noreply@evdealer.com',
    smtp_password: '********',
    email_from: 'EV Dealer System <noreply@evdealer.com>',
    email_reply_to: 'support@evdealer.com'
  })

  const [securitySettings, setSecuritySettings] = useState({
    password_min_length: '8',
    password_require_special: true,
    password_require_number: true,
    password_require_uppercase: true,
    max_login_attempts: '5',
    lockout_duration: '15',
    two_factor_auth: false,
    session_secure: true
  })

  const [notifications, setNotifications] = useState([
    { id: 1, name: 'Đơn hàng mới', enabled: true, email: true, sms: false },
    { id: 2, name: 'Thanh toán thành công', enabled: true, email: true, sms: true },
    { id: 3, name: 'Lịch hẹn lái thử', enabled: true, email: true, sms: false },
    { id: 4, name: 'Cảnh báo tồn kho', enabled: true, email: true, sms: false },
    { id: 5, name: 'Báo cáo hàng ngày', enabled: false, email: true, sms: false }
  ])

  const [showSuccess, setShowSuccess] = useState(false)

  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target
    setSystemSettings({
      ...systemSettings,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleEmailChange = (e) => {
    const { name, value } = e.target
    setEmailSettings({
      ...emailSettings,
      [name]: value
    })
  }

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleNotificationChange = (notificationId, field, value) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId 
        ? { ...notif, [field]: value }
        : notif
    ))
  }

  const handleSave = (section) => {
    // Simulate save
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    console.log(`Saving ${section}:`, { systemSettings, emailSettings, securitySettings, notifications })
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">⚙️ Cài đặt hệ thống</h2>
        <Button variant="primary" className="ev-button">
          💾 Lưu tất cả
        </Button>
      </div>

      {showSuccess && (
        <Alert variant="success" className="mb-4">
          ✅ Cài đặt đã được lưu thành công!
        </Alert>
      )}

      <Row className="g-4">
        {/* System Settings */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🌐 Cài đặt chung</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Tên hệ thống</Form.Label>
                  <Form.Control
                    type="text"
                    name="site_name"
                    value={systemSettings.site_name}
                    onChange={handleSystemChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mô tả hệ thống</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="site_description"
                    value={systemSettings.site_description}
                    onChange={handleSystemChange}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email quản trị</Form.Label>
                      <Form.Control
                        type="email"
                        name="admin_email"
                        value={systemSettings.admin_email}
                        onChange={handleSystemChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Số điện thoại hỗ trợ</Form.Label>
                      <Form.Control
                        type="tel"
                        name="support_phone"
                        value={systemSettings.support_phone}
                        onChange={handleSystemChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tiền tệ</Form.Label>
                      <Form.Select
                        name="currency"
                        value={systemSettings.currency}
                        onChange={handleSystemChange}
                      >
                        <option value="VND">VND (Việt Nam Đồng)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Múi giờ</Form.Label>
                      <Form.Select
                        name="timezone"
                        value={systemSettings.timezone}
                        onChange={handleSystemChange}
                      >
                        <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                        <option value="Asia/Bangkok">Asia/Bangkok</option>
                        <option value="Asia/Singapore">Asia/Singapore</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="maintenance_mode"
                    label="Chế độ bảo trì"
                    checked={systemSettings.maintenance_mode}
                    onChange={handleSystemChange}
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  className="ev-button"
                  onClick={() => handleSave('system')}
                >
                  💾 Lưu cài đặt chung
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Email Settings */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📧 Cài đặt email</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>SMTP Host</Form.Label>
                      <Form.Control
                        type="text"
                        name="smtp_host"
                        value={emailSettings.smtp_host}
                        onChange={handleEmailChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Port</Form.Label>
                      <Form.Control
                        type="number"
                        name="smtp_port"
                        value={emailSettings.smtp_port}
                        onChange={handleEmailChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="smtp_username"
                    value={emailSettings.smtp_username}
                    onChange={handleEmailChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="smtp_password"
                    value={emailSettings.smtp_password}
                    onChange={handleEmailChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email gửi từ</Form.Label>
                  <Form.Control
                    type="text"
                    name="email_from"
                    value={emailSettings.email_from}
                    onChange={handleEmailChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email phản hồi</Form.Label>
                  <Form.Control
                    type="email"
                    name="email_reply_to"
                    value={emailSettings.email_reply_to}
                    onChange={handleEmailChange}
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  className="ev-button"
                  onClick={() => handleSave('email')}
                >
                  💾 Lưu cài đặt email
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-4">
        {/* Security Settings */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🔒 Cài đặt bảo mật</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Độ dài mật khẩu tối thiểu</Form.Label>
                  <Form.Control
                    type="number"
                    name="password_min_length"
                    value={securitySettings.password_min_length}
                    onChange={handleSecurityChange}
                    min="6"
                    max="20"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Yêu cầu mật khẩu</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="password_require_special"
                    label="Ký tự đặc biệt"
                    checked={securitySettings.password_require_special}
                    onChange={handleSecurityChange}
                  />
                  <Form.Check
                    type="checkbox"
                    name="password_require_number"
                    label="Số"
                    checked={securitySettings.password_require_number}
                    onChange={handleSecurityChange}
                  />
                  <Form.Check
                    type="checkbox"
                    name="password_require_uppercase"
                    label="Chữ hoa"
                    checked={securitySettings.password_require_uppercase}
                    onChange={handleSecurityChange}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Số lần đăng nhập sai tối đa</Form.Label>
                      <Form.Control
                        type="number"
                        name="max_login_attempts"
                        value={securitySettings.max_login_attempts}
                        onChange={handleSecurityChange}
                        min="3"
                        max="10"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Thời gian khóa (phút)</Form.Label>
                      <Form.Control
                        type="number"
                        name="lockout_duration"
                        value={securitySettings.lockout_duration}
                        onChange={handleSecurityChange}
                        min="5"
                        max="60"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="two_factor_auth"
                    label="Xác thực 2 yếu tố"
                    checked={securitySettings.two_factor_auth}
                    onChange={handleSecurityChange}
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  className="ev-button"
                  onClick={() => handleSave('security')}
                >
                  💾 Lưu cài đặt bảo mật
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Notifications */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🔔 Cài đặt thông báo</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Loại thông báo</th>
                    <th>Bật</th>
                    <th>Email</th>
                    <th>SMS</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notif) => (
                    <tr key={notif.id}>
                      <td>{notif.name}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={notif.enabled}
                          onChange={(e) => handleNotificationChange(notif.id, 'enabled', e.target.checked)}
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={notif.email}
                          onChange={(e) => handleNotificationChange(notif.id, 'email', e.target.checked)}
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={notif.sms}
                          onChange={(e) => handleNotificationChange(notif.id, 'sms', e.target.checked)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button 
                variant="primary" 
                className="ev-button"
                onClick={() => handleSave('notifications')}
              >
                💾 Lưu cài đặt thông báo
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Info */}
      <Row className="g-4 mt-4">
        <Col lg={12}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">ℹ️ Thông tin hệ thống</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-primary">v1.0.0</div>
                    <small className="text-muted">Phiên bản</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-success">Online</div>
                    <small className="text-muted">Trạng thái</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-info">99.9%</div>
                    <small className="text-muted">Uptime</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <div className="h4 text-warning">2.5GB</div>
                    <small className="text-muted">Dung lượng</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Settings

