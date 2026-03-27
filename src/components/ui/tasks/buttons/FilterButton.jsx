import DropdownMenu from '@/components/reusable/DropdownMenu'
import MenuAction from '@components/reusable/MenuAction'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import Typography from '@mui/material/Typography'

import useUser from '@hooks/useUser'
import { getItem } from '@utils/storage.js'
import { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'

import i18n from '@/i18n'
import getMenuLabel from '@utils/getMenuLabel'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter'

import { FILTERS } from '@/constants'

const getFilterLabel = (label, t) => {
  return upperCaseInitialLetter(
    // we pass the count: 1 to get the _one translation
    // the other special counts are used on the creation of the TasksWrappers
    // titles
    t(`buttons.filterOptions.${label}`, { count: 1 })
  )
}

export default function FilterButton() {
  const { metadata } = useUser()
  const { setFilter, updateFilter, filter } = useLayout()
  const { t } = useTranslation('tasks')
  const [selected, setSelected] = useState(filter)

  useEffect(() => {
    if (
      FILTERS.find(f => f === metadata?.lastUsedFilter) &&
      metadata?.lastUsedFilter !== selected
    ) {
      setSelected(metadata.lastUsedFilter)
    }
  }, [metadata])

  const changeSelectedOption = useCallback(
    (value, triggerExit) => {
      triggerExit()

      setSelected(value)
      setFilter(value)

      // update the db (if the user is logged)
      updateFilter(value)
    },
    [updateFilter, setFilter]
  )

  const filterOptions = FILTERS.map(f => ({
    label: getFilterLabel(f, t),
    value: f
  }))

  return (
    <DropdownMenu
      icon={<FilterAltIcon fontSize='medium' />}
      label={state => getMenuLabel(state, 'buttons.filter', 'tasks')}
      tooltipPosition='bottom'
      asListItem
      buttonStyles={{
        borderRadius: '50%',
        px: 1,
        flexGrow: 0
      }}
      slotProps={{ button: { className: 'hide-element' } }}>
      {(_, triggerExit) => (
        <>
          <Typography variant='body2' color='textSecondary' sx={{ px: 2, py: 1 }}>
            {t('buttons.filterHelpText')}
          </Typography>
          {filterOptions.map(filter => (
            <MenuAction
              key={filter.label}
              text={filter.label}
              selected={filter.value === selected}
              handler={() => changeSelectedOption(filter.value, triggerExit)}
            />
          ))}
        </>
      )}
    </DropdownMenu>
  )
}
