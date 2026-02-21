import { Suspense, lazy, useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ProjectMember from './ProjectMember'
import ProjectMemberSkeleton from './ProjectMemberSkeleton'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

import projectService from '@services/project'
import taskService from '@services/task'
import { dbAdapter } from '@services/dbAdapter'
import notificationService from '@services/notification'

const KickMemberDialog = lazy(() => import('@components/reusable/dialogs/kickMember/KickMemberDialog'))

export default function ProjectMembers() {
  const { uid, profile } = useUser()
  const { appNotification } = useApp()
  const { t } = useTranslation('projects')
  const { projectMembers, data, update } = useProject()

  const [open, setOpen] = useState(false)
  const [memberId, setMemberId] = useState(null)

  const isOwner = data?.createdBy === uid
  const isArchived = data?.isArchived

  const handleOpenDialog = (e) => {
    const id = e.currentTarget?.dataset?.memberId

    if (!projectMembers.some(m => m.id === id)) return

    setMemberId(id)
    setOpen(true)
  }

  const removeMember = async () => {
    try {
      await taskService.removeUserAssignments(memberId, data.createdBy, data.id)
      await update({ members: dbAdapter.removeFromArray(memberId) })

      await notificationService.sendKicked(memberId, profile.username, data.name)

      appNotification({ message: t('notifications.memberKicked') })
      setOpen(false)
    } catch (err) {
      console.error('removeMember', err.message)
      appNotification({ message: t('errors.kickFailed'), status: 'error' })
    }
  }

  const selectedMember = projectMembers?.find(m => m.id === memberId)

  return (
    <Box>
      <Typography variant='body2' color='textSecondary' sx={{ mb: 1 }}>
        {t('settings.membersLabel')}
      </Typography>

      {Array.isArray(projectMembers) ? (
        projectMembers.map(pMember => (
          pMember?.id && (
            <ProjectMember
              key={pMember.id}
              data={pMember}
              isOwner={isOwner}
              isArchived={isArchived}
              isUser={pMember.id === uid}
              removeMember={handleOpenDialog}
              owner={data?.createdBy}
            />
          )
        ))
      ) : (
        data?.members?.map(mId => <ProjectMemberSkeleton key={mId} />)
      )}

      {open && (
        <Suspense fallback={null}>
          <KickMemberDialog
            open={open}
            onClose={() => setOpen(false)}
            onAccept={removeMember}
            username={selectedMember?.username}
          />
        </Suspense>
      )}
    </Box>
  )
}
