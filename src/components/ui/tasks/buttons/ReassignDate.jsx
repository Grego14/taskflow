import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DropdownMenu from '@components/reusable/DropdownMenu'

import useLoadResources from '@hooks/useLoadResources'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'preact/compat'

const DateItems = lazy(() => import('@components/reusable/tasks/DateItems'))

export default function ReassignDate({ rawDate, id, parentId, onDateChange }) {
  const { t } = useTranslation(['tasks', 'dialogs'])
  const loading = useLoadResources('dialogs')

  if (loading) return null

  // find current label to show in the "Select" button
  const currentLabel = t(`dialogs:newtask.dates.${rawDate}`, { 
    defaultValue: rawDate
  })

  return (
    <Box p={1.25}>
      <DropdownMenu
        text={currentLabel}
        icon={<ExpandMoreIcon />}
        label={t('changeDate')}
        slotProps={{
          root: {
            sx: theme => ({
              justifyContent: 'space-between',
              width: '100%',
              border: '1px solid',
              borderColor: 'divider',
              py: 1,
              color: 'secondary.dark',
              '& .MuiButton-startIcon': { order: 2, ml: 1, mr: 0 },
              ...theme.typography.body2,
              ...(theme.applyStyles('dark', { color: 'secondary.light' }))
            })
          }
        }}>
        {(open, triggerExit) => (
          <Suspense>
            {open && (
              <DateItems
                currentDate={rawDate}
                onItemClick={val => onDateChange(val, triggerExit)}
              />
            )}
          </Suspense>
        )}
      </DropdownMenu>
    </Box>
  )
}
