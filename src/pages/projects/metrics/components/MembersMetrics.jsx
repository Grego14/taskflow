import CircleLoader from '@components/reusable/loaders/CircleLoader'
import Box from '@mui/material/Box'
import MemberMetric from './MemberMetric'

import useProjectMembers from '@context/ProjectsContext/useProjectMembers'
import useProjectMetrics from '@hooks/useProjectMetrics'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

const memberExists = (members, member) => {
  return !!members?.find(m => m.id === member)
}

export default function MembersMetrics() {
  const { uid } = useUser()
  const { t } = useTranslation('metrics')
  const { membersMetrics } = useProjectMetrics()

  const { loading, projectMembersError, projectMembers } = useProjectMembers({
    members: membersMetrics?.map(member => member.id) || [],
    projectsFetched: true,
    hasAccess: true
  })

  if (loading) return <CircleLoader text={t('loadingMembers')} />

  return (
    <Box className='flex flex-center' gap={4} flexWrap='wrap'>
      {projectMembers
        // show the user metric first
        ?.sort((a, b) => (a.id === uid ? 0 : 1))
        ?.map(member =>
          memberExists(membersMetrics, member.id) ? (
            <MemberMetric
              key={member.id}
              data={member}
              metric={membersMetrics?.find(
                metricMember => metricMember.id === member.id
              )}
            />
          ) : null
        )}
    </Box>
  )
}
