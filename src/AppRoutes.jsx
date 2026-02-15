import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'

import { Suspense, lazy } from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'

import Landing from '@pages/home/Landing'

const NotFound = lazy(() => import('@pages/notfound/NotFound'))
const Notification = lazy(() => import('@components/ui/notification/Notification'))
const UserLogged = lazy(() => import('./UserLogged'))
const Auth = lazy(() => import('@pages/auth/Auth'))
const RestrictedRoute = lazy(() => import('@components/reusable/RestrictedRute'))
const NotificationsProvider = lazy(() => import('@context/NotificationsContext'))
const LayoutProvider = lazy(() => import('@context/LayoutContext/index'))
const LayoutManager = lazy(() => import('@components/ui/layoutmanager/LayoutManager'))

const Profile = lazy(() => import('@pages/profile/Profile'))
const Home = lazy(() => import('@pages/home/Home'))
const Templates = lazy(() => import('@pages/templates/Templates'))
const Notifications = lazy(() => import('@pages/notifications/Notifications'))

const Projects = lazy(() => import('@pages/projects/Projects'))
const Project = lazy(() => import('@pages/projects/Project'))
const ProjectDashBoard = lazy(() => import('@pages/projects/dashboard/ProjectDashboard'))
const ProjectSettings = lazy(() => import('@pages/projects/settings/ProjectSettings'))
const ProjectMetricsProvider = lazy(() => import('@context/ProjectMetricsContext'))
const ProjectMetrics = lazy(() => import('@pages/projects/metrics/ProjectMetrics'))
const NewProject = lazy(() => import('@pages/newproject/NewProject'))

const restrictedPaths = ['/login', '/signup']

export default function AppRoutes() {
  const { notification } = useApp()
  const { currentUser } = useAuth()

  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          <Route path='/' element={<Landing />} />

          {/* Public Restricted Routes */}
          <Route
            element={
              <RestrictedRoute
                isAuthenticated={!!currentUser}
                restrictedPaths={restrictedPaths}
              />}>
            <Route path='/login' element={<Auth type='login' />} />
            <Route path='/signup' element={<Auth type='signup' />} />
          </Route>

          {/* Authenticated Routes */}
          <Route element={<UserLogged />}>
            <Route path='/profile' element={<Profile />} />

            {/* Main App Layout Wrapper */}
            <Route element={
              <LayoutProvider>
                <LayoutManager />
              </LayoutProvider>
            }>
              <Route path='/home' element={<Home />} />
              <Route path='/templates' element={<Templates />} />
              <Route path='/notifications' element={<Notifications />} />

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

          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>

      {notification?.open && (
        <Suspense fallback={null}>
          <Notification />
        </Suspense>
      )}
    </Router>
  )
}
