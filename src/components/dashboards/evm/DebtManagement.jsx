import { useState } from 'react'
import { Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, ProgressBar } from 'react-bootstrap'
import { mockDebts, mockDealers, mockOrders, mockCustomers, mockVehicles } from '../../../data/mockData'

const DebtManagement = () => {
  const [debts, setDebts] = useState(mockDebts)
  const [showModal, setShowModal] = useState(false)
  const [editingDebt, setEditingDebt] = useState(null)
  const [filterDealer, setFilterDealer] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [formData, setFormData] = useState({
    dealer_id: '',
    customer_id: '',
    order_id: '',
    total_amount: '',
    paid_amount: '',
    remaining_amount: '',
    due_date: '',
    payment_schedule: 'monthly',
    installments_remaining: '',
    status: 'current',
    notes: ''
  })

  const handleShowModal = (debt = null) => {
    setEditingDebt(debt)
    if (debt) {
      setFormData({
        dealer_id: debt.dealer_id,
        customer_id: debt.customer_id,
        order_id: debt.order_id,
        total_amount: debt.total_amount,
        paid_amount: debt.paid_amount,
        remaining_amount: debt.remaining_amount,
        due_date: debt.due_date,
        payment_schedule: debt.payment_schedule,
        installments_remaining: debt.installments_remaining,
        status: debt.status,
        notes: debt.notes || ''
      })
    } else {
      setFormData({
        dealer_id: '',
        customer_id: '',
        order_id: '',
        total_amount: '',
        paid_amount: '',
        remaining_amount: '',
        due_date: '',
        payment_schedule: 'monthly',
        installments_remaining: '',
        status: 'current',
        notes: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingDebt(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Auto calculate remaining amount
    if (name === 'total_amount' || name === 'paid_amount') {
      const total = name === 'total_amount' ? parseFloat(value) : parseFloat(formData.total_amount)
      const paid = name === 'paid_amount' ? parseFloat(value) : parseFloat(formData.paid_amount)
      if (total && paid !== undefined) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          remaining_amount: (total - paid).toString()
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const debtData = {
      ...formData,
      dealer_id: parseInt(formData.dealer_id),
      customer_id: parseInt(formData.customer_id),
      order_id: parseInt(formData.order_id),
      total_amount: parseFloat(formData.total_amount),
      paid_amount: parseFloat(formData.paid_amount),
      remaining_amount: parseFloat(formData.remaining_amount),
      installments_remaining: parseInt(formData.installments_remaining)
    }

    if (editingDebt) {
      setDebts(debts.map(d => 
        d.id === editingDebt.id ? { ...d, ...debtData } : d
      ))
    } else {
      const newDebt = {
        id: Math.max(...debts.map(d => d.id)) + 1,
        ...debtData
      }
      setDebts([...debts, newDebt])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi công nợ này?')) {
      setDebts(debts.filter(d => d.id !== id))
    }
  }

  const handlePayment = (id, amount) => {
    setDebts(debts.map(debt => {
      if (debt.id === id) {
        const newPaidAmount = debt.paid_amount + amount
        const newRemainingAmount = debt.total_amount - newPaidAmount
        return {
          ...debt,
          paid_amount: newPaidAmount,
          remaining_amount: newRemainingAmount,
          status: newRemainingAmount <= 0 ? 'paid' : 
                  new Date(debt.due_date) < new Date() ? 'overdue' : 'current'
        }
      }
      return debt
    }))
  }

  const getDealerName = (dealerId) => {
    const dealer = mockDealers.find(d => d.id === dealerId)
    return dealer ? dealer.name : 'Không xác định'
  }

  const getCustomerName = (customerId) => {
    const customer = mockCustomers.find(c => c.id === customerId)
    return customer ? customer.full_name : 'Không xác định'
  }

  const getOrderInfo = (orderId) => {
    const order = mockOrders.find(o => o.id === orderId)
    if (!order) return 'Không xác định'
    const vehicle = mockVehicles.find(v => v.id === order.vehicle_id)
    return vehicle ? `${vehicle.brand} ${vehicle.model_name}` : 'Không xác định'
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'current': { bg: 'success', text: 'Hiện tại' },
      'overdue': { bg: 'danger', text: 'Quá hạn' },
      'paid': { bg: 'info', text: 'Đã trả' },
      'cancelled': { bg: 'secondary', text: 'Đã hủy' }
    }
    const statusInfo = statusMap[status] || { bg: 'secondary', text: status }
    return <Badge bg={statusInfo.bg}>{statusInfo.text}</Badge>
  }

  const getPaymentScheduleText = (schedule) => {
    const scheduleMap = {
      'monthly': 'Hàng tháng',
      'quarterly': 'Hàng quý',
      'yearly': 'Hàng năm',
      'lump_sum': 'Trả một lần'
    }
    return scheduleMap[schedule] || schedule
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date()
  }

  // Filter debts
  const filteredDebts = debts.filter(debt => {
    const dealerMatch = filterDealer === 'all' || debt.dealer_id.toString() === filterDealer
    const statusMatch = filterStatus === 'all' || debt.status === filterStatus
    return dealerMatch && statusMatch
  })

  const totalDebts = debts.length
  const overdueDebts = debts.filter(d => isOverdue(d.due_date)).length
  const currentDebts = debts.filter(d => d.status === 'current').length
  const totalDebtAmount = debts.reduce((sum, debt) => sum + debt.remaining_amount, 0)
  const totalPaidAmount = debts.reduce((sum, debt) => sum + debt.paid_amount, 0)
  const collectionRate = totalPaidAmount + totalDebtAmount > 0 ? 
    (totalPaidAmount / (totalPaidAmount + totalDebtAmount)) * 100 : 0

  // Group by dealer
  const debtsByDealer = debts.reduce((acc, debt) => {
    const dealerName = getDealerName(debt.dealer_id)
    if (!acc[dealerName]) {
      acc[dealerName] = {
        total: 0,
        paid: 0,
        remaining: 0,
        count: 0
      }
    }
    acc[dealerName].total += debt.total_amount
    acc[dealerName].paid += debt.paid_amount
    acc[dealerName].remaining += debt.remaining_amount
    acc[dealerName].count += 1
    return acc
  }, {})

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">💰 Quản lý công nợ đại lý</h2>
        <Button 
          variant="primary" 
          className="ev-button"
          onClick={() => handleShowModal()}
        >
          ➕ Thêm công nợ
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">💰</div>
              <h3 className="text-primary">{totalDebts}</h3>
              <p className="text-muted mb-0">Tổng công nợ</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-danger mb-2">🚨</div>
              <h3 className="text-danger">{overdueDebts}</h3>
              <p className="text-muted mb-0">Quá hạn</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">⏰</div>
              <h3 className="text-warning">{(totalDebtAmount / 1000000000).toFixed(1)}B</h3>
              <p className="text-muted mb-0">Tổng nợ (VNĐ)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="ev-card">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">📈</div>
              <h3 className="text-success">{collectionRate.toFixed(1)}%</h3>
              <p className="text-muted mb-0">Tỷ lệ thu hồi</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Overdue Alert */}
      {overdueDebts > 0 && (
        <Alert variant="danger" className="mb-4">
          <h5>🚨 Cảnh báo công nợ quá hạn!</h5>
          <p className="mb-0">
            Có {overdueDebts} đại lý có công nợ quá hạn cần xử lý ngay.
          </p>
        </Alert>
      )}

      {/* Filters */}
      <Card className="ev-card mb-4">
        <Card.Header>
          <h5 className="mb-0">🔍 Bộ lọc</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Theo đại lý</Form.Label>
                <Form.Select
                  value={filterDealer}
                  onChange={(e) => setFilterDealer(e.target.value)}
                >
                  <option value="all">Tất cả đại lý</option>
                  {mockDealers.map((dealer) => (
                    <option key={dealer.id} value={dealer.id}>
                      {dealer.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="current">Hiện tại</option>
                  <option value="overdue">Quá hạn</option>
                  <option value="paid">Đã trả</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <div className="d-flex align-items-end h-100">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    setFilterDealer('all')
                    setFilterStatus('all')
                  }}
                >
                  🔄 Reset
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Debts Table */}
      <Card className="ev-card">
        <Card.Header>
          <h5 className="mb-0">📋 Danh sách công nợ đại lý</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Đại lý</th>
                <th>Khách hàng</th>
                <th>Đơn hàng</th>
                <th>Tổng tiền</th>
                <th>Đã trả</th>
                <th>Còn nợ</th>
                <th>Hạn thanh toán</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredDebts.map((debt) => (
                <tr key={debt.id}>
                  <td>
                    <strong>{getDealerName(debt.dealer_id)}</strong>
                  </td>
                  <td>{getCustomerName(debt.customer_id)}</td>
                  <td>
                    <div>
                      <strong>#{debt.order_id}</strong>
                      <br />
                      <small className="text-muted">{getOrderInfo(debt.order_id)}</small>
                    </div>
                  </td>
                  <td>
                    <span className="fw-bold text-primary">
                      {(debt.total_amount / 1000000).toFixed(0)}M VNĐ
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold text-success">
                      {(debt.paid_amount / 1000000).toFixed(0)}M VNĐ
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold text-warning">
                      {(debt.remaining_amount / 1000000).toFixed(0)}M VNĐ
                    </span>
                  </td>
                  <td>
                    <div>
                      <span className={isOverdue(debt.due_date) ? 'text-danger' : 'text-muted'}>
                        {debt.due_date}
                      </span>
                      <br />
                      <small className="text-muted">
                        {getPaymentScheduleText(debt.payment_schedule)}
                      </small>
                    </div>
                  </td>
                  <td>{getStatusBadge(debt.status)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => handleShowModal(debt)}
                      >
                        ✏️
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-success"
                        onClick={() => {
                          const amount = parseFloat(prompt('Nhập số tiền thanh toán:'))
                          if (amount > 0) {
                            handlePayment(debt.id, amount)
                          }
                        }}
                        disabled={debt.remaining_amount <= 0}
                      >
                        💰
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => handleDelete(debt.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Debt Summary by Dealer */}
      <Card className="ev-card mt-4">
        <Card.Header>
          <h5 className="mb-0">📊 Tổng hợp công nợ theo đại lý</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Đại lý</th>
                <th>Số công nợ</th>
                <th>Tổng tiền</th>
                <th>Đã trả</th>
                <th>Còn nợ</th>
                <th>Tỷ lệ thu hồi</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(debtsByDealer).map(([dealerName, data]) => (
                <tr key={dealerName}>
                  <td><strong>{dealerName}</strong></td>
                  <td>
                    <span className="fw-bold text-primary">{data.count}</span>
                  </td>
                  <td>
                    <span className="fw-bold text-primary">
                      {(data.total / 1000000000).toFixed(1)}B VNĐ
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold text-success">
                      {(data.paid / 1000000000).toFixed(1)}B VNĐ
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold text-warning">
                      {(data.remaining / 1000000000).toFixed(1)}B VNĐ
                    </span>
                  </td>
                  <td>
                    <div>
                      <span className="fw-bold text-info">
                        {((data.paid / data.total) * 100).toFixed(1)}%
                      </span>
                      <ProgressBar 
                        variant="info" 
                        now={(data.paid / data.total) * 100}
                        className="mt-1"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Collection Progress */}
      <Row className="g-4 mt-4">
        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">📊 Tiến độ thu hồi tổng thể</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Tỷ lệ thu hồi:</span>
                  <span className="fw-bold text-success">{collectionRate.toFixed(1)}%</span>
                </div>
                <ProgressBar 
                  variant="success" 
                  now={collectionRate}
                  className="mt-1"
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Đã thu:</span>
                  <span className="fw-bold text-success">
                    {(totalPaidAmount / 1000000000).toFixed(1)}B VNĐ
                  </span>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <span>Còn nợ:</span>
                  <span className="fw-bold text-warning">
                    {(totalDebtAmount / 1000000000).toFixed(1)}B VNĐ
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="ev-card">
            <Card.Header>
              <h5 className="mb-0">⚡ Hành động nhanh</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="lg">
                  📊 Báo cáo công nợ tổng hợp
                </Button>
                <Button variant="outline-warning" size="lg">
                  🚨 Danh sách nợ quá hạn
                </Button>
                <Button variant="outline-info" size="lg">
                  📈 Xuất báo cáo Excel
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDebt ? '✏️ Chỉnh sửa công nợ' : '➕ Thêm công nợ mới'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Đại lý</Form.Label>
                  <Form.Select
                    name="dealer_id"
                    value={formData.dealer_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn đại lý...</option>
                    {mockDealers.map((dealer) => (
                      <option key={dealer.id} value={dealer.id}>
                        {dealer.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Khách hàng</Form.Label>
                  <Form.Select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn khách hàng...</option>
                    {mockCustomers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.full_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Đơn hàng</Form.Label>
                  <Form.Select
                    name="order_id"
                    value={formData.order_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn đơn hàng...</option>
                    {mockOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        #{order.id} - {(order.total_amount / 1000000).toFixed(0)}M VNĐ
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hạn thanh toán</Form.Label>
                  <Form.Control
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tổng tiền (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_amount"
                    value={formData.total_amount}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Đã trả (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    name="paid_amount"
                    value={formData.paid_amount}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Còn nợ (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    name="remaining_amount"
                    value={formData.remaining_amount}
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kỳ thanh toán</Form.Label>
                  <Form.Select
                    name="payment_schedule"
                    value={formData.payment_schedule}
                    onChange={handleInputChange}
                  >
                    <option value="monthly">Hàng tháng</option>
                    <option value="quarterly">Hàng quý</option>
                    <option value="yearly">Hàng năm</option>
                    <option value="lump_sum">Trả một lần</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số kỳ còn lại</Form.Label>
                  <Form.Control
                    type="number"
                    name="installments_remaining"
                    value={formData.installments_remaining}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
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
                <option value="current">Hiện tại</option>
                <option value="overdue">Quá hạn</option>
                <option value="paid">Đã trả</option>
                <option value="cancelled">Đã hủy</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Ghi chú về công nợ..."
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                {editingDebt ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DebtManagement
