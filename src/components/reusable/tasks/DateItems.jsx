import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'

import { DATES } from '@/constants'
import i18n from '@/i18n'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter.js'

const getTranslatedText = (date) => {
  const t = i18n.getFixedT(i18n.language, 'dialogs')
  return upperCaseInitialLetter(t(`newtask.dates.${date}`))
}

export default function DateItems({
  currentDate,
  isList = false,
  onItemClick
}) {
  return DATES.map(date => {
    const text = getTranslatedText(date)
    const isSelected = date === currentDate

    const handleClick = () => onItemClick?.(date)
    const color = isSelected ? 'secondary.main' : 'text.primary'

    if (isList) {
      return (
        <ListItemButton
          key={date}
          onClick={handleClick}
          selected={isSelected}>
          <ListItemText
            slotProps={{
              primary: {
                sx: [theme => ({
                  ...theme.typography.body2,
                  color
                })]
              }
            }}>
            {text}
          </ListItemText>
        </ListItemButton>
      )
    }

    return (
      <MenuItem
        sx={[theme => ({ ...theme.typography.body2, color })]}
        key={date}
        onClick={handleClick}
        selected={isSelected}>
        {text}
      </MenuItem>
    )
  })
}
