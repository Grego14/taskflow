import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import AppTooltip from '@components/reusable/AppTooltip'

import { useMemo } from 'react'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'

import { taskRegistry } from '@stores/task'

const avatarSlotProps = { img: { fetchPriority: 'high' } }

export default function TaskMembers({ assignedTo = [], subtaskIds = [], insideTask }) {
  const { t } = useTranslation('tasks')
  const { projectMembers } = useProject()

  // register to subtasks deletion
  const registry = taskRegistry.value

  const taskMembers = useMemo(() => {
    const assigned = assignedTo || []

    const subtaskAssigned = (subtaskIds || []).flatMap(sId => {
      const subtask = registry.get(sId).peek()
      return subtask?.assignedTo || []
    })

    return [...new Set([...assigned, ...subtaskAssigned])]
  }, [assignedTo, subtaskIds, registry])

  if (taskMembers.length === 0) return null

  const avatarSize = !insideTask ? 24 : 20

  const membersPreview = useMemo(() => {
    let members = ''

    const l = taskMembers.length
    for(let i = 0; i < l; i++){
      const member = projectMembers.find(pm => pm.id === taskMembers[i])

      if(!member) continue

      const template = member.username
      const isNotLast = i !== l - 1

      members += `${template}${isNotLast ? '\n' : ''}`
    }

    return members
  }, [taskMembers])

  const firstMember = projectMembers?.find(m => m.id === taskMembers[0])

  return (
    <AppTooltip title={membersPreview}>
      <div
        className='task-members-trigger flex-center'
        style={{ '--avatar-size': `${avatarSize}px` }}>
        {taskMembers.length === 1 ? (
          <Avatar
            src={firstMember?.avatar}
            alt={t('avatar_name', { name: firstMember?.username })}
            slotProps={avatarSlotProps}
            className='task-member-avatar-single'
          />
        ) : (
          <div className='relative flex flex-center'>
            <Avatar
              src={firstMember?.avatar}
              className='task-member-avatar-stacked'
            />
            <div className='task-members-badge flex flex-center'>
              +{taskMembers.length - 1}
            </div>
          </div>
        )}
      </div>
    </AppTooltip>
  )
}
