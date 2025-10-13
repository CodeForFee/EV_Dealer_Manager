import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, ProgressBar } from 'react-bootstrap'
import { mockInventory, mockVehicles, mockDealers } from '../../../data/mockData'

const InventoryManagement = () => {
  const [inventory, setInventory] = useState(mockInventory)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    dealer_id: '',
    vehicle_id: '',
    available_quantity: '',
    reserved_quantity: ''
  })

  const handleShowModal = (item = null) => {
    setEditingItem(item)
    if (item) {
      setFormData({
        dealer_id: item.dealer_id,
        vehicle_id: item.vehicle_id,
        available_quantity: item.available_quantity,
        reserved_quantity: item.reserved_quantity
      })
    } else {
      setFormData({
        dealer_id: '',
        vehicle_id: '',
        available_quantity: '',
        reserved_quantity: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const inventoryData = {
      ...formData,
      dealer_id: parseInt(formData.dealer_id),
      vehicle_id: parseInt(formData.vehicle_id),
      available_quantity: parseInt(formData.available_quantity),
      reserved_quantity: parseInt(formData.reserved_quantity),
      inventory_type: 'available',
      last_updated: new Date().toISOString()
    }

    if (editingItem) {
      setInventory(inventory.map(item => 
        item.id === editingItem.id ? { ...item, ...inventoryData } : item
      ))
    } else {
      const newItem = {
        id: Math.max(...inventory.map(item => item.id)) + 1,
        ...inventoryData
      }
      setInventory([...inventory, newItem])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục tồn kho này?')) {
      setInventory(inventory.filter(item => item.id !== id))
    }
  }

  const getVehicleName = (vehicleId) => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId)
    return vehicle ? `${vehicle.brand} ${vehicle.model_name}` : 'Không xác định'
  }

  const getDealerName = (dealerId) => {
    const dealer = mockDealers.find(d => d.id === dealerId)
    return dealer ? dealer.name : 'Không xác định'
  }

  const totalInventory = inventory.reduce((sum, item) => sum + item.available_quantity, 0)
  const totalReserved = inventory.reduce((sum, item) => sum + item.reserved_quantity, 0)
  const totalStock = totalInventory + totalReserved

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📦 Quản lý tồn kho</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Thêm mục tồn kho
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">📦</div>
              <h3 className="text-primary">{totalStock}</h3>
              <p className="text-muted mb-0">Tổng tồn kho</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">✅</div>
              <h3 className="text-success">{totalInventory}</h3>
              <p className="text-muted mb-0">Có sẵn</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">🔒</div>
              <h3 className="text-warning">{totalReserved}</h3>
              <p className="text-muted mb-0">Đã đặt</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">🏢</div>
              <h3 className="text-info">{new Set(inventory.map(item => item.dealer_id)).size}</h3>
              <p className="text-muted mb-0">Đại lý</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Inventory Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách tồn kho</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Đại lý</th>
                <th>Sản phẩm</th>
                <th>Có sẵn</th>
                <th>Đã đặt</th>
                <th>Tổng</th>
                <th>Tỷ lệ</th>
                <th>Cập nhật</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const total = item.available_quantity + item.reserved_quantity
                const percentage = total > 0 ? (item.available_quantity / total) * 100 : 0
                
                return (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>
                      <strong>{getDealerName(item.dealer_id)}</strong>
                    </td>
                    <td>{getVehicleName(item.vehicle_id)}</td>
                    <td>
                      <Badge bg="success">{item.available_quantity}</Badge>
                    </td>
                    <td>
                      <Badge bg="warning">{item.reserved_quantity}</Badge>
                    </td>
                    <td>
                      <strong>{total}</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <ProgressBar 
                          now={percentage} 
                          variant={percentage > 50 ? 'success' : percentage > 25 ? 'warning' : 'danger'}
                          style={{ width: '60px', height: '8px' }}
                          className="me-2"
                        />
                        <small>{percentage.toFixed(1)}%</small>
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(item.last_updated).toLocaleDateString('vi-VN')}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => handleShowModal(item)}
                        >
                          ✏️
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => handleDelete(item.id)}
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

      {/* Low Stock Alert */}
      {inventory.some(item => item.available_quantity < 3) && (
        <Alert variant="warning" className="mt-4">
          <h5>⚠️ Cảnh báo tồn kho thấp</h5>
          <p className="mb-0">
            Một số sản phẩm có tồn kho dưới 3 đơn vị. Vui lòng kiểm tra và bổ sung tồn kho.
          </p>
        </Alert>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingItem ? '✏️ Chỉnh sửa tồn kho' : '➕ Thêm mục tồn kho mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Đại lý *</Form.Label>
                  <Form.Select
                    name="dealer_id"
                    value={formData.dealer_id}
                    onChange={handleInputChange}
                    required
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sản phẩm *</Form.Label>
                  <Form.Select
                    name="vehicle_id"
                    value={formData.vehicle_id}
                    onChange={handleInputChange}
                    required
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
                  <Form.Label>Số lượng có sẵn *</Form.Label>
                  <Form.Control
                    type="number"
                    name="available_quantity"
                    value={formData.available_quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng đã đặt *</Form.Label>
                  <Form.Control
                    type="number"
                    name="reserved_quantity"
                    value={formData.reserved_quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit" className="ev-button">
              {editingItem ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default InventoryManagement

