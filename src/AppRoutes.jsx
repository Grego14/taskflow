import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAuth } from './firebase/AuthContext.jsx'

const Auth = lazy(() => import('@pages/auth/Auth'))
const Home = lazy(() => import('@pages/home/Home'))
const NotFound = lazy(() => import('@pages/notfound/NotFound'))

const RestrictedRoute = lazy(
  () => import('@components/reusable/RestrictedRute')
)
const ProtectedRoute = lazy(() => import('@components/reusable/ProtectedRute'))
const Profile = lazy(() => import('@pages/profile/Profile'))

export default function AppRoutes() {
  const { currentUser } = useAuth()
  const restrictedPaths = ['/login', '/signup']

  return (
    <Routes>
      <Route path='/' element={<Home />} />

      {/* User must not be logged to be able to access this rutes */}
      <Route
        element={
          <RestrictedRoute
            isAuthenticated={Boolean(currentUser)}
            restrictedPaths={restrictedPaths}
          />
        }>
        <Route path='/login' element={<Auth type='login' />} />
        <Route path='/signup' element={<Auth type='signup' />} />
      </Route>
      {/* <-----------------------------------------------------> */}

      {/* User must be logged to be able to access this rutes */}
      <Route
        element={<ProtectedRoute isAuthenticated={Boolean(currentUser)} />}>
        <Route path='/project/:projectId' element={null} />
        <Route path='/profile' element={<Profile />} />
      </Route>
      {/* <-------------------------------------------------> */}

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}
