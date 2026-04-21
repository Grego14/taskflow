import { Suspense, lazy, memo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TasksContainer from './components/TasksContainer'

const CreateTask = lazy(() => import('./components/buttons/createTask'))
const Retry = lazy(() => import('./components/buttons/retry'))
const ProjectPercentage = lazy(() => import('@components/ui/tasks/ProjectPercentage'))

import useAuth from '@hooks/useAuth'
import useTasks from '@hooks/useTasks'
import { useTranslation } from 'react-i18next'
import useTaskEngine from '@hooks/tasks/useTaskEngine'

const SecondaryCenteredH6 = ({ text }) => (
  <Typography
    variant='h6'
    color='textSecondary'
    textAlign='center'
    sx={{ my: 4 }}>
    {text}
  </Typography>
)

export default memo(function ListPreview() {
  const { isOffline } = useAuth()
  const { t } = useTranslation('tasks')
  const { error } = useTasks()

  const {
    tasksForContainer,
    overdueTasks,
    othersToArchive,
    isDefaultFilter
  } = useTaskEngine()

  const hasContent = tasksForContainer.length > 0 || overdueTasks.length > 0
  const errorMessage = error ? t(`errors.${error}`) : null

  return (
    <Box
      className='flex flex-column'
      width='100%'
      minHeight='100%'
      alignItems={!hasContent ? 'center' : 'auto'}
      py={2}>
      <TasksContainer
        taskIds={tasksForContainer}
        overdueIds={overdueTasks}
        toArchiveIds={othersToArchive}
        error={error}
      />

      {errorMessage && (
        <Box textAlign='center' my='auto'>
          <SecondaryCenteredH6 text={errorMessage} />
          {(error || error === 'query') && (
            <Suspense fallback={null}>
              <Retry />
            </Suspense>
          )}
        </Box>
      )}

      <Suspense fallback={null}>
        {/* project is empty */}
        {!isOffline && error === 'empty' && <CreateTask />}

        {/* non empty project so we show percentage to complete */}
        {isDefaultFilter && hasContent && <ProjectPercentage />}
      </Suspense>
    </Box>
  )
})
