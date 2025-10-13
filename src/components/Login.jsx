import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { mockUsers } from '../data/mockData'

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hoverBackBtn, setHoverBackBtn] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Add styles to document for placeholder text
    const styleElement = document.createElement('style')
    styleElement.innerHTML = `
      .custom-input {
        color: #FFFFFF !important;
      }
      .custom-input::placeholder {
        color: #9CA3AF !important;
        opacity: 1 !important;
      }
      .custom-input::-webkit-input-placeholder {
        color: #9CA3AF !important;
      }
      .custom-input::-moz-placeholder {
        color: #9CA3AF !important;
        opacity: 1 !important;
      }
      .custom-input:-ms-input-placeholder {
        color: #9CA3AF !important;
      }
    `
    if (!document.head.querySelector('#login-styles')) {
      styleElement.id = 'login-styles'
      document.head.appendChild(styleElement)
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const user = mockUsers.find(
        u => u.username === formData.username && u.password === formData.password
      )
      if (user) {
        login(user)
        navigate('/dashboard')
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng')
      }
    } catch {
      setError('Có lỗi xảy ra khi đăng nhập')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: '#1E252C',
        color: '#E6E9EC',
        position: 'relative',
      }}
    >
      {/* Back to Home Button */}
      <Link 
        to="/" 
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          backgroundColor: hoverBackBtn ? '#00AEEF' : '#2D3A47',
          color: '#FFFFFF',
          padding: '10px 20px',
          borderRadius: '8px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #404D5C',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          transform: hoverBackBtn ? 'translateX(-3px)' : 'translateX(0)',
        }}
        onMouseEnter={() => setHoverBackBtn(true)}
        onMouseLeave={() => setHoverBackBtn(false)}
      >
        <span style={{ fontSize: '18px' }}>←</span>
        <span>Back to Home</span>
      </Link>

      <Container>
        <Row className="justify-content-center">
          <Col md={5} lg={4}>
            <Card
              className="shadow-lg border-0"
              style={{
                backgroundColor: '#24313E',
                borderRadius: '12px',
                boxShadow: '0 0 20px rgba(0, 174, 255, 0.25)',
              }}
            >
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '15px',
                      background: 'linear-gradient(135deg, #00AEEF, #0078FF)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      boxShadow: '0 0 12px rgba(0, 174, 255, 0.6)',
                    }}
                  >
                    ⚡
                  </div>
                  <h4 className="mt-3 mb-1 fw-bold" style={{ color: '#FFFFFF' }}>Welcome Back</h4>
                  <p className="mb-4" style={{ color: '#9CA3AF' }}>Sign in to your EVW Pro account</p>
                </div>

                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#E5E7EB' }}>Username</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#2D3A47', border: '1px solid #404D5C' }}>📧</span>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="custom-input"
                        style={{
                          backgroundColor: '#2D3A47',
                          border: '1px solid #404D5C',
                          color: '#FFFFFF',
                        }}
                        onFocus={(e) => (e.target.style.border = '1px solid #00AEEF')}
                        onBlur={(e) => (e.target.style.border = '1px solid #404D5C')}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ color: '#E5E7EB' }}>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#2D3A47', border: '1px solid #404D5C' }}>🔒</span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="custom-input"
                        style={{
                          backgroundColor: '#2D3A47',
                          border: '1px solid #404D5C',
                          color: '#FFFFFF',
                        }}
                        onFocus={(e) => (e.target.style.border = '1px solid #00AEEF')}
                        onBlur={(e) => (e.target.style.border = '1px solid #404D5C')}
                      />
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Check 
                      label="Remember me" 
                      style={{ color: '#9CA3AF' }}
                    />
                    <Link to="#" className="text-decoration-none" style={{ color: '#00AEEF' }}>
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-100 fw-semibold"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(90deg, #00AEEF, #0078FF)',
                      border: 'none',
                      color: '#fff',
                      padding: '10px 0',
                      borderRadius: '8px',
                      boxShadow: '0 0 10px rgba(0, 174, 255, 0.5)',
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <span style={{ color: '#9CA3AF' }}>Don't have an account?</span>{' '}
                  <Link to="/" className="text-decoration-none" style={{ color: '#00BFFF' }}>
                    Sign up
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login