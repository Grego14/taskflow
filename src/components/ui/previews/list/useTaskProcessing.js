import { useMemo } from 'preact/hooks'

import sortTasks from '@utils/tasks/sortTasks'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import taskIsPending from '@utils/tasks/taskIsPending'
import formatTimestamp from '@utils/formatTimestamp'

import { ONE_DAY_MS } from '@/constants'

/**
 * Generates a filtering function based on the current filter criteria.
 * This function will be applied to both main tasks and subtasks.
 *
 * @param {string} filter - The current filter setting ('default', 'overdue', 'assignedToMe', or a task status).
 * @param {string} uid - The current user's ID.
 * @returns {function(Object): boolean} A function that returns true if the task/subtask passes the filter.
 */
const getTaskFilterFn = (filter, uid) => taskOrSubtask => {
  if (!taskOrSubtask) return false

  if (filter === 'assignedToMe') {
    return taskOrSubtask.assignedTo?.includes(uid)
  }

  const isOverdue = taskIsOverdue(taskOrSubtask)
  if (filter === 'overdue') return isOverdue
  if (filter === 'default') return !isOverdue // only non-overdue tasks are shown under 'default'

  return taskOrSubtask.status === filter
}

/**
 * Processes the raw list of tasks into categorized and filtered lists
 * required by the ListPreview component
 *
 * @param {Array<Object>} tasks - The raw list of tasks
 * @param {string} filter - The current filter setting
 * @param {string} uid - The current user's ID
 * @returns {{
 * tasksForContainer: Array<Object>,
 * overdueTasks: Array<Object> | null,
 * filteredTasks: Array<Object>,
 * filteredSubtasks: Array<Object>,
 * }} The processed task data.
 */
export default function useTaskProcessing(tasks, filter, uid) {
  return useMemo(() => {
    const isDefaultFilter = filter === 'default'
    const filterFn = getTaskFilterFn(filter, uid)

    if (!tasks?.length) {
      return {
        tasksForContainer: [],
        overdueTasks: null,
        filteredTasks: []
      }
    }

    const result = tasks.reduce((acc, task) => {
      const isTaskOverdue = taskIsOverdue(task)
      const passesFilter = filterFn(task)
      const isPending = taskIsPending(task.status)

      if (isDefaultFilter) {

        // handle overdue tasks (only for default filter view)
        if (isTaskOverdue && isPending) acc.overdueTasks.push(task)

        // handle main container tasks (default and non-default filter)
        if (!isTaskOverdue) acc.mainFiltered.push(task)

        if (!isPending && task.dueDate) {
          const dueDate = task.dueDate.seconds
            ? formatTimestamp(task.dueDate).raw
            : new Date(task.dueDate)

          const now = new Date()

          const diffInMs = dueDate.getTime() - now.getTime()
          const diffInDays = Math.round(diffInMs / ONE_DAY_MS)

          // add the others tasks to archive only if they were
          // completed/cancelled and not archived after 1 day (will be on the
          // mainFiltered if they were completed/cancelled earlier)
          if (diffInDays < 0) {
            acc.othersToArchive.push(task)
          }
        }

      } else if (passesFilter) acc.mainFiltered.push(task)

      // handle subtasks
      if (task.subtasks?.length) {
        for (const subtask of task.subtasks) {
          const isSubOverdue = taskIsOverdue(subtask)
          const subPassesFilter = filterFn(subtask)

          // subtask promotion logic
          // it "promotes" to main container if it passes filter but its parent 
          // doesn't (or if we are in default mode and parent is overdue)
          const shouldPromote = !isDefaultFilter
            ? (subPassesFilter && !passesFilter)
            : (isTaskOverdue && !isSubOverdue && subPassesFilter)

          if (shouldPromote) {
            acc.promotedSubtasks.push(subtask)
          }
        }
      }

      return acc
    }, {
      overdueTasks: [],
      mainFiltered: [],
      promotedSubtasks: [],
      othersToArchive: []
    })

    const tasksForContainer = sortTasks([
      ...result.mainFiltered,
      ...result.promotedSubtasks
    ])

    return {
      tasksForContainer,
      overdueTasks: isDefaultFilter ? sortTasks(result.overdueTasks) : null,
      filteredTasks: result.mainFiltered, // used for 'no results' UI
      othersToArchive: result.othersToArchive,
      isDefaultFilter
    }
  }, [tasks, filter, uid])
}
