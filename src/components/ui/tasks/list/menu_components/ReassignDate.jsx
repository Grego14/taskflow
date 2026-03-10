import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DropdownMenu from '@components/reusable/DropdownMenu'

import useLoadResources from '@hooks/useLoadResources'
import useTaskDateUpdater from '@hooks/useTaskDateUpdater'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'preact/compat'

const DateItems = lazy(() => import('@components/reusable/tasks/DateItems'))

export default function ReassignDate({ rawDate, id, subtask }) {
  const { t } = useTranslation(['tasks', 'dialogs'])
  const { date, updateDateHandler } = useTaskDateUpdater(rawDate)
  const loading = useLoadResources('dialogs')

  if (loading) return null

  const handleDateChange = async (newValue, triggerExit) => {
    triggerExit()
    await updateDateHandler(newValue, id, subtask)
  }

  // find current label to show in the "Select" button
  const currentLabel = t(`newtask.dates.${date}`, { defaultValue: date, ns: 'dialogs' })

  return (
    <Box p={1.25}>
      <DropdownMenu
        text={currentLabel}
        icon={<ExpandMoreIcon />}
        label={t('changeDate')}
        buttonStyles={[theme => ({
          justifyContent: 'space-between',
          width: '100%',
          border: '1px solid',
          borderColor: 'divider',
          py: 1,
          color: 'secondary.dark',
          ...(theme.applyStyles('dark', { color: 'secondary.light' })),
          '& .MuiButton-startIcon': { order: 2, ml: 1, mr: 0 },
          ...theme.typography.body2
        })
        ]}>
        {(open, triggerExit) => (
          <Suspense>
            {open && (
              <DateItems
                currentDate={date}
                onItemClick={val => handleDateChange(val, triggerExit)}
              />
            )}
          </Suspense>
        )}
      </DropdownMenu>
    </Box>
  )
}
