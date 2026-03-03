import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { alpha, darken, lighten } from '@mui/material/styles'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter'
import { priorities, priorityColors } from '@/constants'
import i18n from '@/i18n'

export const getPriorityStyles = (theme, { fg, bg, isArchived }) => ({
  alignItems: 'center',
  justifyContent: 'start',
  backgroundColor: isArchived ? 'transparent' : alpha(bg, 0.15),
  border: `1px solid ${alpha(fg, 0.3)}`,
  color: isArchived ? 'text.secondary' : darken(fg, 0.4),
  ...(theme.applyStyles('dark', {
    backgroundColor: alpha(bg, 0.1),
    color: lighten(fg, 0.3),
    borderColor: alpha(fg, 0.4)
  })),
  '&:hover': {
    backgroundColor: alpha(bg, 0.4),
    ...(theme.applyStyles('dark', { backgroundColor: alpha(bg, 0.2) }))
  },
  fontWeight: 500,
  py: 0.94,
  px: 2,
  borderRadius: '4px',
  width: '100%'
})

export const getMenuItemStyles = (isSelected, color) => [
  {
    color: 'inherit',
    '& .MuiListItemIcon-root': { color: color.fg }
  },
  isSelected && {
    '&.Mui-selected': {
      backgroundColor: alpha(color.bg, 0.2),
      color: color.fg,
      fontWeight: 'bold'
    },
    '&.Mui-selected:hover': {
      backgroundColor: alpha(color.bg, 0.4)
    }
  }
]

export const renderPriorityMenu = (selected, onSelect, t) => {
  const items = []

  for (const option of priorities) {
    const [fg, bg] = priorityColors[option]
    const isSelected = selected === option

    items.push(
      <ListItemButton
        onClick={() => onSelect(option)}
        sx={getMenuItemStyles(isSelected, { fg, bg })}
        key={option}
        selected={isSelected}>
        <ListItemIcon sx={{
          minWidth: 32,
          color: isSelected ? 'inherit' : fg,
          '& svg': { fontSize: '1.2rem' }
        }}>
          <PriorityHighIcon />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{
            variant: 'body2',
            fontWeight: isSelected ? 600 : 400
          }}
          primary={upperCaseInitialLetter(t(`priorities.${option}`))}
        />
      </ListItemButton>
    )
  }

  return items
}
export const getPriorityLabel = (priority) => {
  const t = i18n.getFixedT(i18n.language, 'tasks')
  const isEnglish = i18n.language === 'en'
  const isNone = priority === 'none'

  const rawText = t(`priorities.${isNone ? 'noPriority' : priority}`)
  const label = isNone
    ? upperCaseInitialLetter(rawText)
    : t('priorities.priority_p', {
      p: isEnglish ? upperCaseInitialLetter(rawText) : rawText
    })

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <PriorityHighIcon sx={{ fontSize: '1rem', mr: 1 }} />
      <Typography variant='body2' sx={{ my: 0.5 }}>{label}</Typography>
    </Box>
  )
}
