import { createRef, memo, useMemo } from 'react'
import useProject from '@hooks/useProject'

import useProjectTasks from './hooks/useProjectTasks'
import useTaskAnimations from './hooks/useTaskAnimations'
import useTaskMutations from './hooks/useTaskMutations'
import useTaskReorder from './hooks/useTaskReorder'
import useTaskMetrics from './hooks/useTaskMetrics'

import taskService from '@services/task'
import TasksContext from './context'
import playSound from '@services/audio'

import getFirstPosition from '@utils/tasks/getFirstPosition'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'

export default memo(function TasksProvider({ children }) {
  const { id: projectId, data: projectData, hasAccess } = useProject()

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

  const tasksWithRefs = useMemo(() => {
    if (!Array.isArray(projectTasks)) return null

    return projectTasks.map(task => ({
      ...task,
      ref: createRef(),
      // map subtasks to add their own refs
      subtasks: Array.isArray(task.subtasks)
        ? task.subtasks.map(subtask => ({
          ...subtask,
          ref: createRef()
        }))
        : []
    }))
  }, [projectTasks])

  const { animateOut } = useTaskAnimations(tasksWithRefs)

  const { deleteTaskMutation, updateTaskMutation } =
    useTaskMutations({
      deletedTaskData,
      setDeletedTaskData
    })

  const handleReorder = useTaskReorder({
    tasks: tasksWithRefs,
    updateTask: updateTaskMutation.mutate
  })

  // logic hook
  useTaskMetrics(projectTasks)

  // --- Actions ---

  const actions = useMemo(() => ({
    createTask: async (values) => {
      const { subtaskId, data } = values

      // get the correct list to find the current top task/subtask
      const list = subtaskId
        ? tasksWithRefs.find(t => t.id === subtaskId)?.subtasks
        : tasksWithRefs.filter(t => !taskIsOverdue(t))

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

    handleReorder
  }), [
    deleteTaskMutation,
    updateTaskMutation,
    animateOut,
    ownerId,
    projectId,
    handleReorder
  ])

  const value = useMemo(() => ({
    tasks: tasksWithRefs,
    actions,
    error,
    loading: isLoading,
    scrollIntoTask: (e) => {
      const target = e.target.dataset?.parenttask
        || e.target?.closest('[data-parenttask]')?.dataset?.parenttask

      if (!target) return

      const task = tasksWithRefs?.find(t => t.id === target)
      task?.ref?.current?.scrollIntoView({ behavior: 'smooth' })
    },
    getTaskData: (target, isSubtask) => {
      if (!tasksWithRefs) return null

      if (!isSubtask) {
        return tasksWithRefs.find(t => t.id === target) || null
      }

      for (const task of tasksWithRefs) {
        if (Array.isArray(task.subtasks)) {
          const subtask = task.subtasks.find(s => s.id === target)
          if (subtask) return subtask
        }
      }

      return null
    }
  }), [actions, error, isLoading, tasksWithRefs])

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
})
