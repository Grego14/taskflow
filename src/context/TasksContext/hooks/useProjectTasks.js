import useAuth from '@hooks/useAuth'
import subscribeToProjectTasks from '@services/task/subscribeToProjectTasks'

import { useEffect, useState, useCallback } from 'preact/hooks'
import { signal } from '@preact/signals'

import { taskRegistry } from '@stores/task'
import sortTasks from '@utils/tasks/sortTasks'

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
      onUpdate: (flatData) => {
        const currentMap = taskRegistry.peek()
        const newMap = new Map()
        let hasRegistryChanged = false

        for (const task of flatData) {
          const existingSignal = currentMap.get(task.id)
          const normalizedTask = { ...task, subtasks: [] }

          if (existingSignal) {
            const stgExisting = JSON.stringify(existingSignal.peek())
            const stgTask = JSON.stringify(normalizedTask)

            if (stgExisting !== stgTask) {
              existingSignal.value = normalizedTask

              // no need to update hasRegistryChanged because the internal
              // signal already trigger the subscriptors
            }

            newMap.set(task.id, existingSignal)
          } else {
            newMap.set(task.id, signal(normalizedTask))
            hasRegistryChanged = true
          }
        }

        if (currentMap.size !== newMap.size) { hasRegistryChanged = true }

        // add the subtasks to their respective parent
        for (const task of flatData) {
          if (task.parentId && newMap.has(task.parentId)) {
            const parentSignal = newMap.get(task.parentId)
            const parentData = parentSignal.peek()

            // add the id to the parent subtasks array
            if (!parentData.subtasks.includes(task.id)) {
              parentData.subtasks.push(task.id)
            }
          }
        }

        // last sort (only for affected parents)
        for (const [id, tSignal] of newMap) {
          const data = tSignal.peek()

          if (data.subtasks.length > 0) {
            const subtaskObjects = data.subtasks
            .map(sid => newMap.get(sid)?.peek())
            .filter(Boolean)

            const sortedIds = sortTasks(subtaskObjects).map(t => t.id)

            // only update if the subtasks ids order changed
            if (JSON.stringify(data.subtasks) !== JSON.stringify(sortedIds)) {
              tSignal.value = { ...data, subtasks: sortedIds }
            }
          }
        }

        if (hasRegistryChanged) { taskRegistry.value = newMap }

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
