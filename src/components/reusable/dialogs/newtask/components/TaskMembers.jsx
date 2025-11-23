// components
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import AssignedMembers from './AssignedMembers'

// hooks
import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// utils
import getProjectData from '@utils/getProjectData.js'
import substringLongText from '@utils/substringLongText'

export default function TaskMembers({ members, updateMembers }) {
  const { t } = useTranslation('dialogs')
  const { isMobile } = useApp()
  const { projectMembers } = useProject()
  const [actualMembers, setActualMembers] = useState(members)

  function handleMembersChange(e) {
    const newMember = e.target.value
    const newMembers = Array.from(new Set([...members, newMember]))

    setActualMembers(newMembers)
    updateMembers(newMembers)
  }

  function handleMemberRemoval(e) {
    const elementId = e.target.id || e.target.closest('button')?.id

    if (!elementId) return

    const memberToRemove = elementId.replace('task-member__', '')
    const newMembers = members.filter(member => member !== memberToRemove)

    setActualMembers(newMembers)
    updateMembers(newMembers)
  }

  const isAssigned = actualMembers?.length > 0

  return (
    <Box
      className='flex flex-column'
      alignItems='start'
      justifyContent={isAssigned ? 'space-between' : 'start'}
      gap={!isAssigned ? 1.5 : 1}>
      <FormControl fullWidth>
        <InputLabel id='select-members'>
          {t('newtask.taskMembersSelectLabel')}
        </InputLabel>
        <Select
          className='task-members-select'
          labelId='select-members'
          value={members.at?.(-1) || ''}
          label={t('newtask.taskMembersSelectLabel')}
          onChange={handleMembersChange}>
          {projectMembers?.map(member => (
            <MenuItem
              disabled={actualMembers.some(m => m === member.id)}
              value={member.id}
              key={member.id}
              className='task-members-select__member'>
              <Avatar src={member.avatar} sx={{ width: 22, height: 22 }} />
              <Typography variant='body2'>
                {substringLongText(member.username, 20)}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <AssignedMembers
        actualMembers={actualMembers}
        projectMembers={Object.values(projectMembers || [])}
        removeMember={handleMemberRemoval}
      />
    </Box>
  )
}
