import { useState } from 'react'
import { Container, Row, Col, Navbar, Nav, Button, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
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

  const getSidebarItems = () => {
    const commonItems = [
      { label: 'Trang chủ', icon: '🏠', path: '/dashboard' },
      { label: 'Thông tin cá nhân', icon: '👤', path: '/dashboard/profile' }
    ]

    switch (user?.role) {
      case 'admin':
        return [
          ...commonItems,
          { label: 'Quản lý đại lý', icon: '🏢', path: '/dashboard/dealers' },
          { label: 'Quản lý sản phẩm', icon: '🚗', path: '/dashboard/vehicles' },
          { label: 'Quản lý người dùng', icon: '👥', path: '/dashboard/users' },
          { label: 'Báo cáo tổng hợp', icon: '📊', path: '/dashboard/reports' },
          { label: 'Cài đặt hệ thống', icon: '⚙️', path: '/dashboard/settings' }
        ]
      case 'evm_staff':
        return [
          ...commonItems,
          { label: 'Quản lý sản phẩm', icon: '🚗', path: '/dashboard/vehicles' },
          { label: 'Quản lý tồn kho', icon: '📦', path: '/dashboard/inventory' },
          { label: 'Quản lý đại lý', icon: '🏢', path: '/dashboard/dealers' },
          { label: 'Đơn đặt hàng', icon: '📋', path: '/dashboard/orders' },
          { label: 'Báo cáo sản phẩm', icon: '📊', path: '/dashboard/reports' }
        ]
      case 'dealer_manager':
        return [
          ...commonItems,
          { label: 'Quản lý bán hàng', icon: '💰', path: '/dashboard/sales' },
          { label: 'Quản lý khách hàng', icon: '👥', path: '/dashboard/customers' },
          { label: 'Quản lý nhân viên', icon: '👨‍💼', path: '/dashboard/staff' },
          { label: 'Báo cáo doanh thu', icon: '📊', path: '/dashboard/reports' },
          { label: 'Quản lý tồn kho', icon: '📦', path: '/dashboard/inventory' }
        ]
      case 'dealer_staff':
        return [
          ...commonItems,
          { label: 'Bán hàng', icon: '💰', path: '/dashboard/sales' },
          { label: 'Khách hàng', icon: '👥', path: '/dashboard/customers' },
          { label: 'Sản phẩm', icon: '🚗', path: '/dashboard/vehicles' },
          { label: 'Lịch hẹn lái thử', icon: '🚙', path: '/dashboard/test-drives' },
          { label: 'Báo cáo cá nhân', icon: '📊', path: '/dashboard/reports' }
        ]
      default:
        return commonItems
    }
  }

  return (
    <div className="min-vh-100">
      {/* Top Navigation */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
        <Container fluid>
          <Button
            variant="outline-light"
            className="me-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </Button>
          
          <Navbar.Brand className="fw-bold">
            🚗 EV Dealer Management
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Dropdown>
                <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                  👤 {user?.full_name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.ItemText>
                    <small className="text-muted">
                      {getRoleDisplayName(user?.role)}
                    </small>
                  </Dropdown.ItemText>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    🚪 Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="p-0">
        <Row className="g-0">
          {/* Sidebar */}
          <Col 
            md={3} 
            lg={2} 
            className={`dashboard-sidebar ${sidebarOpen ? 'd-block' : 'd-none d-md-block'}`}
          >
            <div className="p-3">
              <h6 className="text-light mb-3">Menu chính</h6>
              <Nav className="flex-column sidebar-nav">
                {getSidebarItems().map((item, index) => (
                  <Nav.Link key={index} as={Link} to={item.path} className="text-decoration-none">
                    <span className="me-2">{item.icon}</span>
                    {item.label}
                  </Nav.Link>
                ))}
              </Nav>
            </div>
          </Col>

          {/* Main Content */}
          <Col md={9} lg={10} className="dashboard-content">
            <div className="p-4">
              {children}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default DashboardLayout
