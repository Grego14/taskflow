export default function getNeighbors(tasks, targetId) {
  const index = tasks.findIndex(t => t.id === targetId)
  if (index === -1) return { prev: null, next: null }

  return {
    prev: tasks[index - 1] || null,
    next: tasks[index + 1] || null
  }
}
