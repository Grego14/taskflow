import { useState, useEffect, useCallback, useMemo } from 'preact/compat'
import useUser from '@hooks/useUser'

import useTaskReorder from '@hooks/tasks/useTaskReorder'

import TasksBaseProvider from '@context/TasksContext/TaskBaseProvider'
import ProjectContext from '@pages/projects/context'

import { getItem, setItem } from '@utils/storage'
import resolveTaskStatusUpdate from '@utils/tasks/taskStatusResolver'
import playSound from '@services/audio'
import getFirstPosition from '@utils/tasks/getFirstPosition'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'

export default function MockProvider({ children }) {
  const { uid } = useUser()
  const [data, setData] = useState(() => getItem('preview'))
  const project = data.projects[0]

  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    totalCompletedTasks: 0
  })

  // save user changes to the localStorage
  useEffect(() => {
    setItem('preview', data)
  }, [data])

  const updateTaskAction = useCallback(({ id, data: updateData }) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id ? {
          ...task, ...updateData,
          updatedAt: Date.now()
        } : task
      )
    }))
  }, [])

  // add the subtasks of the parents (data.tasks is a plain object)
  const tasks = useMemo(() => {
    if (!data?.tasks) return []

    const processedTasks = []
    const parents = data.tasks.filter(task => !task.subtask)

    return parents.map(task => {
      const subtasks = data.tasks.filter(sTask => sTask.subtask === task.id)
      return { ...task, subtasks }
    })
  }, [data?.tasks])

  const handleReorder = useTaskReorder({
    tasks,
    updateTask: updateTaskAction
  })

  const actions = useMemo(() => ({
    createTask: ({ data: taskData, subtaskId = null }) => {
      const timestamp = Date.now()

      const list = subtaskId
        ? tasks.filter(task => task.subtask === subtaskId)
        : tasks.filter(task => !task.subtask && !taskIsOverdue(task))

      const position = getFirstPosition(list)

      const newTask = {
        ...taskData,
        id: crypto.randomUUID(),
        position: taskData.position ?? position,
        createdAt: timestamp,
        updatedAt: timestamp,
        status: 'todo',
        projectOwner: uid,
        projectId: project.id,
        subtask: subtaskId
      }

      setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }))
      return newTask
    },

    updateTask: updateTaskAction,

    updateStatus: ({ id, subtask, nextStatus }) => {
      setData(prev => {
        const task = prev.tasks.find(task => task.id === id)
        if (!task) return prev

        const updatedFields = resolveTaskStatusUpdate(task, nextStatus)
        return {
          ...prev,
          tasks: prev.tasks.map(task => task.id === id
            ? { ...task, ...updatedFields } : task)
        }
      })

      if (nextStatus === 'done') playSound('complete')
    },

    deleteTask: ({ id, subtask, deleteSubtasks }) => {
      setData(prev => {
        if (subtask)
          return { ...prev, tasks: prev.tasks.filter(task => task.id !== id) }

        let newTasks = prev.tasks.filter(task => task.id !== id)
        if (deleteSubtasks) {
          newTasks = newTasks.filter(task => task.subtask !== id)
        }

        return { ...prev, tasks: newTasks }
      })
    },

    handleReorder,

    moveSubtasks: ({ taskId, subtasks }) => {
      const todayTasks = tasks.filter(task => !task.subtask
        && !taskIsOverdue(task))
      const position = getFirstPosition(todayTasks)

      setData(prev => {
        const subtaskIds = subtasks.map(subtask => subtask.id)

        // transform the subtasks and filter the parent task
        const updatedTasks = prev.tasks.reduce((acc, currentTask) => {
          // if is the parent task, ignore
          if (currentTask.id === taskId) return acc

          // if is a moving subtask
          if (subtaskIds.includes(currentTask.id)) {
            const { status, subtask, ...other } = currentTask

            acc.push({
              ...other,
              status: 'todo',
              subtask: null,
              position,
              updatedAt: Date.now()
            })
            return acc
          }

          // rest of tasks remain the same
          acc.push(currentTask)
          return acc
        }, [])

        return { ...prev, tasks: updatedTasks }
      })
    }
  }), [uid, project, updateTaskAction, handleReorder])

  const projectValue = useMemo(() => ({
    id: project.id,
    data: project,
    isArchived: false,
    isOwner: true,
    hasAccess: true,
    validating: false,
    loading: false,
    error: null,
    projectMembers: project.members,
    metrics,
    updateMetrics: setMetrics
  }), [project, metrics])

  return (
    <ProjectContext.Provider value={projectValue}>
      <TasksBaseProvider tasks={tasks} actions={actions}>
        {children}
      </TasksBaseProvider>
    </ProjectContext.Provider>
  )
}
