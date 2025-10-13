import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const isAuthenticated = true
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }
  return <Outlet />
}


