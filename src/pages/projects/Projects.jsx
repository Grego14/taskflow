import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import CreateFromTemplate from '@components/reusable/projects/CreateFromTemplate'

import { useEffect, useState, useMemo, Suspense, lazy } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import useUser from '@hooks/useUser'
import useLoadResources from '@hooks/useLoadResources'
import { useGSAP } from '@gsap/react'

const CreateProject = lazy(() => import('@components/ui/buttons/CreateProject'))
const ProjectsCards = lazy(() => import('@components/ui/projectcard/ProjectsCards'))

import { dbAdapter } from '@services/dbAdapter'
import projectService from '@services/project'

import gsap from 'gsap'

const containerStyles = (hasProjects) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  width: '100%',
  py: 2,
  px: { xs: 2, mobile: 3, tablet: 4 },
  ...(hasProjects ? {} : { height: '100%', justifyContent: 'center', my: 'auto' })
})

const hidden = { opacity: 0, visibility: 'hidden' }

export default function Projects() {
  const { uid } = useUser()
  const { t } = useTranslation('projects')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingResources = useLoadResources('projects')

  // get the user projects and external projects he is working on
  useEffect(() => {
    if (!uid) return

    const { userProjects, externalProjects } = projectService.getProjectsQueries(uid)
    const projectMap = new Map()

    const handleSnapshot = (snap) => {
      for (const change of snap.docChanges()) {
        const { id } = change.doc

        if (change.type === 'removed') {
          projectMap.delete(id)
        } else {
          // 'added' or 'modified'
          projectMap.set(id, projectService.formatProject(change.doc))
        }
      }

      setProjects([...projectMap.values()])
      setLoading(false)
    }

    const unsubUser = dbAdapter.listen(userProjects, handleSnapshot)
    const unsubExt = dbAdapter.listen(externalProjects, handleSnapshot)

    return () => {
      unsubUser()
      unsubExt()
    }
  }, [uid])

  useGSAP(() => {
    if (loadingResources || loading) return

    gsap.set('#project-buttons', { y: 50 })
    gsap.to('#project-buttons', {
      autoAlpha: 1,
      y: 0,
      ease: 'expo.out',
      duration: 1,
      delay: 0.75
    })
  }, [loadingResources, loading])

  const hasProjects = projects.length > 0
  const btnStyles = { alignSelf: hasProjects ? 'start' : 'center' }

  if (loadingResources) return <CircleLoader text={t('common:loading')} />
  if (loading) return <CircleLoader text={t('projects:loading')} />

  return (
    <Box sx={containerStyles(hasProjects)}>
      <Suspense fallback={null}>
        {!hasProjects ? (
          <Box>
            <Typography variant='h5' textAlign='center'>
              {t('errors.empty')}
            </Typography>
            <Box
              className='flex flex-center flex-column'
              gap={2}
              mt={4}
              {...hidden}
              id='project-buttons'>
              <CreateProject sx={btnStyles} />
              <CreateFromTemplate />
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography
              variant='h1'
              textAlign={{ xs: 'center', tablet: 'start' }}
              sx={[theme => ({ ...theme.typography.h4, fontWeight: 700 })]}>
              {t('title_quantity', { quantity: projects.length })}
            </Typography>

            <ProjectsCards data={projects} />
            <Box className='flex' sx={{
              '@media (max-width: 28rem)': {
                flexDirection: 'column',
                alignItems: 'start'
              }
            }}
              gap={2}
              {...hidden}
              mt={4}
              id='project-buttons'>
              <CreateProject sx={btnStyles} />
              <CreateFromTemplate sx={{ flexDirection: 'row' }} />
            </Box>
          </Box>
        )}
      </Suspense>
    </Box>
  )
}
