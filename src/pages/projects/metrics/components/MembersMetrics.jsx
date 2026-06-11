import CircleLoader from '@components/reusable/loaders/CircleLoader'
import MemberStatCard from './MemberStatCard'
import Box from '@mui/material/Box'

import useProjectMembers from '@context/ProjectsContext/useProjectMembers'
import useProjectMetrics from '@hooks/useProjectMetrics'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

export default function MembersMetrics() {
  const { uid } = useUser()
  const { t } = useTranslation('metrics')
  const { membersMetrics } = useProjectMetrics()

  const { loading, projectMembersError, projectMembers } = useProjectMembers(
    membersMetrics?.map(member => member.id) || [], 
    true)

  if (loading) return <CircleLoader text={t('loadingMembers')} />

  return (
    <div className='members-metrics-container'>
      {membersMetrics.map((metrics) => {
        const memberInfo = projectMembers.find(m => m.id === metrics.id)

        return (
          <MemberStatCard
            key={metrics.id}
            member={memberInfo}
            metrics={metrics}
          />
        )
      })}
    </div>
  )
}
