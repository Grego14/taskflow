import { useCallback } from 'preact/hooks'

import sortTasks from '@utils/tasks/sortTasks'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import getNewPosition from '@utils/tasks/getNewPosition'

export default function useReorder({ tasks, updateTask }) {
  const handleReorder = useCallback(async (source, taskId, edge) => {
    const isSubtask = source.type === 'subtask'
    const list = sortTasks(isSubtask
      ? tasks.find(t => t.id === source.parentId)?.subtasks
      : tasks.filter(t => !taskIsOverdue(t)))

    if (!list) return

    const taskIndex = list.findIndex(t => t.id === taskId)
    const sourceIndex = list.findIndex(t => t.id === source.id)

    if (taskIndex === -1 || sourceIndex === -1) return

    // try to drop a task on the TOP of the task that is ALREADY below it
    const isAlreadyTop = edge === 'top' && sourceIndex === taskIndex - 1

    // try to drop a task on the BOTTOM of the task that is ALREADY above it
    const isAlreadyBottom = edge === 'bottom' && sourceIndex === taskIndex + 1

    if (isAlreadyTop || isAlreadyBottom || source.id === taskId) return

    let prevPos, nextPos
    if (edge === 'top') {
      prevPos = list[taskIndex - 1]?.position ?? null
      nextPos = list[taskIndex].position
    } else {
      prevPos = list[taskIndex].position
      nextPos = list[taskIndex + 1]?.position ?? null
    }

    updateTask({
      id: source.id,
      subtask: isSubtask ? source.parentId : null,
      data: { position: getNewPosition(prevPos, nextPos) }
    })
  }, [tasks, updateTask])

  return handleReorder
}
