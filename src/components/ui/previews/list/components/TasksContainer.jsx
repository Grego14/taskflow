import { Suspense, lazy, memo } from 'react'

import TasksWrapper from '@components/ui/previews/list/components/TasksWrapper'
// components
import DropTarget from './DropTarget'

const NoTodayTasks = lazy(() => import('./NoTodayTasks'))

// hooks
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import { useTranslation } from 'react-i18next'

const tasksDropId = 'todayTasks'

export default memo(function TasksContainer({
  tasks = [],
  overdueTasks = [],
  filter
}) {
  const { t } = useTranslation('ui')
  const { id: projectId, data } = useProject()
  const { actions, tasks: projectTasks } = useTasks()

  const isDefaultFilter = filter === 'default'

  const showOverdueTasks = overdueTasks?.length > 0 && isDefaultFilter
  const hasTodayTasks = tasks?.length > 0

  const filteredTasksTitle = (() => {
    // todayTasks translations manages when there are no tasks
    if (!hasTodayTasks) return 'todayTasks'
    if (isDefaultFilter && hasTodayTasks) return 'todayTasks'

    if (filter === 'asssignedToMe') return 'filterTasks_assignedToMe'

    return 'filterTasks_filter'
  })()

  const todayTasksDropTargetWrapperProps = {
    tasks,
    variant: 'h5',
    title: t(`tasks.${filteredTasksTitle}`, {
      count: tasks?.length || 0,
      filter
    }),
    divider: showOverdueTasks,
    children: !hasTodayTasks && (
      <Suspense>
        <NoTodayTasks />
      </Suspense>
    ),
    containerStyles: !hasTodayTasks
      ? {
          mt: showOverdueTasks ? 8 : 'auto',
          mb: showOverdueTasks ? 6 : 'auto'
        }
      : null
  }

  return (
    <>
      {/* we only use a dropTarget because only overdue tasks are allowed 
        to be dropped */}
      <DropTarget
        dropId={tasksDropId}
        render={({ dragState, ref }) => {
          const props = { ...todayTasksDropTargetWrapperProps, dragState, ref }
          return <TasksWrapper {...props} />
        }}
        canMove={(dropId, source) => {
          const isTodayTasksTarget = dropId === tasksDropId
          const isOverdueTask = source.data?.isOverdue

          // only allow overdue tasks to be moved to the "today tasks" dropTarget
          return isTodayTasksTarget && isOverdueTask
        }}
        onMove={async ({ source }) => {
          if (!source?.data) return

          const { isOverdue, id } = source.data

          if (!id || !isOverdue) return

          const dueDate = new Date()
          dueDate.setDate(dueDate.getDate() + 1)

          // set the time to the last hour of the day
          dueDate.setHours(0, 0, 0, 0)

          // schedule the dropped task to today
          await actions.updateTask({
            user: data?.createdBy,
            project: projectId,
            id,
            data: { dueDate: dueDate.toISOString(), rawDate: 'today' }
          })
        }}
      />

      <TasksWrapper
        tasks={overdueTasks}
        show={showOverdueTasks}
        title={t('tasks.overdueTasks_quantity', {
          quantity: overdueTasks?.length || 0
        })}
        tasksStyles={{ opacity: 0.7 }}
      />
    </>
  )
})
