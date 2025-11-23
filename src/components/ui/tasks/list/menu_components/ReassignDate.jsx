import OptionalSelector from '@components/reusable/selectors/OptionalSelector'
import Box from '@mui/material/Box'

import useLoadResources from '@hooks/useLoadResources'
import useTaskDateUpdater from '@hooks/useTaskDateUpdater'
import { useTranslation } from 'react-i18next'

import getDateItems from '@utils/tasks/getDateItems'

export default function ReassignDate({ rawDate, id, subtask }) {
  const { t } = useTranslation('ui')

  const { date, updateDateHandler } = useTaskDateUpdater(rawDate)

  // in case the TaskCalendar doesn't load (the device is mobile)
  const loadingResources = useLoadResources('dialogs')

  if (loadingResources) return null

  const handleDateChange = async e => {
    const newDate = e.target.value
    await updateDateHandler(newDate, id, subtask)
  }

  return (
    <Box p={1.25}>
      <OptionalSelector
        defaultValue='nodate'
        label={t('tasks.changeDate')}
        title={t('tasks.changeDate')}
        handler={handleDateChange}
        value={date}>
        {getDateItems(rawDate)}
      </OptionalSelector>
    </Box>
  )
}
