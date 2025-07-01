import { Outlet } from 'react-router-dom'

export default function ProtectedRoute({ isAuthenticated }) {
  if (!isAuthenticated) {
    return (
      <div className='protected-rute'>
        <div className='protected-rute__text text-center'>
          <h2 className='protected-rute__text__title'>Access required</h2>
          <p className='protected-rute__text__desc'>
            You must log in to access this page.
          </p>
        </div>
      </div>
    )
  }

  return <Outlet />
}
