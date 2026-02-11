import { memo, useCallback } from 'react'

// components
import ProfileButton from '@components/reusable/buttons/ProfileButton'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import DrawerActions from './components/DrawerActions'
import Toolbar from './components/Toolbar'
import Notifications from './components/Notifications'

// hooks
import useApp from '@hooks/useApp'
import useNotifications from '@hooks/useNotifications'
import useUser from '@hooks/useUser'
import { useTheme } from '@mui/material/styles'
import { useParams, useNavigate } from 'react-router-dom'
import { useRef } from 'preact/hooks'
import { useGSAP } from '@gsap/react'

// utils
import { setItem } from '@utils/storage.js'
import gsap from 'gsap'

// Helper to calculate shadow outside to keep component clean
const getDrawerShadow = (projectId, isMobile, appBarHeight, theme, userTheme) => {
  const shadowColor = theme.palette.grey[userTheme === 'light' ? 300 : 800]
  return `0 ${projectId && !isMobile ? appBarHeight : 0} 3px ${shadowColor}`
}

export default memo(function AppDrawer({ open, setOpen, children }) {
  const { drawerWidth, appBarHeight, isMobile } = useApp()
  const { preferences } = useUser()
  const { projectId } = useParams()
  const theme = useTheme()
  const navigate = useNavigate()
  const drawerRef = useRef(null)

  const shadow = getDrawerShadow(projectId, isMobile, appBarHeight, theme, preferences?.theme)

  const { notifications } = useNotifications()

  const toggleDrawer = useCallback(
    state => {
      setOpen(state)
      setItem('drawerOpen', state)
    },
    [setOpen]
  )

  // initial enter animation
  useGSAP(() => {
    gsap.from('.MuiDrawer-paper', {
      autoAlpha: 0,
      x: -drawerWidth[open ? 'open' : 'closed']
    })
  }, { scope: drawerRef })

  useGSAP(() => {
    const isOpening = open
    const targetWidth = isOpening ? drawerWidth.open : drawerWidth.closed
    const _labels = gsap.utils.toArray('.MuiListItemText-root')
    const labels = [..._labels, '.profile-btn-text']

    gsap.set('.profile-btn-text', { opacity: 0 })

    const tl = gsap.timeline({
      defaults: { ease: 'expo.inOut', overwrite: 'auto', duration: 0.5 }
    })

    tl.to('.MuiDrawer-paper', {
      width: targetWidth,
      duration: 0.4,
      ease: 'power3.out'
    }).addLabel('items')

    if (isOpening) {
      tl.fromTo('.drawer-action .MuiListItemIcon-root',
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, stagger: 0.05 },
        'items'
      )

      tl.fromTo(labels,
        { x: -15, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.075 },
        'items-=0.2'
      )
    } else {
      tl.to(labels, {
        opacity: 0,
        x: -15,
        duration: 0.15,
        stagger: 0.03
      }, 'items-=0.4')

      tl.to('.drawer-action .MuiListItemIcon-root', {
        x: 0,
        opacity: 1,
        duration: 0.3
      }, 'items')
    }
  }, { scope: drawerRef, dependencies: [open] })

  const profileBtnProps = {
    open,
    showTexts: true,
    sx: {
      p: 1.5,
      // avoid moving the badge to the center when the username is removed
      mr: open ? 0 : 'auto',
      justifyContent: open ? 'start' : 'center'
    },
    tooltipPosition: 'right',
    onClick: () => navigate('/profile'),
    className: 'drawer-action'
  }

  return (
    <Drawer
      open={open}
      onClose={() => toggleDrawer(false)}
      variant='permanent'
      ModalProps={{
        disablePortal: true
      }}
      ref={drawerRef}
      sx={{
        display: 'flex',
        textWrap: 'nowrap',
        width: open ? drawerWidth.open : drawerWidth.closed,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth.open : drawerWidth.closed,
          transition: 'none',
          overflow: 'hidden',
          ...(!open && { boxShadow: shadow })
        }
      }}>
      <Toolbar open={open} toggleDrawer={toggleDrawer} />

      <List
        className='flex flex-column'
        sx={{ gap: 1.25, height: '100%' }}
        disablePadding>
        <DrawerActions open={open} toggleDrawer={toggleDrawer} />

        <Box className='flex flex-column' mt='auto' gap={1.5}>
          <Notifications open={open} />
          <ProfileButton {...profileBtnProps} />
        </Box>
      </List>
    </Drawer>
  )
})
