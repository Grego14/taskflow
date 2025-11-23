const sortTasks = tasks => {
  const getPriority = task => {
    if (task.status !== 'cancelled' && task.status !== 'done') return 1

    if (task.status === 'done') return 2

    if (task.status === 'cancelled') return 3
  }

  return tasks.sort((a, b) => {
    const priorityA = getPriority(a)
    const priorityB = getPriority(b)

    return priorityA - priorityB
  })
}

export default sortTasks
