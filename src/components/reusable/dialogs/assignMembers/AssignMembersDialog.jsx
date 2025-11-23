import MembersSelector from '@components/reusable/selectors/members'
import RemoveIcon from '@mui/icons-material/Clear'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Dialog from '../Dialog'

import useLoadResources from '@hooks/useLoadResources'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import useUser from '@hooks/useUser'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AssignMembersDialog(props) {
  const { uid } = useUser()
  const {
    members: taskMembers,
    id: taskId,
    subtask,
    closeMenus,
    ...other
  } = props
  const { t } = useTranslation('dialogs')
  const loadingResources = useLoadResources(['dialogs', 'selectors'])
  const [members, setMembers] = useState(taskMembers || [])
  const { actions } = useTasks()
  const { data: projectData, projectMembers } = useProject()

  const deleteMember = e => {
    const memberId = e?.currentTarget?.dataset?.memberId

    if (!memberId) return

    setMembers(members => members.filter(member => member !== memberId))
  }

  const updateDbMembers = async () => {
    await actions.updateTask({
      id: subtask ? subtask : taskId,
      data: { assignedTo: members },
      subtask: subtask ? taskId : null
    })

    closeMenus()
  }

  return (
    <Dialog
      {...other}
      onClose={closeMenus}
      title='assignMembers.title'
      titleLoaded={!loadingResources}
      onAccept={updateDbMembers}>
      <MembersSelector members={members} setMembers={setMembers} noMargin />

      <Box className='flex flex-column' gap={1} alignItems='start' mt={2.5}>
        <Typography variant='body2'>
          {t('assignMembers.actualMembers', { count: members.length })}
        </Typography>

        <Box className='flex flex-wrap' gap={1.5} maxWidth='25rem'>
          {members.map(member => {
            const memberData = projectMembers?.find(
              pMember => pMember.id === member
            )

            if (!memberData) return null

            return (
              <Chip
                key={`taskMember-${member}`}
                className='flex'
                gap={1}
                label={memberData?.username}
                variant='outlined'
                avatar={
                  <Avatar
                    src={memberData?.avatar}
                    sx={{ width: 22, height: 22 }}
                  />
                }
                deleteIcon={
                  <RemoveIcon
                    fontSize='small'
                    data-member-id={memberData?.id}
                  />
                }
                onDelete={deleteMember}
              />
            )
          })}
        </Box>
      </Box>
    </Dialog>
  )
}
