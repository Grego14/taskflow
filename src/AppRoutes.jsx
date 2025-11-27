import useLoadResources from '@hooks/useLoadResources'
import { lazy } from 'react'

import { Route, Routes } from 'react-router-dom'
import RoutesHandler from './RoutesHandler'
import { BrowserRouter as Router } from 'react-router-dom'

import { useAuth } from './firebase/AuthContext.jsx'

const QueryProvider = lazy(() => import('./QueryProvider'))
const Auth = lazy(() => import('@pages/auth/Auth'))
const NotFound = lazy(() => import('@pages/notfound/NotFound'))
const RestrictedRoute = lazy(
  () => import('@components/reusable/RestrictedRute')
)
const ProtectedRoute = lazy(() => import('@components/reusable/ProtectedRute'))
const UserProvider = lazy(() => import('@context/UserContext'))
const NotificationsProvider = lazy(
  () => import('@context/NotificationsContext')
)
const LayoutManager = lazy(
  () => import('@components/ui/layoutmanager/LayoutManager')
)
const Profile = lazy(() => import('@pages/profile/Profile'))

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
// --------

const Landing = lazy(() => import('@pages/home/Landing.jsx'))
const Home = lazy(() => import('@pages/home/Home.jsx'))
const Templates = lazy(() => import('@pages/templates/Templates'))

const UserLogged = lazy(() => import('./UserLogged'))

export default function AppRoutes() {
  const { currentUser } = useAuth()
  const restrictedPaths = ['/login', '/signup']

  const loadingResources = useLoadResources(['common', 'ui'])

  if (loadingResources) return null

  return (
    <Router>
      <Routes>
        <Route element={<UserProvider />}>
          {/* User must not be logged to be able to access this rutes */}
          {/* We wrap this components inside the UserProvider because if the
           user is creating an account the component gets the preferences from
           that context */}
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

          {!currentUser ? (
            <Route path='/' element={<Landing />} />
          ) : (
            <Route element={<QueryProvider />}>
              <Route element={<UserLogged />}>
                <Route path='/profile' element={<Profile />} />

                <Route element={<NotificationsProvider />}>
                  <Route element={<LayoutManager />}>
                    <Route path='/' element={<Home />} />

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
          )}
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  )
}
