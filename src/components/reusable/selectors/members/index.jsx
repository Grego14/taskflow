// components
import Avatar from '@mui/material/Avatar'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'

// hooks
import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'
import useProject from '@hooks/useProject'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// utils
import substringLongText from '@utils/substringLongText'

export default function MembersSelector({
  members,
  setMembers,
  noMargin = false
}) {
  const { t } = useTranslation('selectors')
  const loadingResources = useLoadResources('selectors')
  const { isMobile } = useApp()
  const { projectMembers } = useProject()

  function handleMembersChange(e) {
    const newMember = e.target.value
    const newMembers = [...new Set([...members, newMember])]

    setMembers(newMembers)
  }

  return (
    <FormControl sx={{ minWidth: '10rem', mt: noMargin ? 0 : 2 }}>
      <InputLabel id='select-members'>{t('members.text')}</InputLabel>
      <Select
        labelId='select-members'
        value={members.at(-1) || ''}
        label={t('members.text')}
        onChange={handleMembersChange}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            gap: 1
          }
        }}
        MenuProps={{
          slotProps: {
            list: {
              sx: { display: 'flex', flexDirection: 'column', gap: 1, py: 1.5 }
            }
          }
        }}>
        {projectMembers?.map(member => (
          <MenuItem
            className='flex'
            sx={{ gap: 1, py: 1.5 }}
            disabled={members.some(m => m === member.id)}
            value={member.id}
            key={member.id}>
            <Avatar src={member.avatar} sx={{ width: 22, height: 22 }} />
            <Typography variant='body2'>
              {substringLongText(member.username, 20)}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
