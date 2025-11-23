import sortTasks from '@utils/tasks/sortTasks'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import { useMemo } from 'react'
import taskIsPending from '../../../../utils/tasks/taskIsPending'

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
 * isDefaultFilter: boolean
 * }} The processed task data.
 */
export default function useTaskProcessing(tasks, filter, uid) {
  const processedData = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) {
      return {
        overdueTasks: null,
        todayTasks: null,
        filteredTasks: [],
        filteredSubtasks: [],
        isDefaultFilter: filter === 'default'
      }
    }

    const isDefaultFilter = filter === 'default'
    const filterFn = getTaskFilterFn(filter, uid)

    const accumulator = tasks.reduce(
      (acc, task) => {
        const isTaskOverdue = taskIsOverdue(task)

        // classification logic (for 'default' filter)
        if (isTaskOverdue) {
          // an overdue taks is a task that is neither done or cancelled
          if (taskIsPending(task.status)) {
            acc.overdueTasks.push(task)
          }
        } else {
          acc.notOverdueTasks.push(task)
        }

        // for specific filters (non-default)
        if (!isDefaultFilter && filterFn(task)) {
          acc.specificFilterTasks.push(task)
        }

        if (task.subtasks) {
          for (const subtask of task.subtasks) {
            const isSubtaskOverdue = taskIsOverdue(subtask)
            const subtaskPassesFilter = filterFn(subtask)

            // non-overdue subtasks of OVERDUE Tasks (used in 'default' filter)
            if (isDefaultFilter && isTaskOverdue && !isSubtaskOverdue) {
              acc.defaultSubtasks.push(subtask)
            }

            // allow the user to see his assigned subtasks whose parent task
            // might not have been assigned to him
            // if the subtask status is the same as the task status the subtask
            // is going to appear inside the subtasks accordeon of the task
            if (
              !isDefaultFilter &&
              (subtaskPassesFilter || filter === subtask.status) &&
              filter !== task.status &&
              // the subtask is going to apper inside the subtasks accordeon of
              // the task
              subtask.subtask !== task.id
            ) {
              acc.specificFilterTasks.push(subtask)
            }
          }
        }

        return acc
      },
      {
        overdueTasks: [], // all overdue tasks
        notOverdueTasks: [], // all non-overdue tasks (main tasks only)
        specificFilterTasks: [], // main tasks that pass a specific filter (non-default)
        defaultSubtasks: [] // non-overdue subtasks within overdue tasks (for 'default')
      }
    )

    // main tasks to be displayed (based on the current filter)
    const mainFilteredTasks = isDefaultFilter
      ? accumulator.notOverdueTasks // if 'default', show non-overdue tasks
      : accumulator.specificFilterTasks // otherwise, show tasks matching the specific filter

    // subtasks to be displayed
    let finalFilteredSubtasks = []

    if (isDefaultFilter) {
      // use the pre-collected non-overdue subtasks and apply filterFn
      finalFilteredSubtasks = accumulator.defaultSubtasks.filter(filterFn)
    } else {
      // find non-overdue subtasks within OVERDUE tasks, and apply the specific filter.
      finalFilteredSubtasks = tasks
        .filter(task => taskIsOverdue(task) && task.subtasks)
        .flatMap(task => task.subtasks)
        .filter(subtask => {
          if (mainFilteredTasks?.find(task => task.id === subtask.id))
            return false

          return !taskIsOverdue(subtask) && filterFn(subtask)
        })
    }

    const overdueTasks = isDefaultFilter
      ? sortTasks(accumulator.overdueTasks)
      : null

    const todayTasks = isDefaultFilter ? mainFilteredTasks : null // alias for notOverdueTasks

    const tasksForContainer = sortTasks([
      ...mainFilteredTasks,
      ...finalFilteredSubtasks
    ])

    return {
      tasksForContainer, // combined and sorted list of tasks and subtasks
      overdueTasks, // sorted list of overdue tasks (null if not 'default')
      todayTasks, // non-overdue main tasks (null if not 'default')
      filteredTasks: mainFilteredTasks, // main tasks (used for the `noTasksWithFilter` check)
      isDefaultFilter
    }
  }, [tasks, filter, uid])

  return processedData
}
