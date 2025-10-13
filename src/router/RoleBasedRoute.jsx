import { Navigate, Outlet } from 'react-router-dom'

export default function RoleBasedRoute({ allowedRoles = [] }) {
  const userRole = 'dealer'
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />
  }
  return <Outlet />
}


