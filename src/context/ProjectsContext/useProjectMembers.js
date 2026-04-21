import { useState, useEffect } from 'preact/hooks'
import projectService from '@services/project'

export default function useProjectMembers(members, enabled) {
  const [projectMembers, setProjectMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const membersKey = (members || []).join(',')

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
  }, [membersKey, enabled])

  return { loading, projectMembers, projectMembersError: error }
}
