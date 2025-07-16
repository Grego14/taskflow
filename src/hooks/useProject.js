import { useEffect, useState } from 'react'
import { doc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/firebase-config.js'
import { useAuth } from '@/firebase/AuthContext'

export default function useProject(projectId) {
  const { currentUser } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get the project data and the tasks. Add snapshots to listen for changes.
  useEffect(() => {
    if (!currentUser?.uid || !projectId) return

    setLoading(true)

    const _ = [db, 'users', currentUser.uid, 'projects']

    const projectRef = doc(..._, projectId)
    const projectTasksCol = collection(..._, projectId, 'tasks')

    const unsubscribeProject = onSnapshot(
      projectRef,
      snap => {
        if (snap.exists()) {
          setProject(snap.data())
        } else {
          setError('Project not found')
        }

        setLoading(false)
      },
      err => {
        console.error('useProject project listener error: ', err)
        setError(err.message)
        setLoading(false)
      }
    )

    const unsubscribeProjectTasks = onSnapshot(
      projectTasksCol,
      snap => {
        if (!snap.empty) setTasks(snap.docs.map(task => task.data()))
        setLoading(false)
      },
      err => {
        console.error('useProject tasks listener error: ', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => {
      unsubscribeProject()
      unsubscribeProjectTasks()
    }
  }, [currentUser?.uid, projectId])

  return { project, tasks, loading, error }
}
