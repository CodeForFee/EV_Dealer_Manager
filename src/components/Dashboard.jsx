import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AdminDashboard from './dashboards/AdminDashboard'
import EVMStaffDashboard from './dashboards/EVMStaffDashboard'
import DealerManagerDashboard from './dashboards/DealerManagerDashboard'
import DealerStaffDashboard from './dashboards/DealerStaffDashboard'
import DashboardLayout from './DashboardLayout'

const Dashboard = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const getDashboardComponent = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />
      case 'evm_staff':
        return <EVMStaffDashboard />
      case 'dealer_manager':
        return <DealerManagerDashboard />
      case 'dealer_staff':
        return <DealerStaffDashboard />
      default:
        return <Navigate to="/login" replace />
    }
  }

  return (
    <DashboardLayout>
      {getDashboardComponent()}
    </DashboardLayout>
  )
}

export default Dashboard

