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

    // get task data without subscription
    const getTaskData = (id) => taskRegistry.peek().get(id)?.peek()

    registry.updateTask = ({ id, data, parentId }) => {
      const snapshot = new Map(taskRegistry.peek())

      updateTaskLocal(id, data)

      if (data.status === 'done') playSound('complete')

      const updatePromise = import('@logic/tasks/update')

      return actionHandler(async () => {
        const { default: updateTaskAction } = await updatePromise

        return updateTaskAction({ 
          id, 
          data, 
          parentId, 
          isPreview, 
          ownerId, 
          projectId
        })
      }, snapshot)
    }

    registry.deleteTask = async ({ id, parentId, deleteSubtasks }) => {
      const snapshot = new Map(taskRegistry.peek())

      playSound('delete')
      const elements = getContainers(taskRefs, id)
      await animateOut(elements, 'delete')

      deleteTaskLocal(id, parentId, deleteSubtasks)

      return actionHandler(async () => {
        const { default: deleteTaskAction } = 
          await import('@logic/tasks/delete')

        return deleteTaskAction({ 
          id, 
          parentId, 
          deleteSubtasks, 
          isPreview, 
          ownerId, 
          projectId 
        })
      }, snapshot)
    }

    registry.createTask = ({ data, parentId }) => {
      const snapshot = new Map(taskRegistry.peek())
      const id = crypto.randomUUID()

      const parentData = parentId ? getTaskData(parentId) : null
      const listIds = parentId ? (parentData?.subtasks || []) : rootTaskIds.value

      const taskList = listIds.map(tid => getTaskData(tid)).filter(Boolean)
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
      }, snapshot)
    }

    registry.archiveTasks = async (taskIds) => {
      if(isPreview) return triggerUpsell('archive')

      const snapshot = new Map(taskRegistry.peek())
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
      }, snapshot)
    }

    registry.saveWorkingTime = ({ 
      id, 
      parentId, 
      startTime, 
      initialSeconds, 
      isFocusGuard
    }) => {
      const now = Date.now()
      const target = targetTime.value
      const currentTask = getTaskData(id)

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

    registry.toggleWorkingTask = (taskData = null) => {
      const active = activeTaskData.value

      if (active) {
        registry.saveWorkingTime({ 
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
          parentTitle = getTaskData(parentId)?.title
        }

        activeTaskData.value = {
          id, title, priority, parentId, parentTitle,
          startTime: Date.now(),
          initialSeconds: timeWorked || 0
        }
      }
    }

    registry.updateStatus = ({ id, nextStatus, parentId }) => {
      const taskData = getTaskData(id)

      if (!taskData) return

      const statusFields = resolveTaskStatusUpdate(
        taskData, 
        nextStatus, 
        ownerId, 
        isPreview
      )

      updateTaskLocal(id, statusFields)

      const sounds = { done: 'complete', cancelled: 'cancel' }
      playSound(sounds[nextStatus] || 'click')

      return registry.updateTask({ id, parentId, data: statusFields })
    }

    registry.resetSession = () => {
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

      registry.updateTask({
        id: active.id,
        parentId: active.parentId,
        data: { timeWorked: restoredTotal }
      })
    }

    registry.moveSubtasks = ({ taskId, subtaskIds }) => {
      const snapshot = new Map(taskRegistry.peek())
      const timestamp = Date.now()

      const list = rootTaskIds.value
      .map(id => getTaskData(id))
      .filter(t => t && !taskIsOverdue(t))

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
      }, snapshot)
    }

    registry.handleReorder = (source, targetId, edge, newStatus) => 
      actionHandler(() => handleReorderLogic(source, targetId, edge, newStatus))

    return registry
  }, [isPreview, ownerId, projectId])

  return actions
}
