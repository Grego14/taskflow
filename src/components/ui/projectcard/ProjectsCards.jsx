// components
import ProjectCard from '@components/ui/projectcard/ProjectCard'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// hooks
import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

export default function ProjectsCards({ data }) {
  const { t } = useTranslation('ui')
  const { isMobile } = useApp()
  const { metadata } = useUser()

  const lastProject = metadata?.lastEditedProject
  const lastProjectData = data?.find(p => p.id === lastProject)
  const cardWidth = isMobile ? '20rem' : '25rem'

  return (
    <Box
      className={`flex flex-column${isMobile ? ' flex-center' : ''}`}
      gap={2.5}
      my={2.5}>
      {lastProjectData && (
        <Box className='flex flex-column' gap={2}>
          <Typography variant='h2' sx={[theme => ({ ...theme.typography.h5 })]}>
            {t('projects.recentProject')}
          </Typography>
          <ProjectCard data={lastProjectData} />
          {data?.length > 1 && <Divider sx={{ mt: 2 }} />}
        </Box>
      )}

      {!lastProjectData || data?.length > 0 && (
        <div>
          <Typography variant='h2' sx={[theme => ({ ...theme.typography.h5 })]}>
            {t('projects.lastProjects')}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(${cardWidth}, max-content))`,
              gridAutoFlow: 'dense',
              gap: 2
            }}
            mt={2}>
            {data
              ?.sort(project => (project.isArchived ? 1 : -1))
              ?.map(project =>
                project?.id !== lastProject ? (
                  <ProjectCard data={project} key={project?.id} />
                ) : null
              )}
          </Box>
        </div>
      )}
    </Box>
  )
}
