import DropdownMenu from '@components/reusable/DropdownMenu'
import CalendarIcon from '@mui/icons-material/CalendarMonth'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { DATES } from '@/constants'
import { useTranslation } from 'react-i18next'
import getDateItems from '@utils/tasks/getDateItems'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter'

const getDate = date => (!DATES.includes(date) ? 'nodate' : date)

export default function TaskDate({ date, setDate }) {
  const { t } = useTranslation('dialogs')

  const handleDateChange = async (newDate, triggerExit) => {
    triggerExit()
    setDate(getDate(newDate))
  }

  return (
    <Box className='flex flex-center' gap={2}>
      <DropdownMenu
        label={t('newtask.taskDateLabel')}
        tooltipPosition='top'
        icon={<CalendarIcon />}>
        {(triggerExit) => (
          getDateItems(
            date,
            true,
            (val) => handleDateChange(val, triggerExit)
          )
        )}
      </DropdownMenu>

      <Typography variant='body2' color='primary.main'>
        {upperCaseInitialLetter(t(`newtask.dates.${date}`))}
      </Typography>
    </Box>
  )
}
