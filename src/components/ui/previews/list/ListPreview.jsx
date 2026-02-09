import { Suspense, lazy, memo } from 'react'

// component
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TasksContainer from './components/TasksContainer'

const CreateProject = lazy(() => import('./components/buttons/createProject'))
const CreateTask = lazy(() => import('./components/buttons/createTask'))
const Retry = lazy(() => import('./components/buttons/retry'))
const ProjectPercentage = lazy(
  () => import('@components/ui/tasks/ProjectPercentage')
)

import useApp from '@hooks/useApp'
// hooks
import useAuth from '@hooks/useAuth'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import useTaskProcessing from './useTaskProcessing'
import useLayout from '@hooks/useLayout'

export default memo(function ListPreview() {
  const { isOffline } = useAuth()
  const { t } = useTranslation(['ui', 'common'])

  const { uid, metadata } = useUser()
  const { filter } = useLayout()

  const { tasks, error } = useTasks()
  const { id, data } = useProject()

  const isOwner = data?.createdBy === uid
  const errorTranslation = error && t(`tasks.errors.${error}`)

  const { tasksForContainer, overdueTasks, filteredTasks, isDefaultFilter } =
    useTaskProcessing(tasks, filter, uid)

  const hasTasks = tasksForContainer?.length > 0 || overdueTasks?.length > 0

  const noTasksWithFilter =
    !isDefaultFilter && filteredTasks.length < 1
      ? t('tasks.noTasksWithFilter_filter', {
        filter,
        count: filteredTasks.length
      })
      : ''

  return (
    <Box
      className='flex flex-column'
      width='100%'
      minHeight='100%'
      alignItems={!tasks?.length ? 'center' : 'auto'}
      py={2}>
      {!noTasksWithFilter && (
        <TasksContainer
          tasks={tasksForContainer}
          overdueTasks={overdueTasks}
          filter={filter}
        />
      )}
      {(error || !!noTasksWithFilter) && (
        <>
          <SecondaryCenteredH6 text={errorTranslation || noTasksWithFilter} />
          {errorTranslation && <Retry />}
        </>
      )}
      <Suspense fallback={null}>
        {/* button to let the user retry the query */}
        {error === 'query' && !tasks?.length && (
          <>
            <SecondaryCenteredH6 text={t('tasks.retryQuery')} />
            <Retry />
          </>
        )}

        {!isOffline && error === 'empty' && <CreateTask />}

        {hasTasks && <ProjectPercentage />}
      </Suspense>
    </Box>
  )
})

function SecondaryCenteredH6({ text }) {
  return (
    <Typography
      variant='h6'
      color='textSecondary'
      textAlign='center'
      sx={{ my: 4 }}>
      {text}
    </Typography>
  )
}
