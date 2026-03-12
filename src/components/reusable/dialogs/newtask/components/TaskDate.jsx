import { lazy, Suspense } from 'preact/compat'

import DropdownMenu from '@components/reusable/DropdownMenu'
import CalendarIcon from '@mui/icons-material/CalendarMonth'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const DateItems = lazy(() => import('@components/reusable/tasks/DateItems'))

import { DATES } from '@/constants'
import { useTranslation } from 'react-i18next'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter'

const getDate = date => (!DATES.includes(date) ? 'nodate' : date)

export default function TaskDate({ date, setDate }) {
  const { t } = useTranslation('dialogs')

  const handleDateChange = async (newDate, triggerExit) => {
    triggerExit()
    setDate(getDate(newDate))
  }

  return (
    <Box className='flex' gap={2} width='100%' alignItems='center'>
      <DropdownMenu
        label={t('newtask.taskDateLabel')}
        tooltipPosition='top'
        icon={<CalendarIcon />}>
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

      <Typography variant='body2' color='primary.main'>
        {upperCaseInitialLetter(t(`newtask.dates.${date}`))}
      </Typography>
    </Box>
  )
}
