import { useEffect, useState } from 'react'
import useUser from '@hooks/useUser'
import projectService from '@services/project'

export default function useProjectAccess({ projectId, owner }) {
  const { uid } = useUser()
  const [projectData, setProjectData] = useState(null)
  const [hasAccess, setHasAccess] = useState(true)
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    if (!owner || !projectId) return

    const unsubscribe = projectService.listenProject(owner, projectId, (data) => {
      if (data.exists) {
        setProjectData(data)
        setHasAccess(data.members?.includes(uid))
      } else {
        setProjectData(null)
        setHasAccess(false)
      }
      setValidating(false)
    })

    return () => unsubscribe()
  }, [projectId, uid, owner])

  return { validating, hasAccess, projectData }
}
