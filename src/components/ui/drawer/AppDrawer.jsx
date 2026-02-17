import { useCallback, useRef } from 'react'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ProfileButton from '@components/reusable/buttons/ProfileButton'
import DrawerActions from './components/DrawerActions'
import Toolbar from './components/Toolbar'

import { useParams, useNavigate } from 'react-router-dom'
import { useTheme, alpha } from '@mui/material/styles'
import { useGSAP } from '@gsap/react'
import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import useLayout from '@hooks/useLayout'
import useLoadResources from '@hooks/useLoadResources'

import { setItem } from '@utils/storage.js'
import gsap from 'gsap'

const drawerPaperStyles = (open, width, shadow) => ({
  width: open ? width.open : width.closed,
  transition: 'none',
  overflow: 'hidden',
  ...(!open && { boxShadow: shadow })
})

export default function AppDrawer({ children }) {
  const { drawerWidth, appBarHeight, isMobile } = useApp()
  const { preferences } = useUser()
  const { projectId } = useParams()
  const { drawerOpen, setDrawerOpen } = useLayout()
  const theme = useTheme()
  const navigate = useNavigate()
  const drawerRef = useRef(null)

  const loadingResources = useLoadResources('ui')

  const userTheme = preferences?.theme || 'dark'
  const shadowColor = theme.palette.grey[userTheme === 'light' ? 300 : 800]
  const shadow = `0 ${projectId && !isMobile ? appBarHeight : 0} 3px ${shadowColor}`

  const toggleDrawer = useCallback((state) => {
    setDrawerOpen(prev => {
      const newState = typeof state === 'boolean' ? state : !prev
      setItem('drawerOpen', newState)
      return newState
    })
  }, [])

  // initial enter animation
  useGSAP(() => {
    if (loadingResources) return

    const isOpening = drawerOpen
    const targetWidth = isOpening ? drawerWidth.open : drawerWidth.closed
    const labels = ['.nav-action-text', '.profile-btn-text']
    const icons = '.drawer-action .MuiSvgIcon-root'

    const tl = gsap.timeline({
      defaults: {
        ease: 'expo.inOut',
        duration: 0.5,
        overwrite: 'auto'
      }
    })

    tl.to('.MuiDrawer-paper', {
      width: targetWidth,
      duration: 0.4,
      ease: 'power3.out'
    }).addLabel('items')

    if (isOpening) {
      tl.fromTo(icons,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, stagger: 0.05 }, 'items')

        .fromTo(labels,
          { x: -15, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.075 }, 'items-=0.2')
    } else {
      tl.to(labels,
        { opacity: 0, x: -15, duration: 0.15, stagger: 0.03 }, 'items-=0.4')
        .to(icons, { x: 0, opacity: 1, duration: 0.3 }, 'items')
    }
  }, { scope: drawerRef, dependencies: [drawerOpen, loadingResources] })

  if (loadingResources) return

  return (
    <Drawer
      open={drawerOpen}
      onClose={() => toggleDrawer(false)}
      variant='permanent'
      ref={drawerRef}
      sx={{
        display: 'flex',
        textWrap: 'nowrap',
        width: drawerOpen ? drawerWidth.open : drawerWidth.closed,
        '& .MuiDrawer-paper': drawerPaperStyles(drawerOpen, drawerWidth, shadow)
      }}
    >
      <Toolbar open={drawerOpen} toggleDrawer={toggleDrawer} />

      <List
        className='flex flex-column'
        sx={{ gap: 1.25, height: '100%' }}
        disablePadding>
        <DrawerActions open={drawerOpen} toggleDrawer={toggleDrawer} />

        <Box className='flex flex-column' mt='auto' gap={1.5}>
          <ProfileButton
            open={drawerOpen}
            showTexts
            className='drawer-action'
            onClick={() => navigate('/profile')}
            sx={{
              p: 1.5,
              mr: drawerOpen ? 0 : 'auto',
              justifyContent: drawerOpen ? 'start' : 'center',
              maxWidth: '100%'
            }}
            tooltipPosition='right'
          />
        </Box>
      </List>
    </Drawer>
  )
}
