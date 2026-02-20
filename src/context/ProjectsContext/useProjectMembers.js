import { useQuery } from '@tanstack/react-query'
import { QUERY_STALE_TIME } from '@/constants'
import projectService from '@services/project'

export default function useProjectMembers({ members, enabled }) {
  const {
    data: projectMembers = [],
    error: projectMembersError,
    isLoading: loading
  } = useQuery({
    queryKey: ['projectMembers', members],
    queryFn: () => projectService.getProjectMembers(members),
    staleTime: QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    enabled: enabled && members?.length > 0
  })

  return {
    loading,
    projectMembers,
    projectMembersError
  }
}
