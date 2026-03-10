import CalendarIcon from '@mui/icons-material/CalendarMonth'
import DropdownMenu from '@components/reusable/DropdownMenu'

import { Suspense, lazy } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import useLoadResources from '@hooks/useLoadResources'
import useProject from '@hooks/useProject'
import useTaskDateUpdater from '@hooks/useTaskDateUpdater'

const DateItems = lazy(() => import('@components/reusable/tasks/DateItems'))

export default function TaskCalendar({ rawDate, taskId, parentId, insideTask }) {
  const { t } = useTranslation('tasks')
  const { date, updateDateHandler } = useTaskDateUpdater(rawDate)
  const { isArchived } = useProject()
  const loadingResources = useLoadResources('dialogs')

  const handleDateChange = async (newDate, triggerExit) => {
    triggerExit()
    await updateDateHandler(newDate, taskId, parentId)
  }

  return (
    <DropdownMenu
      label={t('changeDate')}
      tooltipPosition='top'
      buttonStyles={{ p: 1 }}
      icon={<CalendarIcon fontSize={insideTask ? 'small' : 'medium'} />}
      disabled={isArchived}>
      {(open, triggerExit) => (
        <Suspense fallback={null}>
          {open && (
            <DateItems
              currentDate={date}
              isList
              onItemClick={val => handleDateChange(val, triggerExit)}
            />
          )}
        </Suspense>
      )}
    </DropdownMenu>
  )
}
