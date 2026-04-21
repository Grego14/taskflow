import useAuth from '@hooks/useAuth'
import subscribeToProjectTasks from '@services/task/subscribeToProjectTasks'
import { useEffect, useState, useCallback } from 'preact/hooks'

import { taskRegistry } from '@stores/task'

export default function useProjectTasks(user, project, hasAccess) {
  const { isOffline } = useAuth()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [retryVersion, setRetryVersion] = useState(0)

  const retry = useCallback(() => {
    setError(null)
    setIsLoading(true)
    setRetryVersion(prev => prev + 1)
  }, [])

  useEffect(() => {
    if (!hasAccess || isOffline || !user || !project) {
      setIsLoading(false)
      return
    }

    const unsubscribe = subscribeToProjectTasks({
      user,
      project,
      onError: (err) => setError(err),
      onUpdate: (data) => {
        const newMap = new Map()

        for (const task of data) {
          newMap.set(task.id, task)
        }

        taskRegistry.value = newMap
        setIsLoading(false)
        setError(null)
      },
      onChange: null
      // onChange: (type, changes) => { }
    })

    return () => unsubscribe?.()
  }, [user, project, hasAccess, isOffline])

  return { error, isLoading, retry }
}
