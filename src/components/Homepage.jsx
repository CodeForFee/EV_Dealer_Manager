import { Container, Row, Col, Card, Button, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { mockVehicles } from "../data/mockData";
import evHomepageImage from "../assets/images/ev-hompage.jpg";
import teslaImage from "../assets/images/tesla.jpg";
import tesla2Image from "../assets/images/tesla 2.jpg";
import bydImage from "../assets/images/byd.jpg";
import "../Homepage.css";

const Homepage = () => {
  // Array of vehicle images
  const vehicleImages = [teslaImage, tesla2Image, bydImage];

  return (
    <div className="homepage-dark">
      {/* Navbar */}
      <Navbar expand="lg" className="ev-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-info">
            ⚡ EV Dealer Management System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login" className="btn btn-outline-info fw-semibold">
                Đăng nhập
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="hero-title">
                Electric <span>Vehicle</span> Management
              </h1>
              <p className="hero-desc">
                Hệ thống quản lý xe điện toàn diện cho đại lý, nhân viên và quản trị viên.  
                Trải nghiệm nền tảng hiện đại với các tính năng tối ưu vận hành.
              </p>
              <div className="d-flex gap-3 mt-4">
                <Button as={Link} to="/login" className="btn-glow">
                  🚀 Launch Dashboard
                </Button>
                <Button variant="outline-light" className="btn-outline-glow">
                  ▶️ Watch Demo
                </Button>
              </div>
              <div className="mt-5 hero-stats d-flex gap-5 text-light">
                <div><h5>50K+</h5><p>Xe đã quản lý</p></div>
                <div><h5>1.2K</h5><p>Đại lý hoạt động</p></div>
                <div><h5>99.9%</h5><p>Uptime</p></div>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src={evHomepageImage}
                alt="EV Hero"
                className="hero-image"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="analytics-section" style={{ backgroundColor: '#0a0f1a', padding: '80px 0' }}>
        <Container>
          <h2 className="text-center mb-5 fw-bold" style={{ color: '#00c4ff', fontSize: '2.5rem' }}>
            📊 Real-Time Analytics
          </h2>
          <Row className="g-4 text-center">
            <Col md={3}>
              <Card className="analytics-card" style={{ 
                backgroundColor: '#121b2f', 
                border: '1px solid rgba(0, 196, 255, 0.2)',
                borderRadius: '16px',
                padding: '25px 15px',
                transition: 'all 0.3s ease'
              }}>
                <Card.Body>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00c4ff', marginBottom: '10px' }}>
                    2,847
                  </div>
                  <p style={{ color: '#b8c2cc', fontSize: '1rem', marginBottom: '10px' }}>
                    🚗 Xe hoạt động
                  </p>
                  <span style={{ color: '#00ff88', fontSize: '0.9rem', fontWeight: '600' }}>
                    ↗️ +12.3%
                  </span>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="analytics-card" style={{ 
                backgroundColor: '#121b2f', 
                border: '1px solid rgba(0, 196, 255, 0.2)',
                borderRadius: '16px',
                padding: '25px 15px',
                transition: 'all 0.3s ease'
              }}>
                <Card.Body>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00c4ff', marginBottom: '10px' }}>
                    847 kWh
                  </div>
                  <p style={{ color: '#b8c2cc', fontSize: '1rem', marginBottom: '10px' }}>
                    ⚡ Năng lượng tiêu thụ
                  </p>
                  <span style={{ color: '#00ff88', fontSize: '0.9rem', fontWeight: '600' }}>
                    ↗️ +8.7%
                  </span>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="analytics-card" style={{ 
                backgroundColor: '#121b2f', 
                border: '1px solid rgba(0, 196, 255, 0.2)',
                borderRadius: '16px',
                padding: '25px 15px',
                transition: 'all 0.3s ease'
              }}>
                <Card.Body>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00c4ff', marginBottom: '10px' }}>
                    $847K
                  </div>
                  <p style={{ color: '#b8c2cc', fontSize: '1rem', marginBottom: '10px' }}>
                    💰 Doanh thu tháng
                  </p>
                  <span style={{ color: '#00ff88', fontSize: '0.9rem', fontWeight: '600' }}>
                    ↗️ +5.7%
                  </span>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="analytics-card" style={{ 
                backgroundColor: '#121b2f', 
                border: '1px solid rgba(0, 196, 255, 0.2)',
                borderRadius: '16px',
                padding: '25px 15px',
                transition: 'all 0.3s ease'
              }}>
                <Card.Body>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00c4ff', marginBottom: '10px' }}>
                    1,247
                  </div>
                  <p style={{ color: '#b8c2cc', fontSize: '1rem', marginBottom: '10px' }}>
                    👥 Khách hàng
                  </p>
                  <span style={{ color: '#00ff88', fontSize: '0.9rem', fontWeight: '600' }}>
                    ↗️ +2.1%
                  </span>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <Container>
          <h2 className="text-center text-info fw-bold mb-5">
            Featured Electric Vehicles
          </h2>
          <Row className="g-4">
            {mockVehicles.slice(0, 3).map((vehicle, index) => (
              <Col md={4} key={vehicle.id}>
                <Card className="vehicle-card">
                  <div className="vehicle-img">
                    <img
                      src={vehicleImages[index]}
                      alt={vehicle.model_name}
                    />
                    <span className="badge-new">New</span>
                  </div>
                  <Card.Body>
                    <h5 className="fw-bold text-light">{vehicle.model_name}</h5>
                    <p className="text-secondary small">
                      {vehicle.specifications.range} • {vehicle.specifications.acceleration}
                    </p>
                    <h6 className="text-info mb-3">
                      {vehicle.listed_price.toLocaleString("vi-VN")} VNĐ
                    </h6>
                    <Button variant="info" size="sm" className="w-100">
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="ev-footer py-4 text-center text-secondary">
        <Container>
          <p>© 2025 EV Dealer Pro. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default Homepage;
