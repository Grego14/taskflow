import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import PersonIcon from '@mui/icons-material/PersonOutline'

import { useState, useMemo } from 'react'
import useProject from '@hooks/useProject'

export default function TaskMembers({ assignedTo = [], subtasks = [], insideTask }) {
  const { projectMembers } = useProject()

  const taskMembers = useMemo(() => {
    const assigned = assignedTo || []
    const subtaskAssigned = (subtasks || []).flatMap(s => s.assignedTo || [])
    return [...new Set([...assigned, ...subtaskAssigned])]
  }, [assignedTo, subtasks])

  if (taskMembers.length === 0) return null

  const avatarSize = !insideTask ? 24 : 20

  // helper to render the full list inside the Tooltip
  const membersPreview = (
    <Box sx={{ p: 0.5 }}>
      <AvatarGroup max={4} spacing='small'>
        {taskMembers.map(id => {
          const m = projectMembers?.find(pm => pm.id === id)
          return <Avatar key={id} src={m?.avatar} sx={{ width: avatarSize, height: avatarSize }} />
        })}
      </AvatarGroup>
    </Box>
  )

  const firstMember = projectMembers?.find(m => m.id === taskMembers[0])

  return (
    <Tooltip
      title={membersPreview}
      arrow
      placement='top'>
      <Box
        className='flex-center'
        sx={theme => ({
          display: { xs: 'none', mobile: 'flex' },
          cursor: 'pointer',
          ml: 'auto',
          p: 1,
          transition: 'background-color .3s ease-in-out',
          borderRadius: 50,
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        })}>
        {taskMembers.length === 1 ? (
          <Avatar
            src={firstMember?.avatar}
            slotProps={{ img: { fetchPriority: 'high' } }}
            sx={{
              width: avatarSize,
              height: avatarSize,
              border: '1px solid currentColor'
            }}
          />
        ) : (
          <Box className='relative flex flex-center'>
            <Avatar
              src={firstMember?.avatar}
              sx={{ width: 20, height: 20, zIndex: 2 }}
            />
            <Box className='flex flex-center'
              sx={{
                ml: -1,
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                color: 'white',
                fontSize: '0.65rem',
                border: '2px solid white',
                zIndex: 1
              }}>
              +{taskMembers.length - 1}
            </Box>
          </Box>
        )}
      </Box>
    </Tooltip>
  )
}
