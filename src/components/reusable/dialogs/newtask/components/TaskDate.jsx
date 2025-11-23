import OptionalSelector from '@components/reusable/selectors/OptionalSelector'
import MenuItem from '@mui/material/MenuItem'

import getDateItems from '@utils/tasks/getDateItems'

import upperCaseInitialLetter from '@utils/upperCaseInitialLetter.js'

import { DATES } from '@/constants'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const getDate = date => (!DATES.includes(date) ? 'nodate' : date)

export default function TaskDate({ date, setDate }) {
  const { t } = useTranslation('dialogs')

  return (
    <OptionalSelector
      labelId='select-date'
      defaultOption='nodate'
      handler={e => setDate(getDate(e.target.value))}
      label={upperCaseInitialLetter(date)}
      title={t('newtask.taskDateLabel')}
      value={date}>
      {getDateItems()}
    </OptionalSelector>
  )
}
