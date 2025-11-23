import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import useApp from '@hooks/useApp'

export default function ContentAction(props) {
  const { isOnlyMobile } = useApp()
  const { insideTask, icon, text, color, ...other } = props
  // same as the update priority menu styles from the getButtonStyles
  // utility
  const buttonsFs = insideTask ? '.65rem' : '.75rem'
  const buttonsTypography = insideTask ? 'caption' : 'body2'

  const buttonSx = [
    theme => ({
      ...theme.typography[buttonsTypography],
      fontSize: buttonsFs
    })
  ]

  return isOnlyMobile ? (
    <Tooltip title={text}>
      <IconButton color={color} aria-label={text} {...other} sx={buttonSx}>
        {icon}
      </IconButton>
    </Tooltip>
  ) : (
    <Button startIcon={icon} color={color} {...other} sx={buttonSx}>
      {text}
    </Button>
  )
}
