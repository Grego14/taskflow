import { createRef, memo, useMemo, useRef } from 'preact/compat'

import useProject from '@hooks/useProject'
import useProjectTasks from './hooks/useProjectTasks'
import useTaskAnimations from './hooks/useTaskAnimations'
import useTaskMutations from './hooks/useTaskMutations'
import useUser from '@hooks/useUser'

import useTaskReorder from '@hooks/tasks/useTaskReorder'
import useTaskMetrics from '@hooks/tasks/useTaskMetrics'

import taskService from '@services/task'
import playSound from '@services/audio'

import getFirstPosition from '@utils/tasks/getFirstPosition'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import resolveTaskStatusUpdate from '@utils/tasks/taskStatusResolver'

import TasksBaseProvider from './TaskBaseProvider'

export default memo(function TasksProvider({ children }) {
  const {
    id: projectId,
    data: projectData,
    hasAccess,
    isArchived
  } = useProject()
  const { uid } = useUser()

  const {
    tasks: projectTasks,
    isLoading,
    error,
    deletedTaskData,
    setDeletedTaskData
  } = useProjectTasks({
    user: projectData?.createdBy,
    project: projectId,
    hasAccess
  })

  const ownerId = projectData?.createdBy
  const taskRefs = useRef({}) // { [taskId]: DOMElement }

  const scrollIntoTask = (taskId) => {
    const element = taskRefs.current[taskId]

    if (element) element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  const { animateOut } = useTaskAnimations(projectTasks, taskRefs)

  const { deleteTaskMutation, updateTaskMutation } =
    useTaskMutations({
      deletedTaskData,
      setDeletedTaskData
    })

  const handleReorder = useTaskReorder({
    tasks: projectTasks,
    updateTask: updateTaskMutation.mutate
  })

  // logic hook
  useTaskMetrics()

  // --- Actions ---

  const actions = useMemo(() => ({
    createTask: async (values) => {
      const { subtaskId, data } = values

      // get the correct list to find the current top task/subtask
      const list = subtaskId
        ? projectTasks.find(t => t.id === subtaskId)?.subtasks
        : projectTasks.filter(t => !taskIsOverdue(t))

      const position = getFirstPosition(list)

      return await taskService.createTask({
        ownerId,
        projectId,
        subtaskId,
        data: { ...data, position }
      })
    },

    updateTask: async props => {
      await updateTaskMutation.mutate(props)
      if (props.data?.status === 'done') playSound('complete')
    },

    deleteTask: async (props) => {
      const { id } = props

      // animate only if the task isn't a subtask
      await animateOut([id], 'delete')

      deleteTaskMutation.mutate(props)
      playSound('delete')
    },

    archiveTasks: async (taskIds) => {
      playSound('archive')
      await animateOut(taskIds, 'archive')
      await taskService.archiveTasks({
        ownerId,
        projectId,
        taskIds
      })
    },

    handleReorder,

    updateStatus: async ({ id, subtask, nextStatus }) => {
      if (isArchived) return

      let taskData = projectTasks.find(task => task.id === id)

      if (!taskData) {
        // look up if the task is a subtask
        for (const task of projectTasks) {
          const subtask = task.subtasks?.find(subtask => subtask.id === id)

          if (subtask) {
            taskData = subtask
            break
          }
        }
      }

      if (!taskData) return

      const statusFields = resolveTaskStatusUpdate(taskData, nextStatus)

      const finalData = {
        ...statusFields,
        completedBy: nextStatus === 'done' ? uid : null,
        cancelledBy: nextStatus === 'cancelled' ? uid : null
      }

      await updateTaskMutation.mutate({
        id,
        subtask,
        data: finalData
      })

      if (nextStatus === 'done') playSound('complete')
    },

    moveSubtasks: async ({ taskId, subtasks }) => {
      const list = projectTasks.filter(t => !taskIsOverdue(t))
      const position = getFirstPosition(list)

      await taskService.moveSubtasks({
        user: ownerId,
        project: projectId,
        task: taskId,
        subtasks,
        position
      })
    }
  }), [
    deleteTaskMutation,
    updateTaskMutation,
    animateOut,
    ownerId,
    projectId,
    handleReorder,
    projectTasks
  ])

  return (
    <TasksBaseProvider
      tasks={projectTasks}
      actions={actions}
      loading={isLoading}
      error={error}>
      {children}
    </TasksBaseProvider>
  )
})
