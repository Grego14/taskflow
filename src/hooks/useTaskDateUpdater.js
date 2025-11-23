import { DATES } from '@/constants'
import useTasks from '@hooks/useTasks'
import getDateByKey from '@utils/tasks/getDateByKey'
import { useState } from 'react'

/**
 * Hook to handle updating the date of a task or subtask.
 * @param {string} initialRawDate - The initial raw date string.
 * @returns {{
 * date: string,
 * updateDateHandler: (newDate: string, taskId: string, subtaskId: string|null) => Promise<void>
 * }}
 */
export default function useTaskDateUpdater(initialRawDate) {
  const [date, setDate] = useState(initialRawDate)
  const { actions } = useTasks()

  const updateDateHandler = async (newDate, taskId, parentId = null) => {
    if (!DATES.includes(newDate)) {
      console.error(`Invalid date: ${newDate}`)
      return
    }

    setDate(newDate)

    const isSubtask = !!parentId

    await actions.updateTask({
      id: isSubtask ? parentId : taskId, // If it's a subtask, the id is subtaskId (the parent)
      subtask: isSubtask ? taskId : null, // If it's a subtask, the id is taskId (the child)
      data: { rawDate: newDate, dueDate: getDateByKey(newDate) }
    })
  }

  return { date, setDate, updateDateHandler }
}
