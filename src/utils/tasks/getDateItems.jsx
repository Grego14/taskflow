import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'

import { DATES } from '@/constants'
import i18n from '@/i18n'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter.js'

const getDateTranslation = date => {
  const t = i18n.getFixedT(i18n.language, 'dialogs')
  return t(`newtask.dates.${date}`)
}
// rawDate is the task date without the conversion (one of the DATES array)
export default function getDateItems(rawDate, list = false) {
  return DATES.map(date => {
    const text = upperCaseInitialLetter(getDateTranslation(date))

    if (list)
      return (
        // ListItemButton renders a div instead of a button so we use data-value
        // instead of value otherwise it will not work
        <ListItemButton
          key={date}
          data-value={date}
          selected={date === rawDate}>
          <ListItemText>{text}</ListItemText>
        </ListItemButton>
      )

    return (
      <MenuItem key={date} value={date} selected={date === rawDate}>
        {text}
      </MenuItem>
    )
  })
}
