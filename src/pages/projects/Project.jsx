import GoBackButton from '@components/reusable/buttons/GoBackButton'
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import ErrorText from '@components/reusable/texts/ErrorText'
import Box from '@mui/material/Box'
import ProjectAppBar from './ProjectAppBar'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useProjectAccess from '@context/ProjectsContext/useProjectAccess'
import useProjectMembers from '@context/ProjectsContext/useProjectMembers'
import useAuth from '@hooks/useAuth'
import useUser from '@hooks/useUser'
import useLoadResources from '@hooks/useLoadResources'

import { Outlet, useNavigate, useParams } from 'react-router-dom'
import ProjectContext from './context'

export default function Project() {
  const { isOffline } = useAuth()
  const { uid, update: updateUser } = useUser()
  const { t } = useTranslation(['common', 'projects'])
  const { projectId, projectOwner } = useParams()
  const navigate = useNavigate()

  const loadingResources = useLoadResources('projects')

  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    totalCompletedTasks: 0
  })

  const { validating, hasAccess, projectData } = useProjectAccess({
    projectId,
    owner: projectOwner
  })

  const { projectMembers, projectMembersError } = useProjectMembers({
    members: projectData?.members || [],
    enabled: !!projectData && hasAccess
  })

  // update last edited project on user metadata
  useEffect(() => {
    if (hasAccess) {
      updateUser({
        lastEditedProject: projectId,
        lastEditedProjectOwner: projectOwner
      })
    }
  }, [hasAccess, projectId, projectOwner])

  const contextValue = useMemo(() => ({
    id: projectId,
    data: projectData,
    isArchived: projectData?.isArchived,
    isOwner: projectOwner === uid,
    hasAccess,
    validating,
    projectMembers,
    metrics,
    updateMetrics: setMetrics,
    update: async (data) => {
      const { default: service } = await import('@services/project')
      return await service.updateProject(projectOwner, projectId, data)
    }
  }), [projectId, projectOwner, projectData, hasAccess, validating, projectMembers, uid, metrics])

  if (loadingResources) return <CircleLoader text={t('loading', { ns: 'common' })} />
  if (validating) return <CircleLoader text={t('validating', { ns: 'projects' })} />

  if (!hasAccess)
    return (
      <Box
        className='text-center flex flex-column flex-center'
        sx={{ m: 'auto', gap: 2, mx: 2 }}
        width='100%'>
        <ErrorText className='text-center text-balance'>
          {isOffline
            ? t('errors.noConnection', { ns: 'projects' })
            : t('errors.noAccess', { ns: 'projects' })}
        </ErrorText>
        <GoBackButton
          handler={() => navigate('/projects')}
          text={t('goToProjects', { ns: 'projects' })}
        />
      </Box>
    )

  if (projectMembersError)
    return <ErrorText>{t('errors.members', { ns: 'projects' })}</ErrorText>

  return (
    <ProjectContext.Provider value={contextValue}>
      <ProjectAppBar />
      <Outlet />
    </ProjectContext.Provider>
  )
}
