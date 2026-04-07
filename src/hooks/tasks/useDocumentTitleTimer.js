import { useEffect, useRef } from 'preact/hooks'
import formatTimer from '@utils/formatTimer'
import { 
  globalClock, 
  activeTaskData, 
  isWorking, 
  targetTime,
  pomoStart,
  isAlarmRinging,
  currentSessionSeconds
} from '@stores/task'

export default function useDocumentTitleTimer() {
  const originalTitle = useRef(document.title)
  const task = activeTaskData.value
  const pomo = pomoStart.value

  useEffect(() => {
    // reset the title when the user stops working
    if (!isWorking.value || !task) {
      document.title = originalTitle.current
      return
    }

    let time = formatTimer(currentSessionSeconds)
    const taskTitle = task.title

    document.title = `• ${time} - ${taskTitle}`

    return () => {
      document.title = originalTitle.current
    }
  }, [globalClock.value, isWorking.value])
}
