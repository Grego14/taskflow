import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'

import { Suspense, lazy } from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'

import Landing from '@pages/home/Landing'
import NotFound from '@pages/notfound/NotFound'

const Notification = lazy(
  () => import('@components/ui/notification/Notification')
)
const UserLogged = lazy(() => import('./UserLogged'))
const QueryProvider = lazy(() => import('./QueryProvider'))
const Auth = lazy(() => import('@pages/auth/Auth'))
const RestrictedRoute = lazy(
  () => import('@components/reusable/RestrictedRute')
)
const ProtectedRoute = lazy(() => import('@components/reusable/ProtectedRute'))
const NotificationsProvider = lazy(
  () => import('@context/NotificationsContext')
)
const LayoutProvider = lazy(() => import('@context/LayoutContext/index'))
const LayoutManager = lazy(() => import('@components/ui/layoutmanager/LayoutManager'))
const Profile = lazy(() => import('@pages/profile/Profile'))
const Home = lazy(() => import('@pages/home/Home'))
const Templates = lazy(() => import('@pages/templates/Templates'))

// projects
const Projects = lazy(() => import('@pages/projects/Projects'))
const Project = lazy(() => import('@pages/projects/Project'))
const ProjectDashBoard = lazy(
  () => import('@pages/projects/dashboard/ProjectDashboard')
)
const ProjectSettings = lazy(
  () => import('@pages/projects/settings/ProjectSettings')
)
const ProjectMetricsProvider = lazy(
  () => import('@context/ProjectMetricsContext')
)
const ProjectMetrics = lazy(
  () => import('@pages/projects/metrics/ProjectMetrics')
)
const NewProject = lazy(() => import('@pages/newproject/NewProject'))

export default function AppRoutes() {
  const { notification } = useApp()
  const { currentUser } = useAuth()
  const restrictedPaths = ['/login', '/signup']

  return (
    <>
      <Router>
        <Suspense fallback={null}>

          <Routes>
            <Route path='/' element={<Landing />} />

            {/* User must not be logged to be able to access this rutes */}
            <Route
              element={
                <RestrictedRoute
                  isAuthenticated={!!currentUser}
                  restrictedPaths={restrictedPaths}
                />
              }>
              <Route path='/login' element={<Auth type='login' />} />
              <Route path='/signup' element={<Auth type='signup' />} />
            </Route>
            {/* <-----------------------------------------------------> */}

            <Route element={<QueryProvider />}>
              <Route element={<UserLogged />}>
                <Route path='/profile' element={<Profile />} />

                <Route element={<NotificationsProvider />}>
                  <Route element={<LayoutProvider />}>
                    <Route element={<LayoutManager />}>
                      <Route path='/home' element={<Home />} />

                      <Route path='/templates' element={<Templates />} />

                      <Route path='/projects'>
                        <Route index element={<Projects />} />
                        <Route path='new' element={<NewProject />} />

                        <Route path=':projectId' element={<Project />}>
                          <Route index element={<ProjectDashBoard />} />
                          <Route path='settings' element={<ProjectSettings />} />

                          <Route element={<ProjectMetricsProvider />}>
                            <Route path='metrics' element={<ProjectMetrics />} />
                          </Route>
                        </Route>
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>

            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>

      <Suspense fallback={null}>{notification?.open && <Notification />}</Suspense>
    </>
  )
}
