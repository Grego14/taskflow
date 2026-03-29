import { useMemo } from 'preact/hooks'
import useUser from '@hooks/useUser'
import useLayout from '@hooks/useLayout'

import sortTasks from '@utils/tasks/sortTasks'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import taskIsPending from '@utils/tasks/taskIsPending'
import { ONE_DAY_MS } from '@/constants'

export default function useTaskEngine(rawTasks) {
  const { uid } = useUser()
  const { filter } = useLayout()

  return useMemo(() => {
    if (!rawTasks?.length) return {
      tasksForContainer: [],
      overdueTasks: [],
      othersToArchive: []
    }

    const now = Date.now()
    const isDefaultFilter = filter === 'default'

    const getIsNew = (date) => {
      const time = date?.seconds
        ? date.seconds * 1000
        : new Date(date).getTime()

      return (now - time) < 10000
    }

    const passesFilter = (task) => {
      if (filter === 'assignedToMe') return task.assignedTo?.includes(uid)
      if (filter === 'overdue') return taskIsOverdue(task)
      if (filter === 'default') return !taskIsOverdue(task)

      return task.status === filter
    }

    const processTask = (task) => {
      const isOverdue = taskIsOverdue(task)
      const isCancelled = task.status === 'cancelled'

      return {
        ...task,
        isOverdue,
        isNew: getIsNew(task.createdAt || now),
        subtasks: task?.subtasks?.map(subtask => ({
          ...subtask,
          isParentChecked: task.status === 'done' || isCancelled,
          isParentOverdue: isOverdue,
          isParentCancelled: isCancelled
        }))
      }
    }

    const result = rawTasks.reduce((acc, rawTask) => {
      const task = processTask(rawTask)
      const isPending = taskIsPending(task.status)
      const taskPasses = passesFilter(task)

      // "default view"
      if (isDefaultFilter) {
        if (task.isOverdue && isPending) {
          acc.overdueTasks.push(task)
        } else if (!task.isOverdue) {
          acc.mainFiltered.push(task)
        }

        // add the others tasks to archive only if they were completed/cancelled
        // and not archived after 1 day (will be on the mainFiltered if they were
        // completed/cancelled earlier)
        if (!isPending && task.dueDate) {
          const dueTime = task.dueDate.seconds
            ? task.dueDate.seconds * 1000
            : new Date(task.dueDate).getTime()

          if ((now - dueTime) > ONE_DAY_MS) {
            acc.othersToArchive.push(task)
          }
        }
      }

      if (!isDefaultFilter && taskPasses) {
        // non-default filters
        acc.mainFiltered.push(task)
      }

      // subtask promotion logic
      // it "promotes" to main container if it passes filter but its parent 
      // doesn't (or if we are in default mode and parent is overdue)
      if (rawTask.subtasks?.length) {
        for (const rawSub of rawTask.subtasks) {
          const subPasses = passesFilter(rawSub)

          const shouldPromote = !isDefaultFilter
            ? (subPasses && !taskPasses)
            : (task.isOverdue && !rawSub.isOverdue && subPasses)

          if (shouldPromote) acc.promotedSubtasks.push({
            ...rawSub,
            isParentChecked: task.status === 'done' || task.status === 'cancelled',
            isParentOverdue: task.isOverdue,
            isParentCancelled: task.status === 'cancelled'
          })
        }
      }

      return acc
    }, { overdueTasks: [], mainFiltered: [], promotedSubtasks: [], othersToArchive: [] })

    return {
      tasksForContainer: sortTasks([
        ...result.mainFiltered,
        ...result.promotedSubtasks]),
      overdueTasks: sortTasks(result.overdueTasks),
      othersToArchive: result.othersToArchive,
      isDefaultFilter
    }
  }, [rawTasks, filter, uid])
}
