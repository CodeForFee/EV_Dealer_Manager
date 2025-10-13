import { useState } from 'react'
import { Row, Col, Card, Table, Button, Badge, Alert, ProgressBar } from 'react-bootstrap'
import { mockVehicles, mockInventory, mockOrders } from '../../../data/mockData'

const Products = () => {
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  // Filter inventory for current dealer (dealer_id = 1)
  const dealerInventory = mockInventory.filter(inv => inv.dealer_id === 1)

  // Get vehicle details with inventory info
  const productsWithInventory = mockVehicles.map(vehicle => {
    const inventory = dealerInventory.find(inv => inv.vehicle_id === vehicle.id)
    const salesCount = mockOrders.filter(order => 
      order.dealer_id === 1 && order.vehicle_id === vehicle.id
    ).length
    
    return {
      ...vehicle,
      available_quantity: inventory?.available_quantity || 0,
      reserved_quantity: inventory?.reserved_quantity || 0,
      total_stock: (inventory?.available_quantity || 0) + (inventory?.reserved_quantity || 0),
      sales_count: salesCount,
      turnover_rate: inventory && inventory.available_quantity > 0 ? 
        (salesCount / inventory.available_quantity) * 100 : 0
    }
  })

  // Filter products based on selected filters
  const filteredProducts = productsWithInventory.filter(product => {
    const brandMatch = selectedBrand === 'all' || product.brand === selectedBrand
    const typeMatch = selectedType === 'all' || product.vehicle_type_id.toString() === selectedType
    return brandMatch && typeMatch
  })

  const totalProducts = filteredProducts.length
  const totalStock = filteredProducts.reduce((sum, product) => sum + product.total_stock, 0)
  const totalValue = filteredProducts.reduce((sum, product) => 
    sum + (product.available_quantity * product.listed_price), 0)
  const totalSales = filteredProducts.reduce((sum, product) => sum + product.sales_count, 0)

  const getVehicleTypeName = (typeId) => {
    const typeMap = {
      1: 'Sedan',
      2: 'SUV', 
      3: 'Hatchback'
    }
    return typeMap[typeId] || 'Không xác định'
  }

  const getStockStatus = (available, total) => {
    if (available === 0) return { status: 'Hết hàng', bg: 'danger' }
    if (available < 3) return { status: 'Sắp hết', bg: 'warning' }
    if (available > 10) return { status: 'Dư thừa', bg: 'info' }
    return { status: 'Bình thường', bg: 'success' }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">🚗 Sản phẩm</h2>
        <Button variant="primary" className="ev-button">
          📊 Báo cáo sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <Card className="ev-card mb-4">
        <Card.Header>
          <h5 className="mb-0">🔍 Bộ lọc sản phẩm</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <label className="form-label">Thương hiệu</label>
              <select 
                className="form-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="all">Tất cả thương hiệu</option>
                {Array.from(new Set(mockVehicles.map(v => v.brand))).map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </Col>
            <Col md={6}>
              <label className="form-label">Loại xe</label>
              <select 
                className="form-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">Tất cả loại xe</option>
                <option value="1">Sedan</option>
                <option value="2">SUV</option>
                <option value="3">Hatchback</option>
              </select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🚗</div>
              <h3 className="text-primary">{totalProducts}</h3>
              <p className="text-muted mb-0">Sản phẩm</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">📦</div>
              <h3 className="text-success">{totalStock}</h3>
              <p className="text-muted mb-0">Tổng tồn kho</p>
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
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">📈</div>
              <h3 className="text-warning">{totalSales}</h3>
              <p className="text-muted mb-0">Đã bán</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Products Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách sản phẩm</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Thương hiệu</th>
                <th>Mẫu xe</th>
                <th>Loại</th>
                <th>Năm</th>
                <th>Phiên bản</th>
                <th>Giá bán</th>
                <th>Pin (kWh)</th>
                <th>Tồn kho</th>
                <th>Đã bán</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.available_quantity, product.total_stock)
                return (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.brand}</strong>
                    </td>
                    <td>{product.model_name}</td>
                    <td>{getVehicleTypeName(product.vehicle_type_id)}</td>
                    <td>{product.year}</td>
                    <td>{product.version}</td>
                    <td>{product.listed_price.toLocaleString('vi-VN')} VNĐ</td>
                    <td>{product.battery_capacity} kWh</td>
                    <td>
                      <div>
                        <Badge bg="success">{product.available_quantity}</Badge>
                        <span className="text-muted">/</span>
                        <Badge bg="info">{product.total_stock}</Badge>
                      </div>
                    </td>
                    <td>
                      <Badge bg="primary">{product.sales_count}</Badge>
                    </td>
                    <td>
                      <Badge bg={stockStatus.bg}>{stockStatus.status}</Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary">
                          👁️
                        </Button>
                        <Button size="sm" variant="outline-info">
                          🚙
                        </Button>
                        <Button size="sm" variant="outline-success">
                          💰
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
      {filteredProducts.some(product => product.available_quantity < 3) && (
        <Alert variant="warning" className="mt-4">
          <h5>⚠️ Cảnh báo tồn kho thấp</h5>
          <p className="mb-0">
            Một số sản phẩm có tồn kho dưới 3 đơn vị. Vui lòng liên hệ quản lý để bổ sung tồn kho.
          </p>
        </Alert>
      )}

      {/* Product Performance */}
      <Row className="g-4 mt-4">
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📊 Hiệu suất sản phẩm</h5>
            </Card.Header>
            <Card.Body>
              {filteredProducts
                .sort((a, b) => b.sales_count - a.sales_count)
                .slice(0, 5)
                .map((product, index) => (
                  <div key={product.id} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold">{product.brand} {product.model_name}</span>
                      <span className="text-primary">{product.sales_count} bán</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">{product.available_quantity} có sẵn</small>
                      <small className="text-muted">
                        {product.turnover_rate.toFixed(1)}% luân chuyển
                      </small>
                    </div>
                    <ProgressBar 
                      now={product.turnover_rate} 
                      variant="primary"
                      className="mb-2"
                    />
                  </div>
                ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🏆 Top sản phẩm bán chạy</h5>
            </Card.Header>
            <Card.Body>
              {filteredProducts
                .sort((a, b) => b.sales_count - a.sales_count)
                .slice(0, 5)
                .map((product, index) => (
                  <div key={product.id} className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <strong>{product.brand} {product.model_name}</strong>
                      <br />
                      <small className="text-muted">{product.version}</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-primary">
                        {product.sales_count} bán
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

      {/* Product Categories */}
      <Row className="g-4 mt-4">
        <Col lg={12}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📈 Phân tích theo thương hiệu</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Thương hiệu</th>
                    <th>Số mẫu</th>
                    <th>Tổng tồn kho</th>
                    <th>Tổng đã bán</th>
                    <th>Giá trung bình</th>
                    <th>Tỷ lệ bán</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Set(filteredProducts.map(p => p.brand))).map(brand => {
                    const brandProducts = filteredProducts.filter(p => p.brand === brand)
                    const totalStock = brandProducts.reduce((sum, p) => sum + p.total_stock, 0)
                    const totalSales = brandProducts.reduce((sum, p) => sum + p.sales_count, 0)
                    const avgPrice = brandProducts.reduce((sum, p) => sum + p.listed_price, 0) / brandProducts.length
                    const salesRate = totalStock > 0 ? (totalSales / totalStock) * 100 : 0
                    
                    return (
                      <tr key={brand}>
                        <td>
                          <strong>{brand}</strong>
                        </td>
                        <td>
                          <Badge bg="primary">{brandProducts.length}</Badge>
                        </td>
                        <td>{totalStock}</td>
                        <td>
                          <Badge bg="success">{totalSales}</Badge>
                        </td>
                        <td>{avgPrice.toLocaleString('vi-VN')} VNĐ</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <ProgressBar 
                              now={salesRate} 
                              variant="success"
                              style={{ width: '60px', height: '8px' }}
                              className="me-2"
                            />
                            <small>{salesRate.toFixed(1)}%</small>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="g-4 mt-4">
        <Col lg={12}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">⚡ Hành động nhanh</h5>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Button variant="outline-primary" className="w-100">
                    🚙 Đặt lịch lái thử
                  </Button>
                </div>
                <div className="col-md-3 mb-3">
                  <Button variant="outline-primary" className="w-100">
                    💰 Tạo báo giá
                  </Button>
                </div>
                <div className="col-md-3 mb-3">
                  <Button variant="outline-primary" className="w-100">
                    📊 So sánh sản phẩm
                  </Button>
                </div>
                <div className="col-md-3 mb-3">
                  <Button variant="outline-primary" className="w-100">
                    📱 Chia sẻ sản phẩm
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Products
