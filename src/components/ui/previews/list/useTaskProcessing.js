import sortTasks from '@utils/tasks/sortTasks'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import { useMemo } from 'react'
import taskIsPending from '@utils/tasks/taskIsPending'

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

      // handle overdue tasks (only for default filter view)
      if (isDefaultFilter && isTaskOverdue && taskIsPending(task.status)) {
        acc.overdueTasks.push(task)
      }

      // handle main container tasks (default and non-default filter)
      if (isDefaultFilter) {
        if (!isTaskOverdue) acc.mainFiltered.push(task)
      } else if (passesFilter) {
        acc.mainFiltered.push(task)
      }

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
    }, { overdueTasks: [], mainFiltered: [], promotedSubtasks: [] })

    const tasksForContainer = sortTasks([
      ...result.mainFiltered,
      ...result.promotedSubtasks
    ])

    return {
      tasksForContainer,
      overdueTasks: isDefaultFilter ? sortTasks(result.overdueTasks) : null,
      filteredTasks: result.mainFiltered, // used for 'no results' UI
      isDefaultFilter
    }
  }, [tasks, filter, uid])
}
