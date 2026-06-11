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

import '@styles/components/buttons/assignMembers.css'

const itemTextSlotProps = { primary: { variant: 'body2', noWrap: true } }

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
        className='assign-member-item'>
        <ListItemAvatar className='assign-member-avatar-box'>
          <Avatar src={member.avatar} className='assign-member-avatar'>
            {member.username?.charAt(0)}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={member.username} slotProps={itemTextSlotProps} />
        <Checkbox
          edge='end'
          checked={isSelected}
          size='small'
          disableRipple
          className='assign-member-checkbox'
        />
      </ListItem>
    )
  }

  return <List className='assign-members-list'>
    {items}
  </List>
}

export default function AssignMembers({
  members: taskMembers = [],
  setMembers,
  id: taskId,
  parentId,
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
        parentId,
        data: { assignedTo: newMembers }
      })
      return
    }

    setMembers(newMembers)
  }

  const label = t('actions.assignMembers')
  const icon = <PersonAddIcon fontSize='small' className='assign-members-icon' />

  const menuText = <Box className='flex flex-center' gap={1}>
    {icon}
    <Typography variant='body2' className='assign-members-label'>
      {label}
    </Typography>
  </Box>

  const rootClassName = `
    assign-members-trigger 
    ${creatingTask ? 'is-creating' : ''}`

  return (
    <DropdownMenu
      disableTooltip={!creatingTask}
      text={!creatingTask && menuText}
      icon={creatingTask && icon}
      label={creatingTask && label}
      tooltipPosition='top'
      slotProps={{
        root: {
          className: rootClassName,
          ...(creatingTask && { 'aria-label': label })
        },
        paper: { className: 'assign-members-menu-paper' }
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
