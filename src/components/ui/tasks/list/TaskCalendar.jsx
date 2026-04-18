import CalendarIcon from '@mui/icons-material/CalendarMonth'
import DropdownMenu from '@components/reusable/DropdownMenu'
import Skeleton from '@mui/material/Skeleton'
import TaskTooltip from '@components/reusable/tasks/Tooltip'

import { Suspense, lazy } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import useLoadResources from '@hooks/useLoadResources'
import useProject from '@hooks/useProject'

const DateItems = lazy(() => import('@components/reusable/tasks/DateItems'))

export default function TaskCalendar({ 
  rawDate, 
  taskId, 
  parentId, 
  insideTask,
  onDateChange
}) {
  const { t } = useTranslation('tasks')
  const { isArchived } = useProject()

  useLoadResources('dialogs')

  return (
    <DropdownMenu
      label={t('changeDate')}
      tooltipPosition='top'
      slots={{ tooltip: TaskTooltip }}
      slotProps={{ root: { sx: { p: 1 } } }}
      icon={<CalendarIcon fontSize={insideTask ? 'small' : 'medium'} />}
      disabled={isArchived}>
      {(open, triggerExit) => (
        <Suspense fallback={<Skeleton width='8rem' height={0} />}>
          {open && (
            <DateItems
              currentDate={rawDate}
              isList
              onItemClick={val => onDateChange(val, triggerExit)}
            />
          )}
        </Suspense>
      )}
    </DropdownMenu>
  )
}
