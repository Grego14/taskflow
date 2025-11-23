export const getSubtasks = (tasks, target) => {
  const subtasks = tasks?.flatMap(task => task.subtasks)

  if (target) {
    return subtasks?.filter(task => task.subtask === target)
  }

  return subtasks
}

export const getTaskWithId = (tasks, id) => tasks?.find(task => task.id === id)

export const isSubtask = (tasks, taskId) => {
  if (!taskId || !Array.isArray(tasks)) return false

  const subtasks = getSubtasks(tasks)
  return !!getTaskWithId(subtasks, taskId)
}
