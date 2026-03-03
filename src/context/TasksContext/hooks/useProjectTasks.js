import useAuth from '@hooks/useAuth'
import taskService from '@services/task'
import { useEffect, useState } from 'react'

export default function useProjectTasks({ user, project, hasAccess }) {
  const { isOffline } = useAuth()
  const [tasks, setTasks] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deletedTaskData, setDeletedTaskData] = useState(null)

  useEffect(() => {
    if (!hasAccess || isOffline || !user || !project) return

    const unsubscribe = taskService.subscribeToProjectTasks({
      user,
      project,
      onError: (err) => setError(err),
      onUpdate: (data) => {
        setTasks(data || [])
        setIsLoading(false)
      },
      onChange: (type, changes) => {
        for (const change of changes) {
          // if a task is removed, we store it to allow "Undo"
          if (change.type === 'removed') {
            setDeletedTaskData(change.doc.data())
          }
        }
      }
    })

    return () => unsubscribe?.()
  }, [user, project, hasAccess, isOffline])

  return { error, isLoading, tasks, deletedTaskData, setDeletedTaskData }
}
