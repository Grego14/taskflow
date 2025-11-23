import AddMembers from '@components/ui/projects/AddMembers'
import Typography from '@mui/material/Typography'
import Dialog from '../Dialog'

import useLoadResources from '@hooks/useLoadResources'
import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import sendMembersInvitation from '@services/notifications/sendMembersInvitation'

export default function AddMembersDialog(props) {
  const { uid, profile } = useUser()
  const { open, setOpen } = props
  const { id, data } = useProject()
  const owner = data?.createdBy

  const isOwner = uid === owner

  const { t } = useTranslation('dialogs')
  const loadingResources = useLoadResources(['dialogs'])
  const [members, setMembers] = useState([])

  const handleNewMembers = async () => {
    const membersToInvite = members.filter(
      member => !data?.invitedUsers?.includes(member.id)
    )

    if (isOwner && membersToInvite?.length > 0) {
      await sendMembersInvitation({
        project: id,
        owner,
        // filter the already invited members
        members: membersToInvite,
        projectName: data.name,
        invitedBy: profile.username
      })
    }

    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      titleLoaded={!loadingResources}
      title='assignMembers.title'
      maxWidth='tablet'
      onAccept={handleNewMembers}
      disableAcceptBtn={members.length === 0}>
      <AddMembers members={members} setMembers={setMembers} isOwner={isOwner} />
      {!isOwner && (
        <Typography mt={2} color='warning'>
          {t('assignMembers.noOwner')}
        </Typography>
      )}
    </Dialog>
  )
}
