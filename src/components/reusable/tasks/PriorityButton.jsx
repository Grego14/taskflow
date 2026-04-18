import { styled, alpha, darken, lighten } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { priorityColors } from '@/constants'

const PriorityButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'priority' 
    && prop !== 'isArchived'
})(({ theme, priority = 'none', isArchived }) => {
  const [fg, bg] = priorityColors[priority]

  return {
    alignItems: 'center',
    justifyContent: 'start',
    fontWeight: 500,
    py: 0.94,
    px: 2,
    borderRadius: '4px',
    width: '100%',
    textTransform: 'none',
    
    backgroundColor: isArchived ? 'transparent' : alpha(bg, 0.15),
    border: `1px solid ${alpha(fg, 0.3)}`,
    color: isArchived ? theme.palette.text.secondary : darken(fg, 0.4),

    ...theme.applyStyles('dark', {
      backgroundColor: alpha(bg, 0.1),
      color: lighten(fg, 0.3),
      borderColor: alpha(fg, 0.4)
    }),

    '&:hover': {
      backgroundColor: alpha(bg, 0.4),
      ...theme.applyStyles('dark', { 
        backgroundColor: alpha(bg, 0.2) 
      })
    }
  }
})

export default PriorityButton
