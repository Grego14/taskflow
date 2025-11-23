import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

// utils
import { QUERY_STALE_TIME } from '@/constants'

import getProjectMembers from '@querys/getProjectMembers'

export default function useProjectMembers({
  members,
  projectsFetched,
  hasAccess
}) {
  const [projectMembers, setProjectMembers] = useState(null)

  const {
    data: queryProjectMembers,
    error: projectMembersError,
    isLoading
  } = useQuery({
    queryKey: ['projectMembers', { members }],
    queryFn: getProjectMembers,
    staleTime: QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
    enabled: members.length > 0 && !!projectsFetched && hasAccess
  })

  useEffect(() => {
    if (queryProjectMembers) setProjectMembers(queryProjectMembers)
  }, [queryProjectMembers])

  return {
    loading: isLoading,
    projectMembers,
    projectMembersError
  }
}
