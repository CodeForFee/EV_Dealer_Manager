import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, ProgressBar } from 'react-bootstrap'
import { mockDealers, mockOrders, mockInventory } from '../../../data/mockData'

const DealerManagement = () => {
  const [dealers, setDealers] = useState(mockDealers)
  const [showModal, setShowModal] = useState(false)
  const [editingDealer, setEditingDealer] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    representative_name: '',
    region: '',
    status: 'active'
  })

  const handleShowModal = (dealer = null) => {
    setEditingDealer(dealer)
    if (dealer) {
      setFormData(dealer)
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        representative_name: '',
        region: '',
        status: 'active'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingDealer(null)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingDealer) {
      setDealers(dealers.map(d => 
        d.id === editingDealer.id ? { ...d, ...formData } : d
      ))
    } else {
      const newDealer = {
        id: Math.max(...dealers.map(d => d.id)) + 1,
        ...formData
      }
      setDealers([...dealers, newDealer])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đại lý này?')) {
      setDealers(dealers.filter(d => d.id !== id))
    }
  }

  const toggleStatus = (id) => {
    setDealers(dealers.map(d => 
      d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d
    ))
  }

  const getDealerStats = (dealerId) => {
    const dealerOrders = mockOrders.filter(order => order.dealer_id === dealerId)
    const totalOrders = dealerOrders.length
    const totalRevenue = dealerOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const dealerInventory = mockInventory.filter(inv => inv.dealer_id === dealerId)
    const totalStock = dealerInventory.reduce((sum, inv) => sum + inv.available_quantity + inv.reserved_quantity, 0)
    
    return { totalOrders, totalRevenue, totalStock }
  }

  const totalDealers = dealers.length
  const activeDealers = dealers.filter(d => d.status === 'active').length
  const totalRegions = new Set(dealers.map(d => d.region)).size
  const totalRevenue = dealers.reduce((sum, dealer) => {
    const stats = getDealerStats(dealer.id)
    return sum + stats.totalRevenue
  }, 0)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">🏢 Quản lý đại lý</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Thêm đại lý mới
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🏢</div>
              <h3 className="text-primary">{totalDealers}</h3>
              <p className="text-muted mb-0">Tổng đại lý</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">✅</div>
              <h3 className="text-success">{activeDealers}</h3>
              <p className="text-muted mb-0">Đang hoạt động</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">🌍</div>
              <h3 className="text-info">{totalRegions}</h3>
              <p className="text-muted mb-0">Khu vực</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">💰</div>
              <h3 className="text-warning">{(totalRevenue / 1000000000).toFixed(1)}B</h3>
              <p className="text-muted mb-0">Tổng doanh thu (VNĐ)</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Dealers Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách đại lý</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên đại lý</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Người đại diện</th>
                <th>Khu vực</th>
                <th>Đơn hàng</th>
                <th>Doanh thu</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map((dealer) => {
                const stats = getDealerStats(dealer.id)
                return (
                  <tr key={dealer.id}>
                    <td>#{dealer.id}</td>
                    <td>
                      <strong>{dealer.name}</strong>
                    </td>
                    <td>{dealer.address}</td>
                    <td>{dealer.phone}</td>
                    <td>{dealer.representative_name}</td>
                    <td>{dealer.region}</td>
                    <td>
                      <Badge bg="primary">{stats.totalOrders}</Badge>
                    </td>
                    <td>
                      <strong>{stats.totalRevenue.toLocaleString('vi-VN')} VNĐ</strong>
                    </td>
                    <td>
                      <Badge bg="info">{stats.totalStock}</Badge>
                    </td>
                    <td>
                      <Badge bg={dealer.status === 'active' ? 'success' : 'secondary'}>
                        {dealer.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => handleShowModal(dealer)}
                        >
                          ✏️
                        </Button>
                        <Button 
                          size="sm" 
                          variant={dealer.status === 'active' ? 'outline-warning' : 'outline-success'}
                          onClick={() => toggleStatus(dealer.id)}
                        >
                          {dealer.status === 'active' ? '⏸️' : '▶️'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => handleDelete(dealer.id)}
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

      {/* Performance by Region */}
      <Row className="g-4 mt-4">
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🌍 Hiệu suất theo khu vực</h5>
            </Card.Header>
            <Card.Body>
              {Array.from(new Set(dealers.map(d => d.region))).map(region => {
                const regionDealers = dealers.filter(d => d.region === region)
                const regionRevenue = regionDealers.reduce((sum, dealer) => {
                  const stats = getDealerStats(dealer.id)
                  return sum + stats.totalRevenue
                }, 0)
                const percentage = totalRevenue > 0 ? (regionRevenue / totalRevenue) * 100 : 0
                
                return (
                  <div key={region} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold">{region}</span>
                      <span className="text-primary">
                        {regionRevenue.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">{regionDealers.length} đại lý</small>
                      <small className="text-muted">{percentage.toFixed(1)}%</small>
                    </div>
                    <ProgressBar 
                      now={percentage} 
                      variant="primary"
                      className="mb-2"
                    />
                  </div>
                )
              })}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🏆 Top đại lý</h5>
            </Card.Header>
            <Card.Body>
              {dealers
                .map(dealer => ({
                  ...dealer,
                  ...getDealerStats(dealer.id)
                }))
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .slice(0, 5)
                .map((dealer, index) => (
                  <div key={dealer.id} className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <strong>{dealer.name}</strong>
                      <br />
                      <small className="text-muted">{dealer.region}</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-primary">
                        {dealer.totalRevenue.toLocaleString('vi-VN')} VNĐ
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
            {editingDealer ? '✏️ Chỉnh sửa đại lý' : '➕ Thêm đại lý mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên đại lý *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Người đại diện *</Form.Label>
                  <Form.Control
                    type="text"
                    name="representative_name"
                    value={formData.representative_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Khu vực *</Form.Label>
                  <Form.Select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn khu vực</option>
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Trung">Miền Trung</option>
                    <option value="Miền Nam">Miền Nam</option>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit" className="ev-button">
              {editingDealer ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default DealerManagement
