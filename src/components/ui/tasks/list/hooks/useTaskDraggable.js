import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useEffect, useState } from 'preact/hooks'
import getTaskRef from '@utils/tasks/getTaskRef'
import useTasks from '@hooks/useTasks'
import useLayout from '@hooks/useLayout'

export default function useTaskDraggable({ data, isArchived, type = 'task', extraData = {} }) {
  const { taskRefs } = useTasks()
  const { id, position } = data
  const { filter } = useLayout()

  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const element = getTaskRef(taskRefs, id)

    // do not allow task reorder on non-default filters
    if (!element || isArchived || filter !== 'default') return

    return draggable({
      element,
      // we pass the type to distinguish between task and 
      // subtask in the dropTarget
      getInitialData: () => ({
        id,
        position,
        type,
        ...extraData
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false)
    })
  }, [isArchived, id, position])

  return { isDragging }
}
