import { Suspense, lazy, useEffect, useMemo, useState } from 'react'

// components
import GoBackButton from '@components/reusable/buttons/GoBackButton'
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import ErrorText from '@components/reusable/texts/ErrorText'
import AppDrawer from '@components/ui/drawer/AppDrawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ProjectAppBar from './ProjectAppBar'

const ProfileButton = lazy(
  () => import('@components/reusable/buttons/ProfileButton')
)
const ProjectActions = lazy(
  () => import('@components/ui/drawer/components/ProjectActions')
)
const AppBar = lazy(() => import('@components/ui/appbar/AppBar'))

import { useAuth } from '@/firebase/AuthContext'
// hooks
import useProjectAccess from '@context/ProjectsContext/useProjectAccess'
import useProjectMembers from '@context/ProjectsContext/useProjectMembers'
import useApp from '@hooks/useApp'
import useDebounce from '@hooks/useDebounce'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom'

import updateProject from '@services/updateProject'
import ProjectContext from './context'

export default function Project() {
  const { isOffline } = useAuth()
  const { uid, update: updateUser, metadata } = useUser()
  const { isMobile } = useApp()
  const { t } = useTranslation(['ui'])
  const { projectId } = useParams()

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const rute = location.pathname?.split(projectId)?.[1]
  const action = rute === '' ? 'dashboard' : rute

  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    totalCompletedTasks: 0
  })

  const { validating, hasAccess, projectData } = useProjectAccess({
    projectId,
    owner:
      location.state?.o ||
      searchParams.get('o') ||
      metadata?.lastEditedProjectOwner
  })

  const projectOwner = projectData?.createdBy

  const { projectMembers, projectMembersError } = useProjectMembers({
    projectsFetched: !!projectData,
    members: projectData?.members || [],
    hasAccess
  })

  useEffect(() => {
    if (hasAccess)
      updateUser?.({
        lastEditedProject: projectId,
        // field used on the main page where the "go to last project" link
        // exists
        lastEditedProjectOwner: projectOwner
      })
  }, [hasAccess, updateUser, projectId, projectOwner])

  useEffect(() => {
    ;(() => {
      const lastEditedProjectOwner = metadata?.lastEditedProjectOwner

      if (
        projectOwner &&
        (location.state?.o === lastEditedProjectOwner ||
          projectOwner === lastEditedProjectOwner)
      ) {
        if (searchParams.get('o') === (projectOwner || lastEditedProjectOwner))
          return

        setSearchParams(searchParams => {
          searchParams.set('o', projectOwner)
          return searchParams
        })
      }
    })()
  }, [location, setSearchParams, metadata, projectOwner, searchParams])

  const contextValue = useMemo(
    () => ({
      id: projectId,
      data: projectData,
      isArchived: projectData?.isArchived,
      isOwner: projectData?.createdBy === uid,
      hasAccess,
      validating,
      projectMembers,
      update: data => updateProject(projectData?.createdBy, projectId, data),
      metrics,
      updateMetrics: data => {
        setMetrics(data)
      }
    }),
    [
      projectId,
      projectData,
      hasAccess,
      validating,
      projectMembers,
      uid,
      metrics
    ]
  )

  if (validating)
    return <CircleLoader height='100dvh' text={t('projects.validating')} />

  if (!hasAccess)
    return (
      <Box
        className='text-center flex flex-column flex-center'
        sx={{ m: 'auto', gap: 2, mx: 2 }}
        width='100%'>
        <ErrorText className='text-center text-balance'>
          {isOffline
            ? t('projects.errors.noConnection')
            : t('projects.errors.noAccess')}
        </ErrorText>
        <GoBackButton
          handler={() => navigate('/projects')}
          text={t('projects.goToProjects')}
        />
      </Box>
    )

  if (projectMembersError)
    return <ErrorText>{t('projects.errors.members')}</ErrorText>

  return (
    <ProjectContext.Provider value={contextValue}>
      <ProjectAppBar />
      <Outlet />
    </ProjectContext.Provider>
  )
}
