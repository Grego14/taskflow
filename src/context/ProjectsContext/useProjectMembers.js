import projectService from '@services/project'
import { useEffect, useState } from 'preact/hooks'

export default function useProjectMembers(members, enabled) {
  const [projectMembers, setProjectMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!enabled || !members?.length) return

    const fetchMembers = async () => {
      setLoading(true)

      try {
        const data = await projectService.getProjectMembers(members)
        setProjectMembers(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [enabled, members, members.length])

  return { loading, projectMembers, projectMembersError: error }
}
