import { Suspense, lazy, memo, useCallback, useMemo } from 'preact/compat'
import TasksWrapper from '@components/ui/previews/list/components/TasksWrapper'
import DropTarget from './DropTarget'

const NoTodayTasks = lazy(() => import('./NoTodayTasks'))

import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'

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
  toArchive = []
}) {
  const { t } = useTranslation('tasks')
  const { id: projectId, data } = useProject()
  const { actions, tasks: projectTasks } = useTasks()
  const { filter } = useLayout()

  const isDefaultFilter = filter === 'default'
  const hasTodayTasks = tasks?.length > 0
  const showOverdueTasks = overdueTasks?.length > 0 && isDefaultFilter

  const titleKey = useMemo(() => {
    const titleKeys = {
      assignedToMe: 'filterTasks_assignedToMe',
      default: 'todayTasks'
    }

    const filterIsEmpty = !isDefaultFilter && tasks?.length < 1

    if (filterIsEmpty) return 'noTasksWithFilter_filter'
    if (!hasTodayTasks && isDefaultFilter) return 'todayTasks'

    return titleKeys[filter] || 'filterTasks_filter'
  }, [filter])

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

  const todayWrapperProps = useMemo(() => ({
    tasks,
    variant: 'h5',
    title: t(titleKey, { count: tasks.length, filter }),
    divider: showOverdueTasks,
    containerStyles: !hasTodayTasks ? {
      mt: showOverdueTasks ? 8 : 'auto',
      mb: showOverdueTasks ? 6 : 'auto'
    } : null,
    children: (!hasTodayTasks && isDefaultFilter) && (
      <Suspense fallback={null}>
        <NoTodayTasks />
      </Suspense>
    )
  }), [
    tasks,
    titleKey,
    showOverdueTasks,
    hasTodayTasks,
    isDefaultFilter,
    t
  ])

  const renderTodayTasks = useCallback(({ dragState, ref }) => (
    <TasksWrapper
      {...todayWrapperProps}
      dragState={dragState}
      ref={ref}
    />
  ), [todayWrapperProps])

  return (
    <>
      <DropTarget
        dropId={TASKS_DROP_ID}
        // only allow overdue tasks to be moved to the "today tasks" dropTarget
        canMove={(dropId, source) => dropId === TASKS_DROP_ID
          && source.data?.isOverdue}
        onMove={handleMoveTask}
        render={renderTodayTasks}
      />

      {showOverdueTasks && overdueTasks.length > 0 && (
        <TasksWrapper
          tasks={overdueTasks}
          title={t('overdueTasks_quantity', { quantity: overdueTasks?.length })}
          type='overdue'
        />
      )}

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
