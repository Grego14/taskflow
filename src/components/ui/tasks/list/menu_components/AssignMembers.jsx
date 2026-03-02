import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Box from '@mui/material/Box'

import DropdownMenu from '@components/reusable/DropdownMenu'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import { useTranslation } from 'react-i18next'
import { alpha } from '@mui/material/styles'

const getIconStyles = theme => ({
  color: theme.palette.info.light,
  ...theme.applyStyles('dark', { color: theme.palette.info.dark })
})

const getButtonStyles = theme => ({
  justifyContent: 'start',
  gap: 1.5,
  color: 'text.secondary',
  '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.1) },
  py: 1.065,
  px: 2,
  width: '100%'
})

const renderMembersList = (props) => {
  const { projectMembers, taskMembers, onToggle, triggerExit } = props
  const items = []

  for (const member of projectMembers || []) {
    const isSelected = taskMembers.includes(member.id)

    const handleClick = () => {
      triggerExit()
      onToggle(member.id)
    }

    items.push(
      <ListItem
        key={member.id}
        button
        onClick={handleClick}
        sx={{ gap: 1, py: 0.5 }}>
        <ListItemAvatar sx={{ minWidth: 40 }}>
          <Avatar
            src={member.avatar}
            sx={{ width: 30, height: 30, fontSize: '0.85rem' }}>
            {member.username?.charAt(0)}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={member.username}
          slotProps={{ primary: { variant: 'body2', noWrap: true } }}
        />
        <Checkbox
          edge='end'
          checked={isSelected}
          size='small'
          disableRipple
          sx={{ ml: 'auto' }}
        />
      </ListItem>
    )
  }

  return <List
    sx={{
      p: 0,
      minWidth: 200,
      maxHeight: 300,
      overflowY: 'auto'
    }}>
    {items}
  </List>
}

export default function AssignMembers({
  members: taskMembers = [],
  id: taskId,
  subtask
}) {
  const { t } = useTranslation('tasks')
  const { projectMembers } = useProject()
  const { actions } = useTasks()

  const handleToggleMember = async (memberId) => {
    const isAssigned = taskMembers.includes(memberId)
    const newMembers = isAssigned
      ? taskMembers.filter(id => id !== memberId)
      : [...taskMembers, memberId]

    await actions.updateTask({
      id: subtask ? subtask : taskId,
      subtask: subtask ? taskId : null,
      data: { assignedTo: newMembers }
    })
  }

  const menuText = <Box className='flex flex-center' gap={1}>
    <PersonAddIcon fontSize='small' sx={getIconStyles} />
    <Typography variant='body2'
      sx={[theme => ({
        color: theme.palette.info.light,
        ...theme.applyStyles('dark', { color: theme.palette.info.dark }),
        my: 0.5
      })]}>
      {t('actions.assignMembers')}
    </Typography>
  </Box>

  return (
    <DropdownMenu
      disableTooltip
      text={menuText}
      buttonStyles={getButtonStyles}
      sx={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      slotProps={{
        paper: {
          sx: (theme) => ({
            backgroundColor: theme.palette.mode === 'dark'
              ? theme.lighten(theme.palette.background.paper, 0.05)
              : theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.info.main, 0.5)}`,
            boxShadow: theme.shadows[8],
            backgroundImage: 'none'
          })
        }
      }}>
      {(triggerExit) => renderMembersList({
        projectMembers,
        taskMembers,
        triggerExit,
        onToggle: handleToggleMember
      })}
    </DropdownMenu>
  )
}
