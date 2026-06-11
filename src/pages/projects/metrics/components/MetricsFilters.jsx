import { memo, Suspense, lazy } from 'preact/compat'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
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

const calculateStartDate = (value) => {
  const now = new Date()

  if (value === 'today') return new Date(now.setHours(0, 0, 0, 0))
  if (value === 'week') return new Date(now.setDate(now.getDate() - 7))
  if (value === 'month') return new Date(now.setMonth(now.getMonth() - 1))

  return null
}

function Item(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  )
}

const MetricsFilters = memo(({ preview }) => {
  const { t } = useTranslation('metrics')
  const { projectMembers = [] } = useProject()
  const {
    updateRange,
    selectedMembers,
    setSelectedMembers
  } = useProjectMetrics()

  const handleDateChange = (e) => {
    const start = calculateStartDate(e.target.value)
    updateRange(start, null)
  }

  return (
    <div className='metrics-filters-wrapper flex flex-center flex-wrap'>
      <FormControl size='small' className='filter-select-form'>
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
            className='members-filter'
            renderOption={(props, option) => {
              const { key, ...otherProps } = props
              return (
                <ListItemButton
                  key={key}
                  {...otherProps}
                  className='flex flex-center member-option-item'>
                  <Avatar
                    src={option.avatar || ''}
                    aria-hidden='true'
                    className='member-option-avatar'>
                    {option?.username[0]}
                  </Avatar>
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
            renderValue={(value, getItemProps) => (
              <Chip 
                label={value?.[0]?.username} 
                {...getItemProps()} 
                className='member-filter-chip' />
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('filterMembers')}
                className='member-search-input'
              />
            )}
          />
        )}
      </Suspense>
    </div>
  )
})

export default MetricsFilters
