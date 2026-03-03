import { useEffect, useState } from 'preact/hooks'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import {
  attachClosestEdge,
  extractClosestEdge
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import getNeighbors from '@utils/tasks/getNeighbors'

export default function useTaskDropTarget({ data, list, type, onDrop }) {
  const [closestEdge, setClosestEdge] = useState(null)
  const [sourceData, setSourceData] = useState(null)

  const { prevTask, nextTask } = getNeighbors(list, data?.id)

  useEffect(() => {
    const el = data?.ref?.current
    if (!el) return

    return dropTargetForElements({
      element: el,
      getData: ({ input, element }) => {
        const baseData = { id: data.id, position: data.position, type }
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
        if (source.data.id !== data.id && source.data.type === type) {
          onDrop?.(source.data, data, edge)
        }
      }
    })
  }, [data, list, type])

  // only show indicator if types match and it's not the same position and task
  const isNotSelfAndSameMatch = sourceData?.type === type &&
    sourceData?.id !== data.id

  const isTopVisible = closestEdge === 'top' &&
    isNotSelfAndSameMatch &&
    sourceData?.id !== prevTask?.id

  const isBottomVisible = closestEdge === 'bottom' &&
    isNotSelfAndSameMatch &&
    sourceData?.id !== nextTask?.id

  return { isTopVisible, isBottomVisible }
}
