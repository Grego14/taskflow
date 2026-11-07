import {
  activeTaskData,
  currentSessionSeconds,
  globalClock,
  isAlarmRinging,
  isWorking,
  pomoStart,
  targetTime
} from '@stores/task'
import formatTimer from '@utils/formatTimer'
import { useEffect, useRef } from 'preact/hooks'

export default function useDocumentTitleTimer() {
  const originalTitle = useRef(document.title)
  const task = activeTaskData.value
  const pomo = pomoStart.value

  useEffect(() => {
    // reset the title when the user stops working
    if (!isWorking.value || !task?.title) {
      document.title = originalTitle.current
      return
    }

    const time = formatTimer(currentSessionSeconds)
    const taskTitle = task.title

    document.title = `• ${time} - ${taskTitle}`

    return () => {
      document.title = originalTitle.current
    }
  }, [task.title])
}
