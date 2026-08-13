import { useMemo } from 'preact/hooks'
import useUser from '@hooks/useUser'
import useLayout from '@hooks/useLayout'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import taskIsPending from '@utils/tasks/taskIsPending'
import { serverTimestamp } from 'firebase/firestore'

import { taskRegistry, taskVersion } from '@stores/task'

// helper to evaluate time-based filters
const checkPassesTimeFilter = (task, timeFilter) => {
  if (timeFilter === 'allTasks') return true
  if (typeof task.dueDate !== 'object' || !('toDate' in task.dueDate)) return false

  const taskDate = new Date(task.dueDate?.toDate())
  taskDate.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (timeFilter === 'today') return taskDate.getTime() === today.getTime()
  if (timeFilter === 'upcoming') return taskDate.getTime() > today.getTime()

  return true
}

const checkPassesFilter = (task, filter, uid) => {
  if (['allTasks', 'today', 'upcoming'].includes(filter)) {
    return checkPassesTimeFilter(task, filter)
  }

  if (filter === 'assignedToMe') return task.assignedTo?.includes(uid)
  if (filter === 'overdue') return taskIsOverdue(task)
  return task.status === filter
}

export default function useTaskEngine() {
  const { uid } = useUser()
  const { filter } = useLayout()

  const registry = taskRegistry.value
  const _version = taskVersion.value

  return useMemo(() => {
    const tasks = Array.from(registry.values()).map(tSignal => tSignal.peek())

    if (!tasks.length) return {
      tasksForContainer: [],
      overdueTasks: [],
      othersToArchive: []
    }

    const isDefaultFilter = filter === 'default'

    // sort the tasks before the reduce so the IDs are inserted in the correct
    // order
    const sortedTasks = tasks
    .toSorted((a, b) => (a.position ?? 0) - (b.position ?? 0))

    const result = sortedTasks.reduce((acc, task) => {
      const isOverdue = taskIsOverdue(task)
      const isPending = taskIsPending(task.status)
      const isSubtask = !!task.parentId

      const passes = !isDefaultFilter && checkPassesFilter(task, filter, uid)

      if (isDefaultFilter) {
        if (!isSubtask && isOverdue && isPending) {
          // "overdue tasks wrapper"
          acc.overdueIds.push(task.id)
        } else if (!isSubtask && !isOverdue) {
          // "today tasks wrapper"
          acc.mainIds.push(task.id)
        }

        // subtask promotion
        if (isSubtask && !isOverdue && isPending) {
          const parent = registry.get(task.parentId)?.peek()
          if (parent && taskIsOverdue(parent)) acc.promotedIds.push(task.id)
        }

        // "tasks to archive wrapper"
        if (!isPending && task.dueDate && isOverdue) {
          acc.archiveIds.push(task.id)
        }

      } else if (passes) {
        // non-default filters: include all matching tasks
        // for subtasks, only promote them if the parent doesn't match the filter
        // or passes it but is overdue
        // to avoid duplication, as they would already be rendered within their parent
        if (isSubtask) {
          const parent = registry.get(task.parentId)?.peek()
          const parentPassesFilter = parent && 
            checkPassesFilter(parent, filter, uid)

          if (!parentPassesFilter) 
            acc.promotedIds.push(task.id)
        } else {
          acc.mainIds.push(task.id)
        }
      }

      return acc
    }, { overdueIds: [], mainIds: [], promotedIds: [], archiveIds: [] })

    return {
      tasksForContainer: [...result.mainIds, ...result.promotedIds],
      overdueTasks: result.overdueIds,
      othersToArchive: result.archiveIds,
      isDefaultFilter
    }
  }, [registry, filter, uid, _version])
}
