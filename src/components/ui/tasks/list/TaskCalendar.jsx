import DropdownMenu from '@components/reusable/DropdownMenu'
import CalendarIcon from '@mui/icons-material/CalendarMonth'
import List from '@mui/material/List'

import useLoadResources from '@hooks/useLoadResources'
import useProject from '@hooks/useProject'
import useTaskDateUpdater from '@hooks/useTaskDateUpdater'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import getDateItems from '@utils/tasks/getDateItems'

export default function TaskCalendar({ rawDate, taskId, parentId }) {
  const { t } = useTranslation('ui')
  const [open, setOpen] = useState(false)

  const { date, updateDateHandler } = useTaskDateUpdater(rawDate)

  const { isArchived } = useProject()
  const loadingResources = useLoadResources('dialogs')

  if (loadingResources) return null

  const handleDateChange = async e => {
    const newDate =
      e.target.dataset?.value ||
      e.target.closest('[data-value]')?.dataset?.value ||
      e.target.querySelector('[data-value]')?.dataset?.value

    await updateDateHandler(newDate, taskId, parentId)
  }

  return (
    <DropdownMenu
      label={t('tasks.changeDate')}
      tooltipPosition='top'
      onClick={() => setOpen(true)}
      icon={<CalendarIcon />}
      disabled={isArchived}>
      <List onClick={handleDateChange} disablePadding>
        {getDateItems(date, true)}
      </List>
    </DropdownMenu>
  )
}
