import { Suspense, lazy, memo } from 'react'
import TasksWrapper from '@components/ui/previews/list/components/TasksWrapper'
import DropTarget from './DropTarget'

const NoTodayTasks = lazy(() => import('./NoTodayTasks'))

import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import { useTranslation } from 'react-i18next'

import getFirstPosition from '@utils/tasks/getFirstPosition'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'

const TASKS_DROP_ID = 'todayTasks'

// get today's midnight date
const getTodayMidnight = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

export default memo(function TasksContainer({
  tasks = [],
  overdueTasks = [],
  toArchive = [],
  filter
}) {
  const { t } = useTranslation('tasks')
  const { id: projectId, data } = useProject()
  const { actions, tasks: projectTasks } = useTasks()

  const isDefaultFilter = filter === 'default'
  const hasTodayTasks = tasks?.length > 0
  const showOverdueTasks = overdueTasks?.length > 0 && isDefaultFilter

  const titleKeys = {
    assignedToMe: 'filterTasks_assignedToMe',
    default: 'todayTasks'
  }

  const titleKey = !hasTodayTasks
    ? 'todayTasks'
    : (titleKeys[filter] || 'filterTasks_filter')

  const handleMoveTask = async ({ source }) => {
    const { id, isOverdue } = source?.data || {}
    if (!id || !isOverdue) return

    // get current active tasks to calculate the new first position
    const activeTasks = projectTasks.filter(t => !taskIsOverdue(t))
    const position = getFirstPosition(activeTasks)

    await actions.updateTask({
      user: data?.createdBy,
      project: projectId,
      id,
      data: {
        dueDate: getTodayMidnight(),
        rawDate: 'today',
        position
      }
    })
  }

  const todayWrapperProps = {
    tasks,
    variant: 'h5',
    title: t(titleKey, { count: tasks.length, filter }),
    divider: showOverdueTasks,
    containerStyles: !hasTodayTasks ? {
      mt: showOverdueTasks ? 8 : 'auto',
      mb: showOverdueTasks ? 6 : 'auto'
    } : null,
    children: !hasTodayTasks && (
      <Suspense fallback={null}>
        <NoTodayTasks />
      </Suspense>
    )
  }

  return (
    <>
      <DropTarget
        dropId={TASKS_DROP_ID}
        // only allow overdue tasks to be moved to the "today tasks" dropTarget
        canMove={(dropId, source) => dropId === TASKS_DROP_ID
          && source.data?.isOverdue}
        onMove={handleMoveTask}
        render={({ dragState, ref }) => (
          <TasksWrapper {...todayWrapperProps} dragState={dragState} ref={ref} />
        )}
      />

      <TasksWrapper
        tasks={overdueTasks}
        show={showOverdueTasks}
        title={t('overdueTasks_quantity', { quantity: overdueTasks?.length })}
      />

      {toArchive.length > 0 && (
        <TasksWrapper
          tasks={toArchive}
          title={t('toArchiveTasks', { quantity: toArchive?.length })}
          expand={false}
        />
      )}
    </>
  )
})
