import { Suspense, lazy, useCallback, useState } from 'react'

import Link from '@components/reusable//Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ProjectMember from './ProjectMember'
import ProjectMemberSkeleton from './ProjectMemberSkeleton'

const KickMemberDialog = lazy(
  () => import('@components/reusable/dialogs/kickMember/KickMemberDialog')
)

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

import lazyImport from '@utils/lazyImport'
import { arrayRemove } from 'firebase/firestore'

export default function ProjectMembers() {
  const { uid, profile } = useUser()
  const { appNotification } = useApp()
  const { t } = useTranslation('ui')
  const { projectMembers, data, update } = useProject()

  const [open, setOpen] = useState(false)
  const [member, setMember] = useState(null)

  const isOwner = data?.createdBy === uid
  const isArchived = data?.isArchived

  const getMember = useCallback(
    e => {
      const memberId = e.currentTarget?.dataset?.memberId

      if (!projectMembers.find(pMember => pMember.id === memberId)) return

      setMember(memberId)
      setOpen(true)
    },
    [projectMembers]
  )

  const removeMember = useCallback(() => {
    ;(async () => {
      // remove the assigned tasks before kicking the user otherwise the
      // operation will fail
      const removeAssignedTasksToUser = await lazyImport(
        '/src/services/removeAssignedTasksToUser'
      )
      await removeAssignedTasksToUser(member, data?.id, data?.createdBy)

      await update({ members: arrayRemove(member) })

      const sendKickedNotification = await lazyImport(
        '/src/services/notifications/sendKickedNotification'
      )

      await sendKickedNotification(member, profile.username, data.name)

      appNotification({ message: t('notifications.memberKicked') })
      setOpen(false)
    })()
  }, [update, appNotification, t, member, data, profile?.username])

  return (
    <Box>
      <Typography variant='body2' color='textSecondary'>
        {t('projects.settings.membersLabel')}
      </Typography>

      {Array.isArray(projectMembers)
        ? projectMembers.map(
            pMember =>
              pMember?.id && (
                <ProjectMember
                  key={pMember.id}
                  data={pMember}
                  isOwner={isOwner}
                  isArchived={isArchived}
                  isUser={pMember.id === uid}
                  removeMember={getMember}
                  owner={data?.createdBy}
                />
              )
          )
        : data?.members?.map(member => <ProjectMemberSkeleton key={member} />)}

      {open && (
        <Suspense fallback={null}>
          <KickMemberDialog
            open={open}
            onClose={() => setOpen(false)}
            onAccept={removeMember}
            username={
              projectMembers?.find(pMember => pMember.id === member)?.username
            }
          />
        </Suspense>
      )}
    </Box>
  )
}
