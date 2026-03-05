import { memo, Suspense, lazy } from 'preact/compat'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

const Autocomplete = lazy(() => import('@mui/material/Autocomplete'))
const TextField = lazy(() => import('@mui/material/TextField'))

import useProjectMetrics from '@hooks/useProjectMetrics'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'

const DATE_OPTIONS = [
  { value: 'all', labelKey: 'allTime' },
  { value: 'today', labelKey: 'today' },
  { value: 'week', labelKey: 'lastWeek' },
  { value: 'month', labelKey: 'lastMonth' }
]

const MetricsFilters = memo(({ preview }) => {
  const { t } = useTranslation('metrics')
  const { projectMembers = [] } = useProject()
  const {
    updateRange,
    selectedMembers,
    setSelectedMembers
  } = useProjectMetrics()

  const handleDateChange = (e) => {
    const value = e.target.value
    const now = new Date()
    let start = null

    if (value === 'today') {
      start = new Date(now.setHours(0, 0, 0, 0))
    } else if (value === 'week') {
      start = new Date(now.setDate(now.getDate() - 7))
    } else if (value === 'month') {
      start = new Date(now.setMonth(now.getMonth() - 1))
    }

    updateRange(start, null)
  }

  return (
    <Box className='flex items-center' flexWrap='wrap' mb={2} gap={2}>
      <FormControl size='small' sx={{ minWidth: 160 }}>
        <InputLabel id='date-range-label'>{t('dateRange')}</InputLabel>
        <Select
          labelId='date-range-label'
          label={t('dateRange')}
          onChange={handleDateChange}
          defaultValue='all'>
          {DATE_OPTIONS.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>
              {t(`filters.${opt.labelKey}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Suspense fallback={null}>
        {preview === 'members' && (
          <Autocomplete
            multiple
            size='small'
            options={projectMembers}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props
              return (
                <ListItemButton
                  key={key}
                  {...otherProps}
                  className='flex flex-center'
                  sx={{ gap: 2, px: 2, py: 1 }}>
                  <Avatar
                    src={option.avatar || ''}
                    sx={{ width: 24, height: 24 }}
                    aria-hidden='true'
                  />
                  <ListItemText variant='body2'>
                    {option.username || option.email}
                  </ListItemText>
                </ListItemButton>
              )
            }}
            getOptionLabel={(option) => option.username || ''}
            // find selected objects from IDs
            value={projectMembers.filter(m => selectedMembers.includes(m.id))}
            onChange={(_, newValue) =>
              setSelectedMembers(newValue.map(m => m.id))}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('filterMembers')}
                sx={{ minWidth: 280 }}
              />
            )}
          />
        )}
      </Suspense>
    </Box>
  )
})

export default MetricsFilters
