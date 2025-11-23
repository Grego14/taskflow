import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useTheme } from '@mui/material/styles'

export default function MenuAction(props) {
  const { handler, text, icon, styles, ...other } = props
  const theme = useTheme()

  return (
    <ListItemButton
      onClick={handler}
      sx={typeof styles === 'function' ? styles(theme) : styles}
      {...other}>
      {icon && <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>{icon}</ListItemIcon>}
      <ListItemText
        primary={text}
        disableTypography
        sx={{ fontSize: theme.typography.body2.fontSize }}
      />
    </ListItemButton>
  )
}
