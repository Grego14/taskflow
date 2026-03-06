import CalendarIcon from '@mui/icons-material/CalendarMonth'
import DropdownMenu from '@components/reusable/DropdownMenu'

import { useTranslation } from 'react-i18next'
import useLoadResources from '@hooks/useLoadResources'
import useProject from '@hooks/useProject'
import useTaskDateUpdater from '@hooks/useTaskDateUpdater'

import getDateItems from '@utils/tasks/getDateItems'

export default function TaskCalendar({ rawDate, taskId, parentId, insideTask }) {
  const { t } = useTranslation('tasks')
  const { date, updateDateHandler } = useTaskDateUpdater(rawDate)
  const { isArchived } = useProject()
  const loadingResources = useLoadResources('dialogs')

  if (loadingResources) return null

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
      {(triggerExit) => (
        getDateItems(
          date,
          true,
          (val) => handleDateChange(val, triggerExit)
        )
      )}
    </DropdownMenu>
  )
}
