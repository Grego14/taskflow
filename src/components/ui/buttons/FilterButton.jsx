import DropdownMenu from '@/components/reusable/DropdownMenu'
import MenuAction from '@components/reusable/MenuAction'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import Typography from '@mui/material/Typography'

import useUser from '@hooks/useUser'
import { getItem } from '@utils/storage.js'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import i18n from '@/i18n'
import getMenuLabel from '@utils/getMenuLabel'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter'

import { FILTERS } from '@/constants'

const getFilterLabel = (label, t) => {
  return upperCaseInitialLetter(
    // we pass the count: 1 to get the _one translation
    // the other special counts are used on the creation of the TasksWrappers
    // titles
    t(`buttons.filterOptions.${label}`, { count: 1, ns: 'ui' })
  )
}

export default function FilterButton() {
  const { metadata, updateFilter } = useUser()
  const { t } = useTranslation(['ui', 'common'])
  const [selected, setSelected] = useState(metadata?.lastUsedFilter)

  const changeSelectedOption = useCallback(
    e => {
      const value = e.currentTarget.id.replace('filter-option__', '')

      if (!FILTERS.find(f => f === value)) return

      setSelected(value)
      updateFilter(value)
    },
    [updateFilter]
  )

  const filterOptions = FILTERS.map(f => ({
    label: getFilterLabel(f, t),
    value: f
  }))

  return (
    <DropdownMenu
      icon={<FilterAltIcon fontSize='medium' />}
      label={state => getMenuLabel(state, 'buttons.filter', 'ui')}
      tooltipPosition='bottom'
      buttonStyles={{
        borderRadius: '50%',
        px: 1,
        flexGrow: 0
      }}>
      <Typography variant='body2' color='textSecondary' sx={{ px: 2, py: 1 }}>
        {t('buttons.filterHelpText')}
      </Typography>
      {filterOptions.map(filter => (
        <MenuAction
          key={filter.label}
          text={filter.label}
          selected={filter.value === selected}
          id={`filter-option__${filter.value}`}
          handler={changeSelectedOption}
        />
      ))}
    </DropdownMenu>
  )
}
