import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout.jsx'
import DealerLayout from '../layouts/DealerLayout.jsx'
import EVMLayout from '../layouts/EVMLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import Login from '../pages/auth/Login.jsx'
import NotFound from '../pages/errors/NotFound.jsx'
import Unauthorized from '../pages/errors/Unauthorized.jsx'
import DealerDashboard from '../pages/dashboard/DealerDashboard.jsx'
import EvmDashboard from '../pages/dashboard/EvmDashboard.jsx'
import AdminDashboard from '../pages/dashboard/AdminDashboard.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import RoleBasedRoute from './RoleBasedRoute.jsx'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        <Route element={<AuthLayout />}> 
          <Route path="/auth/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}> 
          <Route element={<RoleBasedRoute allowedRoles={["dealer"]} />}> 
            <Route element={<DealerLayout />}> 
              <Route path="/dealer" element={<DealerDashboard />} />
            </Route>
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["evm"]} />}> 
            <Route element={<EVMLayout />}> 
              <Route path="/evm" element={<EvmDashboard />} />
            </Route>
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}> 
            <Route element={<AdminLayout />}> 
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}


