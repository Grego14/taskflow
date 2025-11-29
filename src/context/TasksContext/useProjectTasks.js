import useAuth from '@hooks/useAuth'
import useProject from '@hooks/useProject'
import getProjectTasks from '@querys/getProjectTasks'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

export default function useProjectTasks({ user, project, hasAccess }) {
  const { isOffline } = useAuth()
  const [tasks, setTasks] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deletedTaskData, setDeletedTaskData] = useState(null)
  const { data } = useProject()

  useEffect(() => {
    let unsubscribe = null
    ;(() => {
      if (!hasAccess || isOffline) return

      unsubscribe = getProjectTasks({
        user,
        project,
        onError: err => setError(err),
        onUpdate: tasks => {
          setTasks(tasks || [])
          setIsLoading(false)
        },
        onChange: (snapshot, changes) => {
          for (const change of changes) {
            // allow the user to undo the task removal
            if (change.type === 'removed') {
              setDeletedTaskData(change.doc.data())
              // console.log(change.doc.data())
            }
          }
        }
      })
    })()

    return () => unsubscribe?.()
  }, [user, project, hasAccess, isOffline])

  return { error, isLoading, tasks, deletedTaskData, setDeletedTaskData }
}
