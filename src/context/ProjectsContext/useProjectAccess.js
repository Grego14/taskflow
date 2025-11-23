import useUser from '@hooks/useUser'
import { useEffect, useState } from 'react'

import { db } from '@/firebase/firebase-config'
import { doc, onSnapshot } from 'firebase/firestore'

/**
 * Hook to determine the current project's access status and data.
 * @param {object} props
 * @param {string} props.projectId - The ID of the current project.
 * @param {object} props.projects - List of all projects.
 */
export default function useProjectAccess({ projectId, owner }) {
  const { userLoaded, uid } = useUser()

  const [hasAccess, setHasAccess] = useState(true)
  const [validating, setValidating] = useState(true)
  const [projectData, setProjectData] = useState(null)

  // Determine access and validation status
  useEffect(() => {
    let unsubscribe
    ;(() => {
      // If we are still loading, or don't have the projects yet, exit.
      if (!userLoaded || !owner || !projectId) return

      const projectRef = doc(db, 'users', owner, 'projects', projectId)

      unsubscribe = onSnapshot(projectRef, snap => {
        const project = snap.data()

        if (snap.exists()) {
          setProjectData(project)

          // Check if the user is a member
          setHasAccess(project.members?.includes?.(uid))
        } else {
          setProjectData(null)
          setHasAccess(false)
        }

        // Once all data checks are complete, we finish the validation.
        setValidating(false)
      })
    })()

    return () => unsubscribe?.()
  }, [projectId, uid, userLoaded, owner])

  return {
    validating,
    hasAccess,
    projectData
  }
}
