import { Outlet, Link } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div>
      <nav>
        <Link to="/admin">Admin Dashboard</Link>
      </nav>
      <Outlet />
    </div>
  )
}


