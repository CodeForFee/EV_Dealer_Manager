import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, ProgressBar } from 'react-bootstrap'
import { mockVehicles, mockVehicleTypes, mockInventory } from '../../../data/mockData'

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState(mockVehicles)
  const [showModal, setShowModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [formData, setFormData] = useState({
    model_name: '',
    brand: '',
    year: new Date().getFullYear(),
    vehicle_type_id: '',
    battery_capacity: '',
    listed_price: '',
    version: '',
    available_colors: '',
    status: 'active'
  })

  const handleShowModal = (vehicle = null) => {
    setEditingVehicle(vehicle)
    if (vehicle) {
      setFormData({
        ...vehicle,
        available_colors: vehicle.available_colors.join(', ')
      })
    } else {
      setFormData({
        model_name: '',
        brand: '',
        year: new Date().getFullYear(),
        vehicle_type_id: '',
        battery_capacity: '',
        listed_price: '',
        version: '',
        available_colors: '',
        status: 'active'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingVehicle(null)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const vehicleData = {
      ...formData,
      year: parseInt(formData.year),
      battery_capacity: parseFloat(formData.battery_capacity),
      listed_price: parseFloat(formData.listed_price),
      available_colors: formData.available_colors.split(',').map(color => color.trim()),
      specifications: editingVehicle?.specifications || {
        range: '500km',
        acceleration: '3.1s 0-100km/h',
        top_speed: '261km/h',
        charging_time: '15 phút (Supercharger)'
      }
    }

    if (editingVehicle) {
      setVehicles(vehicles.map(v => 
        v.id === editingVehicle.id ? { ...v, ...vehicleData } : v
      ))
    } else {
      const newVehicle = {
        id: Math.max(...vehicles.map(v => v.id)) + 1,
        ...vehicleData
      }
      setVehicles([...vehicles, newVehicle])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setVehicles(vehicles.filter(v => v.id !== id))
    }
  }

  const toggleStatus = (id) => {
    setVehicles(vehicles.map(v => 
      v.id === id ? { ...v, status: v.status === 'active' ? 'inactive' : 'active' } : v
    ))
  }

  const getVehicleTypeName = (typeId) => {
    const type = mockVehicleTypes.find(t => t.id === typeId)
    return type ? type.type_name : 'Không xác định'
  }

  const getInventoryInfo = (vehicleId) => {
    const inventory = mockInventory.filter(inv => inv.vehicle_id === vehicleId)
    const totalStock = inventory.reduce((sum, inv) => sum + inv.available_quantity + inv.reserved_quantity, 0)
    const availableStock = inventory.reduce((sum, inv) => sum + inv.available_quantity, 0)
    return { totalStock, availableStock }
  }

  const totalVehicles = vehicles.length
  const activeVehicles = vehicles.filter(v => v.status === 'active').length
  const totalBrands = new Set(vehicles.map(v => v.brand)).size
  const totalValue = vehicles.reduce((sum, v) => sum + v.listed_price, 0)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">🚗 Quản lý sản phẩm</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Thêm sản phẩm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🚗</div>
              <h3 className="text-primary">{totalVehicles}</h3>
              <p className="text-muted mb-0">Tổng sản phẩm</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">✅</div>
              <h3 className="text-success">{activeVehicles}</h3>
              <p className="text-muted mb-0">Đang bán</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">🏷️</div>
              <h3 className="text-info">{totalBrands}</h3>
              <p className="text-muted mb-0">Thương hiệu</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">💰</div>
              <h3 className="text-warning">{(totalValue / 1000000000).toFixed(1)}B</h3>
              <p className="text-muted mb-0">Tổng giá trị (VNĐ)</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Vehicles Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách sản phẩm</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Thương hiệu</th>
                <th>Mẫu xe</th>
                <th>Loại</th>
                <th>Năm</th>
                <th>Phiên bản</th>
                <th>Giá bán</th>
                <th>Pin (kWh)</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => {
                const inventoryInfo = getInventoryInfo(vehicle.id)
                return (
                  <tr key={vehicle.id}>
                    <td>#{vehicle.id}</td>
                    <td>
                      <strong>{vehicle.brand}</strong>
                    </td>
                    <td>{vehicle.model_name}</td>
                    <td>{getVehicleTypeName(vehicle.vehicle_type_id)}</td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.version}</td>
                    <td>{vehicle.listed_price.toLocaleString('vi-VN')} VNĐ</td>
                    <td>{vehicle.battery_capacity} kWh</td>
                    <td>
                      <div>
                        <Badge bg="success">{inventoryInfo.availableStock}</Badge>
                        <span className="text-muted">/</span>
                        <Badge bg="info">{inventoryInfo.totalStock}</Badge>
                      </div>
                    </td>
                    <td>
                      <Badge bg={vehicle.status === 'active' ? 'success' : 'secondary'}>
                        {vehicle.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => handleShowModal(vehicle)}
                        >
                          ✏️
                        </Button>
                        <Button 
                          size="sm" 
                          variant={vehicle.status === 'active' ? 'outline-warning' : 'outline-success'}
                          onClick={() => toggleStatus(vehicle.id)}
                        >
                          {vehicle.status === 'active' ? '⏸️' : '▶️'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => handleDelete(vehicle.id)}
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
      {vehicles.some(v => {
        const inventoryInfo = getInventoryInfo(v.id)
        return inventoryInfo.availableStock < 3
      }) && (
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
            {editingVehicle ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thương hiệu *</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mẫu xe *</Form.Label>
                  <Form.Control
                    type="text"
                    name="model_name"
                    value={formData.model_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Năm sản xuất *</Form.Label>
                  <Form.Control
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="2020"
                    max="2030"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Phiên bản *</Form.Label>
                  <Form.Control
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Dung lượng pin (kWh) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="battery_capacity"
                    value={formData.battery_capacity}
                    onChange={handleInputChange}
                    step="0.1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá bán (VNĐ) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="listed_price"
                    value={formData.listed_price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Loại xe *</Form.Label>
                  <Form.Select
                    name="vehicle_type_id"
                    value={formData.vehicle_type_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn loại xe</option>
                    {mockVehicleTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.type_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Màu sắc có sẵn (phân cách bằng dấu phẩy) *</Form.Label>
              <Form.Control
                type="text"
                name="available_colors"
                value={formData.available_colors}
                onChange={handleInputChange}
                placeholder="Ví dụ: Đen, Trắng, Xám, Đỏ"
                required
              />
            </Form.Group>

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
              {editingVehicle ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default VehicleManagement
