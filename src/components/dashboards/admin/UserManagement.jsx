import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap'
import { mockUsers, mockDealers } from '../../../data/mockData'

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role: '',
    dealer_id: '',
    status: 'active'
  })

  const handleShowModal = (user = null) => {
    setEditingUser(user)
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        dealer_id: user.dealer_id || '',
        status: user.status
      })
    } else {
      setFormData({
        username: '',
        email: '',
        full_name: '',
        role: '',
        dealer_id: '',
        status: 'active'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userData = {
      ...formData,
      dealer_id: formData.dealer_id ? parseInt(formData.dealer_id) : null,
      password: editingUser?.password || 'default123' // In real app, generate secure password
    }

    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...userData } : u
      ))
    } else {
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...userData
      }
      setUsers([...users, newUser])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const toggleStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ))
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

  const getDealerName = (dealerId) => {
    if (!dealerId) return 'N/A'
    const dealer = mockDealers.find(d => d.id === dealerId)
    return dealer ? dealer.name : 'Không xác định'
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">👥 Quản lý người dùng</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Thêm người dùng mới
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">👥</div>
              <h3 className="text-primary">{users.length}</h3>
              <p className="text-muted mb-0">Tổng người dùng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">✅</div>
              <h3 className="text-success">{users.filter(u => u.status === 'active').length}</h3>
              <p className="text-muted mb-0">Đang hoạt động</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">👨‍💼</div>
              <h3 className="text-info">{users.filter(u => u.role === 'dealer_staff').length}</h3>
              <p className="text-muted mb-0">Nhân viên đại lý</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">🏢</div>
              <h3 className="text-warning">{users.filter(u => u.role === 'dealer_manager').length}</h3>
              <p className="text-muted mb-0">Quản lý đại lý</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Users Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách người dùng</h5>
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
                <th>Đại lý</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>
                    <strong>{user.username}</strong>
                  </td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={
                      user.role === 'admin' ? 'danger' :
                      user.role === 'evm_staff' ? 'info' :
                      user.role === 'dealer_manager' ? 'warning' : 'primary'
                    }>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </td>
                  <td>{getDealerName(user.dealer_id)}</td>
                  <td>
                    <Badge bg={user.status === 'active' ? 'success' : 'secondary'}>
                      {user.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => handleShowModal(user)}
                      >
                        ✏️
                      </Button>
                      <Button 
                        size="sm" 
                        variant={user.status === 'active' ? 'outline-warning' : 'outline-success'}
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.status === 'active' ? '⏸️' : '▶️'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => handleDelete(user.id)}
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
            {editingUser ? '✏️ Chỉnh sửa người dùng' : '➕ Thêm người dùng mới'}
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
                    <option value="">Chọn vai trò</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="evm_staff">Nhân viên EVM</option>
                    <option value="dealer_manager">Quản lý đại lý</option>
                    <option value="dealer_staff">Nhân viên đại lý</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Đại lý</Form.Label>
                  <Form.Select
                    name="dealer_id"
                    value={formData.dealer_id}
                    onChange={handleInputChange}
                    disabled={formData.role === 'admin' || formData.role === 'evm_staff'}
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

            {!editingUser && (
              <Alert variant="info">
                <strong>Lưu ý:</strong> Mật khẩu mặc định sẽ là "default123". 
                Người dùng sẽ được yêu cầu đổi mật khẩu khi đăng nhập lần đầu.
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit" className="ev-button">
              {editingUser ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManagement

