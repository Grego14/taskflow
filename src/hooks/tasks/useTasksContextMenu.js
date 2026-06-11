import { useCallback, useState } from 'preact/hooks'
import useProject from '@hooks/useProject'

export default function useTasksContextMenu() {
  const { isArchived } = useProject()
  const [contextMenu, setContextMenu] = useState(null)

  const handleContextMenu = useCallback((e) => {
    if (isArchived) return

    // hide the context menu
    if (e === null) return setContextMenu(null)

    // get the closest element with a task id
    const taskEl = e.target.closest('[data-task-id]')

    if (!taskEl) return

    e.preventDefault()

    const id = taskEl.getAttribute('data-task-id')

    setContextMenu({
      mouseX: e.clientX + 2,
      mouseY: e.clientY - 6,
      id
    })

    // prevent text selection lost after opening the context menu on Safari 
    // and Firefox
    const selection = document.getSelection()
    if (selection?.rangeCount > 0) {
      const range = selection.getRangeAt(0)

      setTimeout(() => {
        selection.removeAllRanges()
        selection.addRange(range)
      })
    }
  }, [isArchived])

  return [contextMenu, handleContextMenu]
}
