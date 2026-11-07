import useTasks from '@hooks/useTasks'
import { activeTaskData, showOverlay } from '@stores/task'
import { useEffect } from 'preact/hooks'

export default function useFocusShortcuts() {
  const { toggleWorkingTask } = useTasks()

  useEffect(() => {
    const handleKeyDown = e => {
      const isTyping =
        ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) ||
        document.activeElement.isContentEditable

      const isButton = document.activeElement.tagName === 'BUTTON'
      const isSpace = e.code === 'Space'

      // do not allow the use of the space key if the user is focusing a button
      if (isTyping || (isButton && isSpace)) return

      if (isSpace) {
        e.preventDefault()
        toggleWorkingTask(activeTaskData.value)
      }

      if (e.code === 'Escape' && showOverlay.value) {
        showOverlay.value = false
      }

      if (e.ctrlKey && e.code === 'KeyZ') {
        showOverlay.value = !showOverlay.value
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleWorkingTask])
}
