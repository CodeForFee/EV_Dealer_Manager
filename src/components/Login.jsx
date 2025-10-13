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
  const [hoverSubmit, setHoverSubmit] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.innerHTML = `
      .custom-input {
        color: #FFFFFF !important;
      }
      .custom-input::placeholder {
        color: #6B7280 !important;
        opacity: 1 !important;
      }
      .custom-input::-webkit-input-placeholder {
        color: #6B7280 !important;
      }
      .custom-input::-moz-placeholder {
        color: #6B7280 !important;
        opacity: 1 !important;
      }
      .custom-input:-ms-input-placeholder {
        color: #6B7280 !important;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .floating-icon {
        animation: float 3s ease-in-out infinite;
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
      className="min-vh-100"
      style={{
        backgroundColor: '#1a2332',
        color: '#E6E9EC',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Back to Home Button */}
      <Link 
        to="/" 
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          backgroundColor: hoverBackBtn ? '#00AEEF' : 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          color: '#FFFFFF',
          padding: '10px 20px',
          borderRadius: '10px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(71, 85, 105, 0.5)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          transform: hoverBackBtn ? 'translateX(-3px)' : 'translateX(0)',
          fontSize: '14px',
          fontWeight: '500',
        }}
        onMouseEnter={() => setHoverBackBtn(true)}
        onMouseLeave={() => setHoverBackBtn(false)}
      >
        <span style={{ fontSize: '18px' }}>←</span>
        <span>Back to Home</span>
      </Link>

      <Container fluid className="h-100 p-0">
        <Row className="min-vh-100 g-0">
          {/* Left Side - Image Section */}
          <Col lg={6} className="d-none d-lg-block" style={{
            backgroundColor: '#1a2332',
            position: 'relative',
            padding: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Image container */}
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              position: 'relative',
            }}>
              <img 
                src="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/4/8/1177458/Tesla-Model-S.jpg" 
                alt="Login illustration"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback placeholder */}
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.9) 0%, rgba(45, 90, 123, 0.9) 100%)',
                display: 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                position: 'absolute',
                top: 0,
                left: 0,
              }}>
                <div style={{
                  fontSize: '80px',
                  opacity: 0.7,
                }}>🚗</div>
                <div style={{
                  color: '#94a3b8',
                  fontSize: '18px',
                  fontWeight: '500',
                  textAlign: 'center',
                  padding: '0 40px',
                }}>
                  Your Image/GIF Here
                  <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>
                    Replace with your actual image URL
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Side - Login Form */}
          <Col lg={6} className="d-flex align-items-center justify-content-center" style={{
            backgroundColor: '#1a2332',
            padding: '40px 20px',
          }}>
            <div style={{ width: '100%', maxWidth: '420px', padding: '0 20px' }}>
              {/* Icon and Title Section */}
              <div className="text-center mb-5">
                <div
                  className="floating-icon"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #00AEEF, #0EA5E9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 10px 30px rgba(0, 174, 239, 0.4)',
                    fontSize: '32px',
                  }}
                >
                  ⚡
                </div>
                <h3 className="mt-4 mb-2 fw-bold" style={{ color: '#FFFFFF', fontSize: '26px', letterSpacing: '-0.5px' }}>Welcome Back</h3>
                <p className="mb-0" style={{ color: '#94a3b8', fontSize: '14px' }}>Sign in to continue to EVW Pro</p>
              </div>

              {error && (
                <Alert 
                  variant="danger" 
                  className="text-center mb-4"
                  style={{
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    border: '1px solid rgba(220, 53, 69, 0.3)',
                    borderRadius: '10px',
                    color: '#ff6b6b',
                    padding: '12px',
                    fontSize: '14px',
                  }}
                >
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Username Field */}
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    Username
                  </Form.Label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '18px',
                      zIndex: 1,
                    }}>📧</span>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                      className="custom-input"
                      style={{
                        backgroundColor: '#273447',
                        border: focusedField === 'username' ? '1px solid #00AEEF' : '1px solid #334155',
                        color: '#FFFFFF',
                        paddingLeft: '44px',
                        paddingRight: '14px',
                        height: '48px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    Password
                  </Form.Label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '18px',
                      zIndex: 1,
                    }}>🔒</span>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="custom-input"
                      style={{
                        backgroundColor: '#273447',
                        border: focusedField === 'password' ? '1px solid #00AEEF' : '1px solid #334155',
                        color: '#FFFFFF',
                        paddingLeft: '44px',
                        paddingRight: '14px',
                        height: '48px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </Form.Group>

                {/* Remember me & Forgot password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check 
                    label="Remember me" 
                    style={{ 
                      color: '#94a3b8',
                      fontSize: '13px',
                    }}
                  />
                  <Link 
                    to="#" 
                    className="text-decoration-none" 
                    style={{ 
                      color: '#00AEEF',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#0EA5E9'}
                    onMouseLeave={(e) => e.target.style.color = '#00AEEF'}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-100 fw-semibold"
                  disabled={loading}
                  style={{
                    background: hoverSubmit && !loading ? 'linear-gradient(90deg, #0EA5E9, #0284c7)' : 'linear-gradient(90deg, #00AEEF, #0284c7)',
                    border: 'none',
                    color: '#fff',
                    padding: '13px 0',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0, 174, 239, 0.3)',
                    transform: hoverSubmit && !loading ? 'translateY(-1px)' : 'translateY(0)',
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={() => setHoverSubmit(true)}
                  onMouseLeave={() => setHoverSubmit(false)}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }} />
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </Button>
              </Form>

              {/* Sign up link */}
              <div className="text-center mt-4">
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Don't have an account?</span>{' '}
                <Link 
                  to="/" 
                  className="text-decoration-none" 
                  style={{ 
                    color: '#00AEEF',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#0EA5E9'}
                  onMouseLeave={(e) => e.target.style.color = '#00AEEF'}
                >
                  Sign up now
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Login