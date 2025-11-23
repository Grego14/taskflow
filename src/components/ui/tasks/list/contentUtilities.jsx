import i18n from '@/i18n'
import ListItemButton from '@mui/material/ListItemButton'
import { alpha } from '@mui/material/styles'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter'

const getMenuItemStyles = (isSelected, color, insideTask) => [
  isSelected && {
    '&.Mui-selected': { backgroundColor: color.bg, color: color.fg },
    '&.Mui-selected:hover': {
      backgroundColor: alpha(color.bg, 0.65)
    }
  },
  { fontSize: `var(--fs-${insideTask ? 'tiny' : 'small'})` }
]

export const getButtonStyles = props => {
  const { isArchived, bg, fg, subtask } = props

  return {
    backgroundColor: isArchived ? 'inherit' : bg,
    color: isArchived ? 'inherit' : fg,
    '&:hover': { backgroundColor: alpha(props.bg, 0.65) },
    fontWeight: 'medium',
    fontSize: props.subtask ? '.65rem' : '.725rem',
    py: 0.5,
    px: 1.25,
    borderRadius: 0
  }
}

export const renderMenu = (options, selected, colors, event, insideTask) => {
  const t = i18n.getFixedT(i18n.language, 'ui')

  return options.map(option => {
    const [fg, bg] = colors[option]
    const isSelected = selected === option

    return (
      <ListItemButton
        onClick={event}
        sx={getMenuItemStyles(isSelected, { fg, bg }, insideTask)}
        key={option}
        selected={isSelected}
        id={`menu__${option}`}>
        {upperCaseInitialLetter(t(`tasks.priorities.${option}`))}
      </ListItemButton>
    )
  })
}
