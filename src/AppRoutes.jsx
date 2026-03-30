import useApp from '@hooks/useApp'

import { Suspense, lazy } from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'

import Landing from '@pages/landing/Landing'
import RouteProvider from './context/RouteContext'

const AuthenticatedApp = lazy(() => import('./AuthenticatedApp'))
const Preview = lazy(() => import('@pages/preview/Preview'))

export default function AppRoutes() {
  const { notification, lastRute } = useApp()

  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<RouteProvider />}>
            <Route path='/' element={<Landing />} />
            <Route
              path='/preview'
              element={
                <Suspense fallback={null}>
                  <Preview />
                </Suspense>
              }
            />

            <Route path='/*' element={
              <Suspense fallback={null}>
                <AuthenticatedApp />
              </Suspense>
            } />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}
