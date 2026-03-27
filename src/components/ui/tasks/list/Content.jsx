import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import ParentTaskLink from './ParentTaskLink'

import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'

import taskIsPending from '@utils/tasks/taskIsPending'

export default function OverdueContent({
  data,
  insideTask = false,
  status
}) {
  const { t } = useTranslation('ui')
  const { filter } = useLayout()
  const { isParentChecked, isParentOverdue } = data

  const isOverdueLabelVisible =
    filter === 'default'
    && isParentOverdue
    && taskIsPending(status)

  const showParentLink = isParentChecked && filter !== 'default'
    || isOverdueLabelVisible

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
        {isOverdueLabelVisible && (
          <Chip
            sx={{ fontSize: '0.675rem' }}
            label={t('dates.overdue')}
            size='small'
            color='warning'
          />
        )}

        {showParentLink && (
          <ParentTaskLink parentTask={data.subtask} isOverdue={isOverdueLabelVisible} />
        )}
      </Box>
    </CardContent>
  )
}
