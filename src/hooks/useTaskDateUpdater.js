import { useState, useEffect, useCallback } from 'preact/hooks'
import useTasks from '@hooks/useTasks'

import { DATES } from '@/constants'
import getDateByKey from '@utils/tasks/getDateByKey'

export default function useTaskDateUpdater(initialRawDate) {
  const [date, setDate] = useState(initialRawDate)
  const { actions } = useTasks()

  // sync internal state if the prop changes externally
  useEffect(() => {
    setDate(initialRawDate)
  }, [initialRawDate])

  const updateDateHandler = useCallback(
    async (newDate, taskId, parentId = null) => {
      if (!DATES.includes(newDate)) return

      setDate(newDate)

      await actions.updateTask({
        id: taskId,
        subtask: parentId,
        data: { rawDate: newDate, dueDate: getDateByKey(newDate) }
      })
    }, [actions])

  return { date, setDate, updateDateHandler }
}
