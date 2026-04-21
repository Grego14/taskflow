import { useCallback } from 'preact/hooks'

import sortTasks from '@utils/tasks/sortTasks'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import getNewPosition from '@utils/tasks/getNewPosition'

import { taskRegistry, rootTaskIds } from '@stores/task'

export default function useReorder(reorderTask) {
  const handleReorder = useCallback(async (
    source, 
    targetId, 
    edge, 
    newStatus = null // only used on KANBAN
  ) => {
    // try to drop a task on one of the same task drop indicators
    if (source.id === targetId) return

    const registry = taskRegistry.value
    const isSubtask = !!source.parentId
    const parentId = source.parentId
    let list = []

    if (isSubtask) {
      const parent = registry.get(parentId)
      const subtaskIds = parent?.subtasks || []

      for (const id of subtaskIds) {
        const subtask = registry.get(id)
        if (subtask) list.push(subtask)
      }
    } else {
      for (const id of rootTaskIds.value) {
        const task = registry.get(id)
        if (task && !taskIsOverdue(task)) list.push(task)
      }
    }

    if (list.length < 2) {
      // if there's only one task and we are here, it's either a status change 
      // or an invalid move.
      if (!newStatus) return
    }

    // sort to get the current visual order
    const sortedList = sortTasks(list)
    const sourceIndex = sortedList.findIndex(t => t.id === source.id)
    const targetIndex = sortedList.findIndex(t => t.id === targetId)

    if (sourceIndex === -1 || targetIndex === -1) return

    // move UP only if target is NOT the task directly below
    if (!newStatus && edge === 'top' && 
        sourceIndex === targetIndex - 1) return

    // move DOWN only if target is NOT the task directly above
    if (!newStatus && edge === 'bottom' && 
        sourceIndex === targetIndex + 1) return

    let prevPos, nextPos

    if (edge === 'top') {
      prevPos = sortedList[targetIndex - 1]?.position ?? null
      nextPos = sortedList[targetIndex].position
    } else {
      prevPos = sortedList[targetIndex].position
      nextPos = sortedList[targetIndex + 1]?.position ?? null
    }

    const newPosition = getNewPosition(prevPos, nextPos)

    await reorderTask({
      taskId: source.id,
      parentId,
      newPosition,
      newStatus
    })
  }, [reorderTask])

  return handleReorder
}
