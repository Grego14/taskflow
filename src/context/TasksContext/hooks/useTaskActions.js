import { useCallback, useMemo } from 'preact/hooks'

import { playSound } from '@services/audio'
import getContainers from '@utils/tasks/getContainers'
import resolveTaskStatusUpdate from '@utils/tasks/taskStatusResolver'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import getFirstPosition from '@utils/tasks/getFirstPosition'
import actionHandler from '@logic/tasks/actionHandler'
import prepareNewTask from '@logic/tasks/utils/prepareNewTask'

import useLayout from '@hooks/useLayout'
import useProject from '@hooks/useProject'
import useTaskAnimations from '@hooks/tasks/useTaskAnimations'
import useReorder from '@hooks/tasks/useTaskReorder'

import { 
  updateTaskLocal, 
  deleteTaskLocal, 
  createTaskLocal, 
  archiveTasksLocal,
  taskRegistry,
  activeTaskData,
  targetTime,
  showOverlay,
  clearFocusGoals,
  currentMinutes,
  pomoStart,
  showResetPrompt,
  rootTaskIds,
  moveSubtasksLocal,
  reorderTaskLocal
} from '@stores/task'

const calculateSessionUpdate = (task, sessionDuration, now, target) => {
  const sessionType = target > 0 ? 'goal' : 'manual'

  return {
    timeWorked: (task?.timeWorked || 0) + sessionDuration,
    sessions: [
      ...(task?.sessions || []),
      { duration: sessionDuration, date: now, type: sessionType }
    ]
  }
}

const findTaskById = (tasks, id, parentId) => {
  const parent = tasks.find(t => t.id === (parentId || id))

  if (!parentId) return parent

  return parent?.subtasks?.find(s => s.id === id)
}

const executeReorder = async (params, context) => {
  const { ownerId, projectId, isPreview } = context
  
  const { taskId, newPosition, newStatus } = params
  reorderTaskLocal(taskId, newPosition, newStatus)

  const { default: reorderLogic } = await import('@logic/tasks/reorder')
  return await reorderLogic({
    ...params,
    ownerId,
    projectId,
    isPreview
  })
}

export default function useTaskActions(taskRefs) {
  const { id: projectId, data: projectData } = useProject()
  const { triggerUpsell, isPreview } = useLayout()
  const ownerId = projectData?.createdBy

  const { animateOut } = useTaskAnimations()

  const onPositionCalculated = useCallback(async (params) => 
    await executeReorder(params, { ownerId, projectId, isPreview })
    ,[ownerId, projectId, isPreview])

  const handleReorderLogic = useReorder(onPositionCalculated)

  const actions = useMemo(() => {
    const registry = {}

    registry.updateTask = async ({ id, data, parentId }) => {
      const updatePromise = import('@logic/tasks/update')

      return actionHandler(async () => {
        updateTaskLocal(id, data)

        if (data.status === 'done') playSound('complete')

        const { default: updateTaskAction } = await updatePromise

        return updateTaskAction({ 
          id, 
          data, 
          parentId, 
          isPreview, 
          ownerId, 
          projectId
        })
      })
    }

    registry.deleteTask = async ({ id, parentId, deleteSubtasks }) => {
      playSound('delete')
      const elements = getContainers(taskRefs, id)
      await animateOut(elements, 'delete')

      deleteTaskLocal(id, parentId, deleteSubtasks)

      return actionHandler(async () => {
        const { default: deleteTaskAction } = await import('@logic/tasks/delete')
        return deleteTaskAction({ 
          id, 
          parentId, 
          deleteSubtasks, 
          isPreview, 
          ownerId, 
          projectId 
        })
      })
    }

    registry.createTask = async ({ data, parentId }) => {
      const id = crypto.randomUUID()

      const listIds = parentId 
        ? (taskRegistry.value.get(parentId)?.subtasks || [])
        : rootTaskIds.value

      const taskList = listIds.map(tid => taskRegistry.value.get(tid))

      const position = getFirstPosition(taskList)

      const newTask = prepareNewTask({ 
        data, 
        id, 
        position, 
        parentId, 
        ownerId, 
        projectId
      })

      createTaskLocal(newTask)
      // playSound('create')

      return actionHandler(async () => {
        const { default: createTaskAction } = 
          await import('@logic/tasks/create')

        return createTaskAction({
          task: newTask,
          isPreview,
          ownerId,
          projectId
        })
      })
    }

    registry.archiveTasks = async (taskIds) => {
      if(isPreview) return triggerUpsell('archive')

      const ids = Array.isArray(taskIds) ? taskIds : [taskIds]

      playSound('archive')
      const elements = getContainers(taskRefs, ids)
      await animateOut(elements, 'archive')

      archiveTasksLocal(ids)

      return actionHandler(async () => {
        const { default: archiveTasksAction } = 
          await import('@logic/tasks/archive')

        return archiveTasksAction({
          taskIds: ids,
          isPreview,
          ownerId,
          projectId
        })
      })
    }

    registry.saveWorkingTime = async ({ 
      id, 
      parentId, 
      startTime, 
      initialSeconds, 
      isFocusGuard
    }) => {
      const now = Date.now()
      const target = targetTime.value

      const currentTask = taskRegistry.value.get(id)
      if (!currentTask) return

      const endTime = target && (now > target) ? target : now
      const sessionDuration = Math.floor((endTime - startTime) / 1000)

      let updateData = { timeWorked: initialSeconds + sessionDuration }

      if (!isFocusGuard) {
        updateData = { 
          ...updateData, 
          ...calculateSessionUpdate(currentTask, sessionDuration, now, target) 
        }

        clearFocusGoals()
      }

      return registry.updateTask({ id, parentId, data: updateData })
    }

    registry.toggleWorkingTask = async (taskData = null) => {
      const active = activeTaskData.value

      if (active) {
        await registry.saveWorkingTime({ 
          id: active.id, 
          parentId: active.parentId, 
          startTime: active.startTime, 
          initialSeconds: active.initialSeconds 
        })

        if (!taskData?.id || active.id === taskData.id) {
          showOverlay.value = false
          activeTaskData.value = null
          return
        }
      }

      // activate work mode to a new task
      if (taskData?.id) {
        const { id, title, priority, parentId, timeWorked } = taskData
        let parentTitle = null
        showOverlay.value = true

        // get the parent task title if the task is a subtask
        if (parentId) {
          parentTitle = taskRegistry.value.get(parentId)?.title
        }

        activeTaskData.value = {
          id, title, priority, parentId, parentTitle,
          startTime: Date.now(),
          initialSeconds: timeWorked || 0
        }
      }
    }

    registry.updateStatus = async ({ id, nextStatus, parentId }) => {
      const taskData = taskRegistry.value.get(id)

      if (!taskData) return

      const statusFields = resolveTaskStatusUpdate(taskData, nextStatus, ownerId, isPreview)

      const sounds = { done: 'complete', cancelled: 'cancel' }
      playSound(sounds[nextStatus] || 'click')

      return registry.updateTask({ id, parentId, data: statusFields })
    }

    registry.resetSession = async () => {
      const active = activeTaskData.value
      if (!active) return

      const now = Date.now()
      const targetTask = taskRegistry.value.get(active.id)

      // calculate how much time has passed in the current session
      const sessionElapsed = Math.floor((now - active.startTime) / 1000)

      // get time to restore (that the Focus Guard added)
      const restoredTotal = Math.max(0, 
        (targetTask?.timeWorked || 0) - sessionElapsed)

      activeTaskData.value = { 
        ...active, 
        startTime: now, 
        initialSeconds: restoredTotal
      }
      pomoStart.value = now
      targetTime.value = now + (currentMinutes.value * 60 * 1000)
      showResetPrompt.value = false

      await registry.updateTask({
        id: active.id,
        parentId: active.parentId,
        data: { timeWorked: restoredTotal }
      })
    }

    registry.moveSubtasks = async ({ taskId, subtaskIds }) => {
      const timestamp = Date.now()

      const list = rootTaskIds.value
      .map(id => taskRegistry.value.get(id))
      .filter(t => !taskIsOverdue(t))

      const position = getFirstPosition(list)

      moveSubtasksLocal(taskId, subtaskIds, position, timestamp)

      return actionHandler(async () => {
        const { default: moveSubtasksLogic } = 
          await import('@logic/tasks/moveSubtasks')

        return moveSubtasksLogic({
          taskId,
          subtaskIds,
          isPreview,
          ownerId,
          projectId,
          position
        })
      })
    }

    registry.handleReorder = async (source, targetId, edge, newStatus) => 
      await actionHandler(async () => 
        await handleReorderLogic(source, targetId, edge, newStatus))

    return registry
  }, [isPreview, ownerId, projectId])

  return actions
}
