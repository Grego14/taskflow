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

const getIconStyles = theme => ({
  color: theme.palette.info.light,
  ...theme.applyStyles('dark', { color: theme.palette.info.dark })
})

const getButtonStyles = theme => ({
  justifyContent: 'start',
  gap: 1.5,
  color: 'text.secondary',
  '&:hover': { backgroundColor: theme.alpha(theme.palette.action.hover, 0.1) },
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
  setMembers,
  id: taskId,
  subtask,
  sx,
  creatingTask = false
}) {
  const { t } = useTranslation('tasks')
  const { projectMembers } = useProject()
  const { actions } = useTasks()

  const handleToggleMember = async (memberId) => {
    const isAssigned = taskMembers.includes(memberId)
    const newMembers = isAssigned
      ? taskMembers.filter(id => id !== memberId)
      : [...taskMembers, memberId]

    // this component is used on both updating an existing task and when
    // creating a task on the NewTaskDialog 

    if (!creatingTask) {
      await actions.updateTask({
        id: taskId,
        subtask,
        data: { assignedTo: newMembers }
      })
      return
    }

    setMembers(newMembers)
  }

  const label = t('actions.assignMembers')
  const icon = <PersonAddIcon fontSize='small' sx={getIconStyles} />

  const menuText = <Box className='flex flex-center' gap={1}>
    {icon}
    <Typography variant='body2'
      sx={[theme => ({
        color: theme.palette.info.light,
        ...theme.applyStyles('dark', { color: theme.palette.info.dark }),
        my: 0.5
      })]}>
      {label}
    </Typography>
  </Box>

  return (
    <DropdownMenu
      disableTooltip={!creatingTask}
      text={!creatingTask && menuText}
      icon={creatingTask && icon}
      label={creatingTask && label}
      tooltipPosition='top'
      buttonStyles={theme => ({ ...getButtonStyles(theme), ...sx })}
      sx={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      slotProps={{
        paper: {
          sx: (theme) => ({
            backgroundColor: theme.palette.mode === 'dark'
              ? theme.lighten(theme.palette.background.paper, 0.05)
              : theme.palette.background.paper,
            border: `1px solid ${theme.alpha(theme.palette.info.main, 0.5)}`,
            boxShadow: theme.shadows[8],
            backgroundImage: 'none'
          })
        },
        button: {
          ...(creatingTask && {
            'aria-label': label,
            sx: { p: 1.5 }
          })
        }
      }}>
      {(_, triggerExit) => renderMembersList({
        projectMembers,
        taskMembers,
        triggerExit,
        onToggle: handleToggleMember
      })}
    </DropdownMenu>
  )
}
