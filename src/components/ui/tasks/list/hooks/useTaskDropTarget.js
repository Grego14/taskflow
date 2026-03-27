import { useEffect, useState } from 'preact/hooks'

import getNeighbors from '@utils/tasks/getNeighbors'
import getTaskRef from '@utils/tasks/getTaskRef'
import useTasks from '@hooks/useTasks'

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import {
  attachClosestEdge,
  extractClosestEdge
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'

export default function useTaskDropTarget({ data, list, type, onDrop }) {
  const [closestEdge, setClosestEdge] = useState(null)
  const [sourceData, setSourceData] = useState(null)
  const { taskRefs } = useTasks()
  const { id, position } = data

  const { prevTask, nextTask } = getNeighbors(list, id)

  useEffect(() => {
    const el = getTaskRef(taskRefs, id)
    if (!el) return

    return dropTargetForElements({
      element: el,
      getData: ({ input, element }) => {
        const baseData = { id, position, type }
        return attachClosestEdge(baseData, {
          input,
          element,
          allowedEdges: ['top', 'bottom']
        })
      },
      onDragEnter: ({ source }) => setSourceData(source.data),
      onDrag: ({ self, source }) => {
        setSourceData(source.data)
        setClosestEdge(extractClosestEdge(self.data))
      },
      onDragLeave: () => {
        setClosestEdge(null)
        setSourceData(null)
      },
      onDrop: ({ source, self }) => {
        const edge = extractClosestEdge(self.data)
        setClosestEdge(null)
        setSourceData(null)
        if (source.data.id !== id && source.data.type === type) {
          onDrop?.(source.data, data, edge)
        }
      }
    })
  }, [data, list, type])

  // only show indicator if types match and it's not the same position and task
  const isNotSelfAndSameMatch = sourceData?.type === type &&
    sourceData?.id !== id

  const isTopVisible = closestEdge === 'top' &&
    isNotSelfAndSameMatch &&
    sourceData?.id !== prevTask?.id

  const isBottomVisible = closestEdge === 'bottom' &&
    isNotSelfAndSameMatch &&
    sourceData?.id !== nextTask?.id

  return { isTopVisible, isBottomVisible }
}
