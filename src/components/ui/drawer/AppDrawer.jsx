import { memo, useCallback } from 'react'

// components
import ProfileButton from '@components/reusable/buttons/ProfileButton'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import DrawerActions from './components/DrawerActions'
import Toolbar from './components/Toolbar'

// hooks
import useApp from '@hooks/useApp'
import useNotifications from '@hooks/useNotifications'
import useUser from '@hooks/useUser'
import { useTheme } from '@mui/material/styles'
import { useParams } from 'react-router-dom'

// utils
import { setItem } from '@utils/storage.js'

export default memo(function AppDrawer({ open, setOpen, children }) {
  const { drawerWidth, appBarHeight, isMobile } = useApp()
  const { preferences, metadata } = useUser()
  const { projectId } = useParams()
  const userTheme = preferences?.theme
  const theme = useTheme()

  const { notifications } = useNotifications()

  const easing = theme.transitions.easing.sharp
  const shadowColor = theme.palette.grey[userTheme === 'light' ? 300 : 800]
  const shadow = `0 ${projectId && !isMobile ? appBarHeight : 0} 3px ${shadowColor}`

  console.log(preferences)

  const toggleDrawer = useCallback(
    state => {
      setOpen(state)
      setItem('drawerOpen', state)
    },
    [setOpen]
  )

  const profileBtnProps = {
    open,
    showTexts: true,
    sx: {
      p: 1.5,
      // avoid moving the badge to the center when the username is removed
      mr: open ? 0 : 'auto',
      mt: 'auto',
      justifyContent: open ? 'start' : 'center'
    },
    tooltipPosition: 'right'
  }

  return (
    <Drawer
      open={open}
      onClose={() => toggleDrawer(false)}
      variant='permanent'
      ModalProps={{
        disablePortal: true
      }}
      sx={{
        display: 'flex',
        textWrap: 'nowrap',
        '& .MuiDrawer-paper': {
          width: drawerWidth?.[open ? 'open' : 'closed'],
          overflowX: 'hidden',
          transition: `width 0.15s ${easing}`,
          ...(!open && { boxShadow: shadow })
        }
      }}>
      <Toolbar open={open} toggleDrawer={toggleDrawer} />

      <List
        className='flex flex-column'
        sx={{ gap: 1.5, height: '100%' }}
        disablePadding>
        <DrawerActions open={open} toggleDrawer={toggleDrawer} />
        <ProfileButton {...profileBtnProps} />
      </List>
    </Drawer>
  )
})
