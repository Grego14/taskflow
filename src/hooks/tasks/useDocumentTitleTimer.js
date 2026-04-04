import { useEffect, useRef } from 'preact/hooks'
import formatTimer from '@utils/formatTimer'
import { globalClock, activeTaskData, isWorking } from '@stores/task'

export default function useDocumentTitleTimer() {
  const originalTitle = useRef(document.title)

  useEffect(() => {
    // reset the title when the user stops working
    if (!isWorking.value || !activeTaskData.value) {
      document.title = originalTitle.current
      return
    }

    const elapsed = Math.floor((globalClock.value - activeTaskData.value.startTime) / 1000)
    const time = formatTimer(activeTaskData.value.initialSeconds + elapsed)
    const taskTitle = activeTaskData.value.title

    document.title = `${time} - ${taskTitle}`

    return () => {
      document.title = originalTitle.current
    }
  }, [globalClock.value, isWorking.value])
}
