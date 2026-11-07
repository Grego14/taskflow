import getNewPosition from './getNewPosition'
import sortTasks from './sortTasks'

export default function getFirstPosition(list) {
  if (!list || list.length === 0) return getNewPosition(null, null)

  const sorted = sortTasks(list)
  const firstTaskPos = sorted[0]?.position ?? null

  // passing null as prevPos triggers the logic to place it at the very top
  return getNewPosition(null, firstTaskPos)
}
