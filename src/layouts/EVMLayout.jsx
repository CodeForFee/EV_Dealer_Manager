import { Outlet, Link } from 'react-router-dom'

export default function EVMLayout() {
  return (
    <div>
      <nav>
        <Link to="/evm">EVM Dashboard</Link>
      </nav>
      <Outlet />
    </div>
  )
}


