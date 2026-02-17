import { Suspense, lazy, useEffect, useMemo, useState } from 'react'

// components
import GoBackButton from '@components/reusable/buttons/GoBackButton'
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import ErrorText from '@components/reusable/texts/ErrorText'
import AppDrawer from '@components/ui/drawer/AppDrawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ProjectAppBar from './ProjectAppBar'

// hooks
import useProjectAccess from '@context/ProjectsContext/useProjectAccess'
import useProjectMembers from '@context/ProjectsContext/useProjectMembers'
import useAuth from '@hooks/useAuth'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import {
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom'
import useLoadResources from '@hooks/useLoadResources'

import updateProject from '@services/updateProject'
import ProjectContext from './context'

export default function Project() {
  const { isOffline } = useAuth()
  const { uid, update: updateUser, metadata } = useUser()
  const { t } = useTranslation(['common', 'projects'])
  const { projectId, projectOwner } = useParams()

  const loadingResources = useLoadResources('projects')

  const navigate = useNavigate()

  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    totalCompletedTasks: 0
  })

  const { validating, hasAccess, projectData } = useProjectAccess({
    projectId,
    owner: projectOwner
  })

  const { projectMembers, projectMembersError } = useProjectMembers({
    projectsFetched: !!projectData,
    members: projectData?.members || [],
    hasAccess
  })

  useEffect(() => {
    if (hasAccess)
      updateUser({
        lastEditedProject: projectId,
        // field used on the main page where the "go to last project" link
        // exists
        lastEditedProjectOwner: projectOwner
      })
  }, [hasAccess, updateUser, projectId, projectOwner])

  const contextValue = useMemo(
    () => ({
      id: projectId,
      data: projectData,
      isArchived: projectData?.isArchived,
      isOwner: projectOwner === uid,
      hasAccess,
      validating,
      projectMembers,
      update: data => updateProject(projectOwner, projectId, data),
      metrics,
      updateMetrics: data => {
        setMetrics(data)
      }
    }),
    [
      projectId,
      projectOwner,
      projectData,
      hasAccess,
      validating,
      projectMembers,
      uid,
      metrics
    ]
  )

  if (loadingResources)
    return <CircleLoader text={t('loading', { ns: 'common' })} />

  if (validating)
    return <CircleLoader text={t('projects.validating', { ns: 'projects' })} />

  if (!hasAccess)
    return (
      <Box
        className='text-center flex flex-column flex-center'
        sx={{ m: 'auto', gap: 2, mx: 2 }}
        width='100%'>
        <ErrorText className='text-center text-balance'>
          {isOffline
            ? t('projects.errors.noConnection', { ns: 'projects' })
            : t('projects.errors.noAccess', { ns: 'projects' })}
        </ErrorText>
        <GoBackButton
          handler={() => navigate('/projects')}
          text={t('projects.goToProjects', { ns: 'projects' })}
        />
      </Box>
    )

  if (projectMembersError)
    return <ErrorText>{t('projects.errors.members', { ns: 'projects' })}</ErrorText>

  return (
    <ProjectContext.Provider value={contextValue}>
      <ProjectAppBar />
      <Outlet />
    </ProjectContext.Provider>
  )
}
