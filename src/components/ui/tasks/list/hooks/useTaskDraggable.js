import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useEffect, useState } from 'preact/hooks'

export default function useTaskDraggable({ data, isArchived, type = 'task', extraData = {} }) {
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const element = data?.ref?.current
    if (!element || isArchived) return

    return draggable({
      element,
      // we pass the type to distinguish between task and 
      // subtask in the dropTarget
      getInitialData: () => ({
        id: data.id,
        position: data.position,
        type,
        ...extraData
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false)
    })
  }, [data?.ref, isArchived, data.id, data.position])

  return { isDragging }
}
