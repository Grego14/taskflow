import { useMemo } from 'preact/hooks'
import useUser from '@hooks/useUser'
import useLayout from '@hooks/useLayout'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import taskIsPending from '@utils/tasks/taskIsPending'

import { taskRegistry } from '@stores/task'

const checkPassesFilter = (task, filter, uid) => {
  if (filter === 'assignedToMe') return task.assignedTo?.includes(uid)
  if (filter === 'overdue') return taskIsOverdue(task)
  return task.status === filter
}

export default function useTaskEngine() {
  const { uid } = useUser()
  const { filter } = useLayout()

  const registryValues = [...taskRegistry.value.values()]

  return useMemo(() => {
    if (!registryValues.length) return {
      tasksForContainer: [],
      overdueTasks: [],
      othersToArchive: []
    }

    const isDefaultFilter = filter === 'default'

    // sort the tasks before the reduce so the IDs are inserted in the correct
    // order
    const sortedTasks = registryValues.toSorted((a, b) => {
      const posA = a.position ?? 0
      const posB = b.position ?? 0
      return posA - posB
    })

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
          const parent = taskRegistry.value.get(task.parentId)

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
          const parent = taskRegistry.value.get(task.parentId)
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
  }, [registryValues, filter, uid])
}
