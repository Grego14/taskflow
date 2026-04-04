import { useEffect } from 'preact/hooks'
import useTasks from '@hooks/useTasks'
import { isWorking, activeTaskData } from '@stores/task'

export default function useFocusSession() {
  const { actions } = useTasks()

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isWorking.value) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isWorking.value])

  // automatically save the working time every 15 seconds
  useEffect(() => {
    const task = activeTaskData.value

    if (!isWorking.value || !task) return

    const interval = setInterval(() => {
      const { startTime, initialSeconds, id, subtask } = task || {}

      actions.saveWorkingTime({
        id,
        parent: subtask,
        startTime,
        initialSeconds
      })
    }, 15000)

    return () => clearInterval(interval)
  }, [isWorking.value, activeTaskData.value])
}
