export default function getNeighbors(taskIds, targetId) {
  const result = { prev: null, next: null }

  if (!Array.isArray(taskIds)) return result

  const index = taskIds.indexOf(targetId)

  if (index !== -1) {
    result.prev = taskIds[index - 1] || null
    result.next = taskIds[index + 1] || null
  }

  return result
}
