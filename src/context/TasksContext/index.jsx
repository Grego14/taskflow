import { createRef, memo, useCallback, useEffect, useMemo } from 'react'

import Button from '@mui/material/Button'

// hooks
import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

// services
import mutations from './mutations.js'
import useProjectTasks from './useProjectTasks.js'

import lazyImport from '@utils/lazyImport'
import TasksContext from './context'

export default memo(function TasksProvider({ children }) {
  const { t } = useTranslation(['ui', 'common'])
  const { appNotification } = useApp()
  const {
    id: projectId,
    data,
    hasAccess,
    updateMetrics,
    metrics
  } = useProject()
  const {
    tasks: projectTasks,
    isLoading,
    error,
    deletedTaskData,
    setDeletedTaskData
  } = useProjectTasks({
    user: data?.createdBy,
    project: projectId,
    hasAccess
  })

  // actions shortcuts
  const user = data?.createdBy
  const project = projectId

  // we don't add refs to the subtasks because only parent tasks are going
  // to be able to be focused
  const tasks = useMemo(
    () =>
      Array.isArray(projectTasks)
        ? projectTasks.map(task => ({ ...task, ref: createRef() }))
        : null,
    [projectTasks]
  )

  const deleteTask = useMutation({
    mutationKey: ['deleteTask'],
    mutationFn: async ({ id, subtask, deleteSubtasks }) => {
      await mutations.deleteTask({
        user,
        project,
        task: id,
        subtask,
        deleteSubtasks
      })
    },
    onSuccess: (data, taskId, context) => {
      const undoTaskRemoval = async () => {
        const createTask = await lazyImport('/src/services/createTask')
        await createTask({
          user,
          project,
          data: deletedTaskData,
          isUndoingRemoval: true,
          subtask: deletedTaskData?.isSubtask
        })

        setDeletedTaskData(null)
      }

      appNotification({
        message: t('notifications.taskDeleted', { ns: 'ui' }),
        onClose: () => {
          setDeletedTaskData(null)
        },
        action: !deletedTaskData?.isSubtask ? (
          <Button
            sx={[theme => ({ ...theme.typography.body2 })]}
            onClick={undoTaskRemoval}>
            {t('undo', { ns: 'common' })}
          </Button>
        ) : null
      })
    },
    onError: err => console.error(err)
  })

  const updateTask = useMutation({
    mutationKey: ['updateTask'],
    mutationFn: async ({ id, data: mutationData, subtask }) => {
      await mutations.updateTask({
        user: data?.createdBy,
        project: projectId,
        task: id,
        data: mutationData,
        subtask
      })
    },
    onError: err => console.error(err)
  })

  // actions are the functions used on the Task menu
  const actions = useMemo(
    () => ({
      deleteTask: async props => deleteTask.mutate(props),
      updateTask: async props => updateTask.mutate(props)
    }),
    [deleteTask.mutate, updateTask.mutate]
  )

  const scrollIntoTask = useCallback(
    e => {
      const target =
        e.target.dataset?.parenttask ||
        e.target?.closest('[data-parenttask]')?.dataset?.parenttask

      if (!target) return

      const task = tasks?.find(task => task.id === target)
      const element = task?.ref?.current

      if (!element) return

      element.scrollIntoView({ behavior: 'smooth' })
    },
    [tasks]
  )

  useEffect(() => {
    const isNotCancelled = status => status !== 'cancelled'

    const pendingSubtasks = projectTasks
      ?.flatMap(task => task.subtasks)
      ?.filter(task => isNotCancelled(task.status))

    const pendingTasks = projectTasks?.filter(task =>
      isNotCancelled(task.status)
    )

    const totalTasks =
      (pendingSubtasks?.length || 0) + (pendingTasks?.length || 0)

    const completedTasks = pendingTasks?.filter(task => task.status === 'done')
    const completedSubtasks = pendingSubtasks?.filter(
      task => task.status === 'done'
    )
    const totalCompletedTasks =
      (completedSubtasks?.length || 0) + (completedTasks?.length || 0)

    updateMetrics(prev => {
      if (
        prev?.totalTasks !== totalTasks ||
        prev?.totalCompletedTasks !== totalCompletedTasks
      ) {
        return {
          ...prev,
          totalTasks,
          totalCompletedTasks
        }
      }

      return prev
    })
  }, [projectTasks, updateMetrics])

  const value = useMemo(
    () => ({
      tasks,
      actions,
      error,
      loading: isLoading,
      scrollIntoTask
    }),
    [actions, error, isLoading, tasks, scrollIntoTask]
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
})
