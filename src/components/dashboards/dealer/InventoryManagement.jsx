import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, ProgressBar } from 'react-bootstrap'
import { mockInventory, mockVehicles, mockOrders } from '../../../data/mockData'

const InventoryManagement = () => {
  // Filter inventory for current dealer (dealer_id = 1)
  const [inventory, setInventory] = useState(mockInventory.filter(inv => inv.dealer_id === 1))
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    vehicle_id: '',
    available_quantity: '',
    reserved_quantity: ''
  })

  const handleShowModal = (item = null) => {
    setEditingItem(item)
    if (item) {
      setFormData({
        vehicle_id: item.vehicle_id,
        available_quantity: item.available_quantity,
        reserved_quantity: item.reserved_quantity
      })
    } else {
      setFormData({
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
        dealer_id: 1, // Current dealer ID
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

  const getVehiclePrice = (vehicleId) => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId)
    return vehicle ? vehicle.listed_price : 0
  }

  const getSalesData = (vehicleId) => {
    const vehicleOrders = mockOrders.filter(order => 
      order.dealer_id === 1 && order.vehicle_id === vehicleId
    )
    return vehicleOrders.length
  }

  const totalInventory = inventory.reduce((sum, item) => sum + item.available_quantity, 0)
  const totalReserved = inventory.reduce((sum, item) => sum + item.reserved_quantity, 0)
  const totalStock = totalInventory + totalReserved
  const totalValue = inventory.reduce((sum, item) => {
    const price = getVehiclePrice(item.vehicle_id)
    return sum + (item.available_quantity * price)
  }, 0)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📦 Quản lý kho</h2>
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
              <div className="display-4 text-info mb-2">💰</div>
              <h3 className="text-info">{(totalValue / 1000000000).toFixed(1)}B</h3>
              <p className="text-muted mb-0">Tổng giá trị (VNĐ)</p>
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
                <th>Sản phẩm</th>
                <th>Giá bán</th>
                <th>Có sẵn</th>
                <th>Đã đặt</th>
                <th>Tổng</th>
                <th>Giá trị</th>
                <th>Đã bán</th>
                <th>Tỷ lệ</th>
                <th>Cập nhật</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const total = item.available_quantity + item.reserved_quantity
                const percentage = total > 0 ? (item.available_quantity / total) * 100 : 0
                const vehiclePrice = getVehiclePrice(item.vehicle_id)
                const itemValue = item.available_quantity * vehiclePrice
                const salesCount = getSalesData(item.vehicle_id)
                
                return (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>
                      <strong>{getVehicleName(item.vehicle_id)}</strong>
                    </td>
                    <td>{vehiclePrice.toLocaleString('vi-VN')} VNĐ</td>
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
                      <strong>{itemValue.toLocaleString('vi-VN')} VNĐ</strong>
                    </td>
                    <td>
                      <Badge bg="info">{salesCount}</Badge>
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

      {/* Inventory Analysis */}
      <Row className="g-4 mt-4">
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📊 Phân tích tồn kho</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Tồn kho cao (&gt;10):</span>
                  <strong className="text-warning">
                    {inventory.filter(item => item.available_quantity > 10).length} sản phẩm
                  </strong>
                </div>
                <ProgressBar 
                  now={(inventory.filter(item => item.available_quantity > 10).length / inventory.length) * 100} 
                  variant="warning"
                  className="mb-2"
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Tồn kho thấp (&lt;3):</span>
                  <strong className="text-danger">
                    {inventory.filter(item => item.available_quantity < 3).length} sản phẩm
                  </strong>
                </div>
                <ProgressBar 
                  now={(inventory.filter(item => item.available_quantity < 3).length / inventory.length) * 100} 
                  variant="danger"
                  className="mb-2"
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Tồn kho bình thường:</span>
                  <strong className="text-success">
                    {inventory.filter(item => item.available_quantity >= 3 && item.available_quantity <= 10).length} sản phẩm
                  </strong>
                </div>
                <ProgressBar 
                  now={(inventory.filter(item => item.available_quantity >= 3 && item.available_quantity <= 10).length / inventory.length) * 100} 
                  variant="success"
                  className="mb-2"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🚗 Top sản phẩm tồn kho</h5>
            </Card.Header>
            <Card.Body>
              {inventory
                .map(item => ({
                  ...item,
                  vehicleName: getVehicleName(item.vehicle_id),
                  vehiclePrice: getVehiclePrice(item.vehicle_id),
                  totalStock: item.available_quantity + item.reserved_quantity,
                  itemValue: item.available_quantity * getVehiclePrice(item.vehicle_id)
                }))
                .sort((a, b) => b.itemValue - a.itemValue)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <strong>{item.vehicleName}</strong>
                      <br />
                      <small className="text-muted">{item.available_quantity} có sẵn</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-primary">
                        {item.itemValue.toLocaleString('vi-VN')} VNĐ
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
            {editingItem ? '✏️ Chỉnh sửa tồn kho' : '➕ Thêm mục tồn kho mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Sản phẩm *</Form.Label>
                  <Form.Select
                    name="vehicle_id"
                    value={formData.vehicle_id}
                    onChange={handleInputChange}
                    required
                    disabled={editingItem}
                  >
                    <option value="">Chọn sản phẩm</option>
                    {mockVehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model_name} - {vehicle.listed_price.toLocaleString('vi-VN')} VNĐ
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

            {formData.vehicle_id && (
              <Alert variant="info">
                <strong>Thông tin sản phẩm:</strong><br />
                {getVehicleName(formData.vehicle_id)}<br />
                Giá bán: {getVehiclePrice(formData.vehicle_id).toLocaleString('vi-VN')} VNĐ
              </Alert>
            )}
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
