import useApp from '@hooks/useApp'

import { Suspense, lazy } from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'

import Landing from '@pages/landing/Landing'
const AuthenticatedApp = lazy(() => import('./AuthenticatedApp'))

export default function AppRoutes() {
  const { notification } = useApp()

  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          <Route path='/' element={<Landing />} />

          <Route path='/*' element={
            <Suspense fallback={null}>
              <AuthenticatedApp />
            </Suspense>
          } />
        </Routes>
      </Suspense>
    </Router>
  )
}
