import { useCallback, useState } from 'react'

import getTaskMetadata from '@utils/tasks/getTaskMetadata'

export default function useContextMenu({ isArchived, tasks }) {
  const [contextMenu, setContextMenu] = useState(null)

  const handler = useCallback((e, taskId) => {
    if (isArchived) return

    // hide the context menu
    if (e === null) return setContextMenu(null)

    e.preventDefault()

    let taskData = Array.isArray(tasks)
      ? tasks?.find(task => task.id === taskId)
      : null

    // update taskData with the subtask data if the task is a subtask
    for (const subtasks of tasks.map(task => task.subtasks)) {
      const subtaskData = subtasks.find(subtask => subtask?.id === taskId)
      taskData ??= subtaskData
    }

    if (!taskData) return

    setContextMenu(prev =>
      prev === null
        ? {
          mouseX: e.clientX + 2,
          mouseY: e.clientY - 6,
          actionsData: {
            id: taskData.id,
            isSubtask: !!taskData.subtask,
            subtask: taskData.subtask,
            members: taskData.assignedTo,
            rawDate: taskData.rawDate,
            priority: taskData.priority
          }
        }
        : null
    )

    // Prevent text selection lost after opening the context menu on Safari and Firefox
    const selection = document.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)

      setTimeout(() => {
        selection.addRange(range)
      })
    }
  },
    [tasks, isArchived]
  )

  return [contextMenu, handler]
}
