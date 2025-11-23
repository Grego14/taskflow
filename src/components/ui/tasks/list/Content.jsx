import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
// components
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'

import ContentActions from './ContentActions'
import ParentTaskLink from './ParentTaskLink'

// hooks
import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import taskIsPending from '@utils/tasks/taskIsPending'

export default function Content({ data, insideTask = false, status }) {
  const { t } = useTranslation('ui')
  const { projectMembers } = useProject()
  const { metadata } = useUser()
  const filter = metadata?.lastUsedFilter

  const [separateAvatars, setSeparateAvatars] = useState(false)

  const taskMembers = [
    ...new Set([
      ...(data?.assignedTo || []),
      ...(data?.subtasks || []).flatMap(subtask => subtask.assignedTo)
    ])
  ]

  const contentActionsProps = {
    insideTask,
    status: status,
    id: data?.id,
    isSubtask: data?.isSubtask,
    subtask: data?.subtask,
    taskPriority: data?.priority || 'none'
  }

  return (
    <CardContent
      className='flex flex-column'
      sx={{
        pt: 0,
        mt: 2.5,
        ml: 1.25,
        px: 0,
        '&:last-child': { pb: data.subtasks ? 1 : 1.5 }
      }}>
      <Box className='flex flex-center' gap={2}>
        <ContentActions {...contentActionsProps} />

        {/* if the user is using a filter other than "default" he can't see which
          task are overdue so we add this (this only applies to pending tasks)*/}
        {filter !== 'default' &&
          taskIsPending(status) &&
          taskIsOverdue(data) && (
            <Chip label={t('dates.overdue')} size='small' color='warning' />
          )}

        {!insideTask && data.isSubtask && (
          <ParentTaskLink parentTask={data.subtask} />
        )}

        {Array.isArray(taskMembers) && (
          <AvatarGroup
            max={3}
            className='flex'
            sx={{ ml: 'auto' }}
            spacing={separateAvatars ? 0 : insideTask ? 'medium' : 'small'}>
            {taskMembers.map(member => {
              const memberData = projectMembers?.find(pm => pm.id === member)
              const size = insideTask ? '1.5rem' : '2rem'

              if (!memberData) return null

              return (
                <Tooltip
                  key={memberData.id}
                  title={memberData.username}
                  onMouseEnter={() => setSeparateAvatars(true)}
                  onMouseLeave={() => setSeparateAvatars(false)}>
                  <Avatar
                    src={memberData.avatar}
                    sx={{
                      width: size,
                      height: size,
                      transition: 'margin-left .3s ease-in-out'
                    }}
                    alt={memberData.username}
                  />
                </Tooltip>
              )
            })}
          </AvatarGroup>
        )}
      </Box>
    </CardContent>
  )
}
