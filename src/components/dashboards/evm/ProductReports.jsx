import { useState } from 'react'
import { Row, Col, Card, Table, Button, Form, Badge, ProgressBar } from 'react-bootstrap'
import { mockVehicles, mockInventory, mockOrders, mockDealers } from '../../../data/mockData'

const ProductReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedDealer, setSelectedDealer] = useState('all')

  // Calculate product performance
  const productPerformance = mockVehicles.map(vehicle => {
    // Mock sales data for demonstration
    const salesCount = Math.floor(Math.random() * 15) + 1
    const revenue = salesCount * vehicle.listed_price
    const inventory = mockInventory.filter(inv => inv.vehicle_id === vehicle.id)
    const totalStock = inventory.reduce((sum, inv) => sum + inv.available_quantity + inv.reserved_quantity, 0)
    const availableStock = inventory.reduce((sum, inv) => sum + inv.available_quantity, 0)
    
    return {
      ...vehicle,
      salesCount,
      revenue,
      totalStock,
      availableStock,
      turnoverRate: totalStock > 0 ? (salesCount / totalStock) * 100 : 0
    }
  }).sort((a, b) => b.revenue - a.revenue)

  // Brand performance
  const brandPerformance = Array.from(new Set(mockVehicles.map(v => v.brand))).map(brand => {
    const brandVehicles = productPerformance.filter(v => v.brand === brand)
    const totalSales = brandVehicles.reduce((sum, v) => sum + v.salesCount, 0)
    const totalRevenue = brandVehicles.reduce((sum, v) => sum + v.revenue, 0)
    const totalStock = brandVehicles.reduce((sum, v) => sum + v.totalStock, 0)
    
    return {
      brand,
      vehicleCount: brandVehicles.length,
      totalSales,
      totalRevenue,
      totalStock,
      averagePrice: totalSales > 0 ? totalRevenue / totalSales : 0
    }
  }).sort((a, b) => b.totalRevenue - a.totalRevenue)

  // Dealer performance by product
  const dealerProductPerformance = mockDealers.map(dealer => {
    const dealerInventory = mockInventory.filter(inv => inv.dealer_id === dealer.id)
    const dealerOrders = mockOrders.filter(order => order.dealer_id === dealer.id)
    const totalStock = dealerInventory.reduce((sum, inv) => sum + inv.available_quantity + inv.reserved_quantity, 0)
    const totalRevenue = dealerOrders.reduce((sum, order) => sum + order.total_amount, 0)
    
    return {
      ...dealer,
      totalStock,
      totalRevenue,
      orderCount: dealerOrders.length
    }
  }).sort((a, b) => b.totalRevenue - a.totalRevenue)

  const totalProducts = mockVehicles.length
  const totalRevenue = productPerformance.reduce((sum, v) => sum + v.revenue, 0)
  const totalSales = productPerformance.reduce((sum, v) => sum + v.salesCount, 0)
  const totalStock = productPerformance.reduce((sum, v) => sum + v.totalStock, 0)
  const averageTurnoverRate = totalStock > 0 ? (totalSales / totalStock) * 100 : 0

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📊 Báo cáo sản phẩm</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" className="ev-button-outline">
            📄 Xuất PDF
          </Button>
          <Button variant="outline-primary" className="ev-button-outline">
            📊 Xuất Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="ev-card mb-4">
        <Card.Header>
          <h5 className="mb-0">🔍 Bộ lọc báo cáo</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Khoảng thời gian</Form.Label>
                <Form.Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                  <option value="quarter">Quý này</option>
                  <option value="year">Năm nay</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Thương hiệu</Form.Label>
                <Form.Select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="all">Tất cả thương hiệu</option>
                  {Array.from(new Set(mockVehicles.map(v => v.brand))).map(brand => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Đại lý</Form.Label>
                <Form.Select
                  value={selectedDealer}
                  onChange={(e) => setSelectedDealer(e.target.value)}
                >
                  <option value="all">Tất cả đại lý</option>
                  {mockDealers.map(dealer => (
                    <option key={dealer.id} value={dealer.id}>
                      {dealer.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="primary" className="ev-button">
              🔄 Cập nhật báo cáo
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Key Metrics */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🚗</div>
              <h3 className="text-primary">{totalProducts}</h3>
              <p className="text-muted mb-0">Tổng sản phẩm</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">💰</div>
              <h3 className="text-success">{(totalRevenue / 1000000000).toFixed(1)}B</h3>
              <p className="text-muted mb-0">Tổng doanh thu (VNĐ)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">📦</div>
              <h3 className="text-info">{totalStock}</h3>
              <p className="text-muted mb-0">Tổng tồn kho</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">📈</div>
              <h3 className="text-warning">{averageTurnoverRate.toFixed(1)}%</h3>
              <p className="text-muted mb-0">Tỷ lệ luân chuyển</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Product Performance */}
        <Col lg={8}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🚗 Hiệu suất sản phẩm</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Thương hiệu</th>
                    <th>Mẫu xe</th>
                    <th>Bán được</th>
                    <th>Doanh thu</th>
                    <th>Tồn kho</th>
                    <th>Tỷ lệ luân chuyển</th>
                    <th>Giá bán</th>
                  </tr>
                </thead>
                <tbody>
                  {productPerformance.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>
                        <strong>{vehicle.brand}</strong>
                      </td>
                      <td>{vehicle.model_name}</td>
                      <td>
                        <Badge bg="primary">{vehicle.salesCount}</Badge>
                      </td>
                      <td>{vehicle.revenue.toLocaleString('vi-VN')} VNĐ</td>
                      <td>
                        <div>
                          <Badge bg="success">{vehicle.availableStock}</Badge>
                          <span className="text-muted">/</span>
                          <Badge bg="info">{vehicle.totalStock}</Badge>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <ProgressBar 
                            now={vehicle.turnoverRate} 
                            variant={vehicle.turnoverRate > 50 ? 'success' : vehicle.turnoverRate > 25 ? 'warning' : 'danger'}
                            style={{ width: '60px', height: '8px' }}
                            className="me-2"
                          />
                          <small>{vehicle.turnoverRate.toFixed(1)}%</small>
                        </div>
                      </td>
                      <td>{vehicle.listed_price.toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Brand Performance */}
        <Col lg={4}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🏷️ Hiệu suất thương hiệu</h5>
            </Card.Header>
            <Card.Body>
              {brandPerformance.map((brand, index) => (
                <div key={brand.brand} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold">{brand.brand}</span>
                    <span className="text-primary">
                      {brand.totalRevenue.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">{brand.totalSales} bán</small>
                    <small className="text-muted">{brand.vehicleCount} mẫu</small>
                  </div>
                  <ProgressBar 
                    now={(brand.totalRevenue / totalRevenue) * 100} 
                    variant="primary"
                    className="mb-2"
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-4">
        {/* Dealer Performance */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🏢 Hiệu suất đại lý</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Đại lý</th>
                    <th>Khu vực</th>
                    <th>Đơn hàng</th>
                    <th>Doanh thu</th>
                    <th>Tồn kho</th>
                  </tr>
                </thead>
                <tbody>
                  {dealerProductPerformance.slice(0, 5).map((dealer) => (
                    <tr key={dealer.id}>
                      <td>
                        <strong>{dealer.name}</strong>
                      </td>
                      <td>{dealer.region}</td>
                      <td>
                        <Badge bg="primary">{dealer.orderCount}</Badge>
                      </td>
                      <td>{dealer.totalRevenue.toLocaleString('vi-VN')} VNĐ</td>
                      <td>
                        <Badge bg="info">{dealer.totalStock}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Inventory Analysis */}
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📦 Phân tích tồn kho</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Tồn kho cao:</span>
                  <strong className="text-warning">
                    {productPerformance.filter(v => v.totalStock > 10).length} sản phẩm
                  </strong>
                </div>
                <ProgressBar 
                  now={(productPerformance.filter(v => v.totalStock > 10).length / totalProducts) * 100} 
                  variant="warning"
                  className="mb-2"
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Tồn kho thấp:</span>
                  <strong className="text-danger">
                    {productPerformance.filter(v => v.availableStock < 3).length} sản phẩm
                  </strong>
                </div>
                <ProgressBar 
                  now={(productPerformance.filter(v => v.availableStock < 3).length / totalProducts) * 100} 
                  variant="danger"
                  className="mb-2"
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Luân chuyển tốt:</span>
                  <strong className="text-success">
                    {productPerformance.filter(v => v.turnoverRate > 50).length} sản phẩm
                  </strong>
                </div>
                <ProgressBar 
                  now={(productPerformance.filter(v => v.turnoverRate > 50).length / totalProducts) * 100} 
                  variant="success"
                  className="mb-2"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Products */}
      <Row className="g-4 mt-4">
        <Col lg={12}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">🏆 Top sản phẩm bán chạy</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Thương hiệu</th>
                    <th>Mẫu xe</th>
                    <th>Số lượng bán</th>
                    <th>Doanh thu</th>
                    <th>Tỷ lệ luân chuyển</th>
                    <th>Giá bán</th>
                  </tr>
                </thead>
                <tbody>
                  {productPerformance.slice(0, 10).map((vehicle, index) => (
                    <tr key={vehicle.id}>
                      <td>
                        <Badge bg={index === 0 ? 'warning' : index === 1 ? 'secondary' : index === 2 ? 'success' : 'light'}>
                          {index + 1}
                        </Badge>
                      </td>
                      <td>
                        <strong>{vehicle.brand}</strong>
                      </td>
                      <td>{vehicle.model_name}</td>
                      <td>
                        <Badge bg="primary">{vehicle.salesCount}</Badge>
                      </td>
                      <td>{vehicle.revenue.toLocaleString('vi-VN')} VNĐ</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <ProgressBar 
                            now={vehicle.turnoverRate} 
                            variant={vehicle.turnoverRate > 50 ? 'success' : vehicle.turnoverRate > 25 ? 'warning' : 'danger'}
                            style={{ width: '60px', height: '8px' }}
                            className="me-2"
                          />
                          <small>{vehicle.turnoverRate.toFixed(1)}%</small>
                        </div>
                      </td>
                      <td>{vehicle.listed_price.toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ProductReports
