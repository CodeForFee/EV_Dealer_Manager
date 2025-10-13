import { Outlet, Link } from 'react-router-dom'

export default function DealerLayout() {
  return (
    <div>
      <nav>
        <Link to="/dealer">Dealer Dashboard</Link>
      </nav>
      <Outlet />
    </div>
  )
}


