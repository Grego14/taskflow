const sortTasks = tasks => {
  if (!Array.isArray(tasks)) return []

  return tasks.toSorted((a, b) => {
    const posA = a.position ?? 0
    const posB = b.position ?? 0

    // smallest position goes to the top
    return posA - posB
  })
}

export default sortTasks
