import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'

import ParentTaskLink from './ParentTaskLink'

import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import taskIsPending from '@utils/tasks/taskIsPending'

export default function OverdueContent({
  data,
  insideTask = false,
  status,
  isOverdueLabelVisible
}) {
  const { t } = useTranslation('ui')
  const { metadata } = useUser()
  const filter = metadata?.lastUsedFilter

  if (!isOverdueLabelVisible) return

  return (
    <CardContent
      className='flex flex-column'
      sx={{
        pt: 0,
        mt: 2,
        ml: 1.25,
        px: 0,
        '&:last-child': { pb: data.subtasks ? 1 : 1.5 }
      }}>
      <Box className='flex' gap={2}>
        {isOverdueLabelVisible && (
          <Chip label={t('dates.overdue')} size='small' color='warning' />
        )}

        {!insideTask && data.isSubtask && (
          <ParentTaskLink parentTask={data.subtask} />
        )}
      </Box>
    </CardContent>
  )
}
