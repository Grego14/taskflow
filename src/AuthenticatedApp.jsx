import { lazy } from 'preact/compat'
import { Routes, Route, Outlet } from 'react-router-dom'

import UserLogged from './UserLogged'
import LayoutProvider from '@context/LayoutContext'
import NotificationsProvider from '@context/NotificationsContext'
import LayoutManager from '@components/ui/layoutmanager/LayoutManager'

const Verify = lazy(() => import('@pages/auth/VerifyEmail'))
const NotFound = lazy(() => import('@pages/notfound/NotFound'))
const Auth = lazy(() => import('@pages/auth/Auth'))
const Home = lazy(() => import('@pages/home/Home'))
const Projects = lazy(() => import('@pages/projects/Projects'))
const Templates = lazy(() => import('@pages/templates/Templates'))
const Notifications = lazy(() => import('@pages/notifications/Notifications'))
const Profile = lazy(() => import('@pages/profile/Profile'))

const Project = lazy(() => import('@pages/projects/Project'))
const NewProject = lazy(() => import('@pages/newproject/NewProject'))
const ProjectDashBoard = lazy(() => import('@pages/projects/dashboard/ProjectDashboard'))
const ProjectSettings = lazy(() => import('@pages/projects/settings/ProjectSettings'))
const ProjectMetricsProvider = lazy(() => import('@context/ProjectMetricsContext'))
const ProjectMetrics = lazy(() => import('@pages/projects/metrics/ProjectMetrics'))

const AppLayout = () => (
  <LayoutProvider>
    <NotificationsProvider>
      <LayoutManager />
    </NotificationsProvider>
  </LayoutProvider>
)

export default function AuthenticatedApp() {
  return (
    <Routes>
      <Route element={<UserLogged />}>
        <Route path='/login' element={<Auth type='login' />} />
        <Route path='/signup' element={<Auth type='signup' />} />

        <Route path='/verify' element={<Verify />} />

        <Route element={<UserLogged />}>
          <Route path='/profile' element={<Profile />} />

          <Route element={<AppLayout />}>
            <Route path='/home' element={<Home />} />
            <Route path='/templates' element={<Templates />} />
            <Route path='/notifications' element={<Notifications />} />

            <Route path='/projects'>
              <Route index element={<Projects />} />
              <Route path='new' element={<NewProject />} />

              <Route path=':projectOwner/:projectId' element={<Project />}>
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
      </Route>
    </Routes>
  )
}
