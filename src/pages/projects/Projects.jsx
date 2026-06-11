import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import CreateFromTemplate from '@components/reusable/projects/CreateFromTemplate'
import AnimatedTitle from '@components/reusable/texts/AnimatedTitle'
import CreateProject from '@components/ui/buttons/CreateProject'

import { 
  useEffect, 
  useState, 
  useMemo, 
  Suspense, 
  lazy, 
  useRef 
} from 'preact/compat'

import { useTranslation } from 'react-i18next'
import useUser from '@hooks/useUser'
import useLoadResources from '@hooks/useLoadResources'
import { useGSAP } from '@gsap/react'
import useCounterAnimation from '@hooks/animations/useCounterAnimation'

const ProjectsCards = lazy(() => import('@components/ui/projectcard/ProjectsCards'))

import { dbAdapter } from '@services/dbAdapter'
import projectService from '@services/project'

import gsap from 'gsap'

const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  width: '100%',
  flexGrow: 1,
  py: 2,
  px: { xs: 2, mobile: 3, tablet: 4 },
}

const noProjectsStyles = { my: 'auto' }

const btnsContainerStyles = {
  '@media (max-width: 28rem)': {
    flexDirection: 'column',
    alignItems: 'start'
  }
}

const btnStyles = { 
  hasProjects: { alignSelf: 'start'}, 
  noProjects: { alignSelf: 'center'} 
}

export default function Projects() {
  const { uid } = useUser()
  const { t } = useTranslation('projects')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingResources = useLoadResources('projects')

  const projectsRef = useRef(null)
  const [animateButtons, setAnimateButtons] = useState(false)

  // get the user projects and external projects he is working on
  useEffect(() => {
    if (!uid) return

    const { userProjects, externalProjects } =
    projectService.getProjectsQueries(uid)
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

  const animatedCount = useCounterAnimation(projects?.length, {
    trigger: projectsRef,
    revert: true
  })

  useGSAP(() => {
    if (loadingResources || loading || !animateButtons) return

    gsap.set('#project-buttons', { y: 50 })
    gsap.to('#project-buttons', {
      autoAlpha: 1,
      y: 0,
      ease: 'expo.out',
      duration: 1,
      delay: 0.75
    })
  }, [loadingResources, loading, animateButtons])

  const hasProjects = projects.length > 0

  if (loadingResources) return <CircleLoader text={t('common:loading')} />
  if (loading) return <CircleLoader text={t('projects:loading')} />

  return (
    <Box sx={containerStyles} ref={projectsRef}>
      {hasProjects ? (
        <Box>
          <Box className='flex' gap={1}>
            <AnimatedTitle
              id='projects-title'
              textAlign='start'>
              {t('text')}
            </AnimatedTitle>
            <Typography component='span' variant='h4' fontWeight={700}>
              {`(${animatedCount})`}
            </Typography>
          </Box>

          <Suspense fallback={null}>
            <ProjectsCards
              data={projects}
              setAnimateButtons={setAnimateButtons}
            />
          </Suspense>

          <Box className='flex hide-element' sx={btnsContainerStyles}
            gap={2}
            mt={4}
            id='project-buttons'>
            <CreateProject sx={hasProjects 
              ? btnStyles.hasProjects 
              : btnStyles.noProjects} 
            />
            <CreateFromTemplate sx={{ flexDirection: 'row' }} />
          </Box>
        </Box>
      ): (
          <Box sx={noProjectsStyles}>
            <Box>
              <Typography variant='h5' textAlign='center'>
                {t('errors.empty')}
              </Typography>
              <Box
                className='flex flex-center flex-column hide-element'
                gap={2}
                mt={4}
                id='project-buttons'>
                <CreateProject sx={hasProjects 
                  ? btnStyles.hasProjects 
                  : btnStyles.noProjects} 
                />
                <CreateFromTemplate />
              </Box>
            </Box>
          </Box>
        )}
    </Box>
  )
}
