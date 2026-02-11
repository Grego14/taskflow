import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'

export default function DrawerAction(props) {
  const { text, icon, open, active, showText, ...other } =
    props

  const listItem = (
    <ListItemButton
      sx={theme => ({
        px: 2.5,
        backgroundColor: `${active ? theme.palette.action.hover : 'transparent'}`
      })}
      {...other}>
      <ListItemIcon
        sx={[
          theme => ({
            minWidth: 0,
            mr: open ? 1 : 0,
            ml: open ? 0 : showText ? 0.25 : 0,
            color: active ? theme.palette.primary.main : 'inherit'
          })
        ]}>
        {icon}
      </ListItemIcon>
      {showText && (
        <ListItemText
          primary={text}
          slotProps={{
            primary: {
              fontSize: 'var(--fs-small, .9rem)'
            }
          }}
          sx={[
            theme => ({
              my: 0,
              opacity: open ? 1 : 0,
              color: active ? theme.palette.primary.main : 'inherit'
            })
          ]}
        />
      )}
    </ListItemButton>
  )

  return (
    <ListItem
      className='flex drawer-action'
      key={text}
      disablePadding
      sx={{ width: !showText ? 'fit-content' : '100%' }}>
      <Tooltip title={text} placement='right'>
        {listItem}
      </Tooltip>
    </ListItem>
  )
}
