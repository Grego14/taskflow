import { useEffect, useCallback } from 'preact/hooks'
import useTasks from '@hooks/useTasks'

import { 
  dropTargetForElements, 
  monitorForElements,
  draggable
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
  extractClosestEdge,
  attachClosestEdge
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import getFirstPosition from '@utils/tasks/getFirstPosition'

import { activeDropIndicator, taskRegistry } from '@stores/task'

export default function useTasksDnDManager(containerRef, dropId) {
  const { actions } = useTasks()

  const handleMoveTask = useCallback(({ source }) => {
    const { id, isOverdue } = source?.data || {}
    if (!id || !isOverdue) return

    const activeTasks = []
    for (const task of taskRegistry.value.values()) {
      if(!taskIsOverdue(task)) activeTasks.push(task)
    }

    const position = getFirstPosition(activeTasks)

    // get today's midnight date
    const date = new Date()
    date.setDate(date.getDate() + 1)
    date.setHours(0, 0, 0, 0)

    actions.updateTask({
      id,
      data: {
        dueDate: date.toISOString(),
        rawDate: 'today',
        position
      }
    })
  }, [])

  useEffect(() => {
    const containerElement = containerRef.current
    if (!containerElement) return

    const cleanupDrop = dropTargetForElements({
      element: containerElement,
      getData: () => ({ dropId })
    })

    const cleanupMonitor = monitorForElements({
      onDragStart: ({ source }) => {
        activeDropIndicator.value = { 
          ...activeDropIndicator.value, 
          sourceId: source.data.id
        }
      },
      onDrag({ location, source }) {
        const destination = location.current.dropTargets[0]
        if (!destination?.data || !source?.data) return

        const sourceId = source.data?.id
        const targetId = destination.data?.id

        // can't throw a task inside a subtask...
        const sameType = source.data?.type === destination.data?.type

        // reset the values if the task is the same or the tasks aren't the 
        // same type so we avoid indicator bugs
        if (sourceId === targetId || !sameType) {

          // avoid updates if the main value is null
          if(activeDropIndicator.value.targetId){
            activeDropIndicator.value = { 
              sourceId: null, 
              targetId: null, 
              edge: null 
            }
          }

          return
        }

        const edge = extractClosestEdge(destination.data)

        // only update signal if something actually changed
        if (activeDropIndicator.value.targetId !== targetId || 
          activeDropIndicator.value.edge !== edge
        ) {
          activeDropIndicator.value = { sourceId, targetId, edge }
        }
      },

      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0]
        if (!destination?.data || !source?.data) return

        const sourceData = source.data
        const targetData = destination.data

        // reassign overdue task to today
        if (targetData.dropId === dropId && sourceData.isOverdue) {
          handleMoveTask({ source })
          return
        }

        // reorder task/subtasks
        if (
          sourceData.type === targetData.type && 
          sourceData.id !== targetData.id
        ) {
          const edge = extractClosestEdge(targetData)

          // reset indicator state
          activeDropIndicator.value = {
            sourceId: null, 
            targetId: null, 
            edge: null 
          }

          actions.handleReorder(sourceData, targetData.id, edge)
        }
      }
    })

    const registerElement = (element) => {
      const id = element.getAttribute('data-task-id')
      const type = element.getAttribute('data-type')
      const parentId = element.getAttribute('data-parent-id')
      const isOverdue = element.getAttribute('data-is-overdue') === 'true'

      return combine(
        draggable({
          element,
          getInitialData: () => ({ id, type, isOverdue, parentId })
        }),
        dropTargetForElements({
          element,
          getData: ({ input, element }) => 
            attachClosestEdge({ id, type, parentId }, {
              input,
              element,
              allowedEdges: ['top', 'bottom']
            })
        })
      )
    }

    const taskElements = containerElement.querySelectorAll('[data-task-id]')
    const elementCleanups = new Map()

    for (const taskEl of taskElements) {
      const id = taskEl.getAttribute('data-task-id')
      elementCleanups.set(id, registerElement(taskEl))
    }

    // manage new tasks and task deletions
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {

        // added
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            const taskEl = node.hasAttribute('data-task-id') 
              ? node 
              : node.querySelector('[data-task-id]')

            if (taskEl) {
              const id = taskEl.getAttribute('data-task-id')

              if (!elementCleanups.has(id)) 
                elementCleanups.set(id, registerElement(taskEl))
            }
          }
        }

        // deleted
        for (const node of mutation.removedNodes) {
          if (node instanceof HTMLElement) {
            const taskEl = node.hasAttribute('data-task-id') 
              ? node 
              : node.querySelector('[data-task-id]')

            if (taskEl) {
              const id = taskEl.getAttribute('data-task-id')

              elementCleanups.get(id)?.()
              elementCleanups.delete(id)
            }
          }
        }
      }
    })

    observer.observe(containerElement, { childList: true, subtree: true })

    return () => {
      cleanupDrop()
      cleanupMonitor()
      observer.disconnect()
      elementCleanups.forEach(cleanup => cleanup())
    }
  }, [handleMoveTask, actions.handleReorder, dropId])
}
