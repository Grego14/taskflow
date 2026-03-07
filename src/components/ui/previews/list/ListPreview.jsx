import { Suspense, lazy, memo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TasksContainer from './components/TasksContainer'

const CreateTask = lazy(() => import('./components/buttons/createTask'))
const Retry = lazy(() => import('./components/buttons/retry'))
const ProjectPercentage = lazy(() => import('@components/ui/tasks/ProjectPercentage'))

import useAuth from '@hooks/useAuth'
import useTasks from '@hooks/useTasks'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import useTaskProcessing from './useTaskProcessing'
import useLayout from '@hooks/useLayout'

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
  const { uid } = useUser()
  const { filter } = useLayout()
  const { tasks, error } = useTasks()

  const { tasksForContainer, overdueTasks, filteredTasks, othersToArchive } =
    useTaskProcessing(tasks, filter, uid)

  const hasContent = tasksForContainer?.length > 0 || overdueTasks?.length > 0
  const isFilterEmpty = filter !== 'default' && filteredTasks.length < 1
  const showTasks = (hasContent && !isFilterEmpty) ||
    filter === 'default' && tasksForContainer?.length < 1

  const getErrorMessage = () => {
    if (error) return t(`errors.${error}`)
    if (isFilterEmpty) return t('noTasksWithFilter_filter', { filter, count: 0 })
    return null
  }

  const errorMessage = getErrorMessage()

  return (
    <Box
      className='flex flex-column'
      width='100%'
      minHeight='100%'
      alignItems={!hasContent ? 'center' : 'auto'}
      py={2}>
      {showTasks && (
        <TasksContainer
          tasks={tasksForContainer}
          overdueTasks={overdueTasks}
          toArchive={othersToArchive}
          filter={filter}
        />
      )}

      {errorMessage && (
        <Box textAlign='center'>
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
        {hasContent && <ProjectPercentage />}
      </Suspense>
    </Box>
  )
})
