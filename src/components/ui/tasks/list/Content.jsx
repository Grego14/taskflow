import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import ParentTaskLink from './ParentTaskLink'

import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'

import taskIsPending from '@utils/tasks/taskIsPending'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import { taskRegistry } from '@stores/task'

export default function OverdueContent({ id }) {
  const { t } = useTranslation('ui')
  const { filter } = useLayout()
  
  const taskData = taskRegistry.value.get(id)

  if (!taskData) return null

  const status = taskData?.status
  const parentId = taskData?.parentId || taskData?.subtask

  const parentTask = parentId ? taskRegistry.value.get(parentId) : null

  const isPending = taskIsPending(status)
  const isOverdue = taskIsOverdue(taskData)
  const isDefaultFilter = filter === 'default'

  const isParentOverdue = typeof (parentTask 
    ? taskIsOverdue(parentTask) 
    : null) === 'boolean'
  const isParentCancelled = parentTask?.status === 'cancelled'

  const showParentLink = (
    (isParentOverdue && !isDefaultFilter) || 
      (isPending && isDefaultFilter)
  ) && parentId && !isParentCancelled

  if(!showParentLink) return null

  return (
    <CardContent
      className='flex flex-column'
      sx={{
        pt: 0,
        ml: 1.25,
        px: 0,
        '&:last-child': { pb: 0 }
      }}>
      <Box className='flex' gap={2}>
        {showParentLink ? (
          <ParentTaskLink parentTask={parentId} />
        ) : null}
      </Box>
    </CardContent>
  )
}
