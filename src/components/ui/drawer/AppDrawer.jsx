import { useCallback, useRef, Suspense, lazy } from 'react'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ProfileButton from '@components/reusable/buttons/ProfileButton'
import DrawerActions from './components/DrawerActions'
import Toolbar from './components/Toolbar'
import Divider from '@mui/material/Divider'

const ProjectNavFolder = lazy(() => import('./components/ProjectNavFolder'))

import { useParams } from 'react-router-dom'
import { useTheme, alpha } from '@mui/material/styles'
import { useGSAP } from '@gsap/react'
import useApp from '@hooks/useApp'
import useLayout from '@hooks/useLayout'
import useLoadResources from '@hooks/useLoadResources'

import { DRAWER_CONFIG, APPBAR_HEIGHT } from '@/constants'

import { setItem, getItem } from '@utils/storage.js'
import gsap from 'gsap'

export default function AppDrawer() {
  const { isMobile } = useApp()
  const { projectId } = useParams()
  const { drawerOpen, setDrawerOpen, drawerGradient } = useLayout()
  const theme = useTheme()
  const drawerRef = useRef(null)

  const loadingResources = useLoadResources('ui')

  const isLight = theme.palette.mode === 'light'
  const shadowColor = theme.palette.grey[isLight ? 300 : 800]
  const isProjectAndDesktop = projectId && !isMobile
  const shadow = `0 ${isProjectAndDesktop ? APPBAR_HEIGHT.other : 0} 3px ${shadowColor}`

  const { contextSafe } = useGSAP({ scope: drawerRef })

  const animateDrawer = contextSafe((isOpening) => {
    if (!drawerRef.current) return

    setItem('drawerOpen', isOpening)

    const targetWidth = DRAWER_CONFIG[isOpening ? 'widthOpen' : 'widthClosed']
    const allIcons = gsap.utils.toArray('.drawer-action .MuiSvgIcon-root')
    const labels = ['.nav-action-text']

    if (projectId) labels.push('.nav-folder-text')
    labels.push('.profile-btn-text')

    allIcons.push('.profile-btn-avatar')

    const tl = gsap.timeline({
      defaults: {
        ease: 'expo.inOut',
        duration: 0.5,
        overwrite: 'auto'
      }
    })

    if (!isMobile) {
      tl.fromTo(drawerRef.current, { x: -targetWidth },
        {
          x: 0,
          width: targetWidth,
          duration: isOpening ? 0.25 : 0.15,
          ease: 'power2.out',
          overwrite: 'auto'
        })
        .addLabel('items')
    }

    if (isOpening) {
      return tl.fromTo(allIcons,
        { opacity: 0, x: -8, scale: 0.8 },
        { opacity: 1, x: 0, scale: 1, stagger: 0.05 }, 'items')
        .fromTo(labels,
          { x: -15, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.075 }, 'items-=0.2')
    }

    tl.to(labels,
      { opacity: 0, x: -15, duration: 0.15, stagger: 0.03 }, 'items-=0.4')
      .to(allIcons, { x: 0, opacity: 1, scale: 1, duration: 0.3 }, 'items')
  })

  // trigger animation when dependencies change (for permanent drawer)
  useGSAP(() => {
    if (loadingResources || isMobile) return

    animateDrawer(getItem('drawerOpen'))
  }, { dependencies: [loadingResources, projectId], scope: drawerRef })

  const toggleDrawer = useCallback((state) => {
    const stateExists = typeof state === 'boolean'
    const newValue = stateExists ? state : !drawerOpen

    animateDrawer(newValue)
    setDrawerOpen(newValue)
  }, [drawerOpen])

  if (isMobile && !projectId || loadingResources) return

  const drawerWidth = DRAWER_CONFIG[drawerOpen ? 'widthOpen' : 'widthClosed']

  return (
    <Drawer
      slotProps={{
        paper: {
          ref: drawerRef,
          sx: theme => ({
            display: 'flex',
            textWrap: 'nowrap',
            width: drawerWidth,
            ...(!open && { boxShadow: shadow }),
            backgroundImage: theme.palette.background.drawer,
            overflowX: 'hidden',
            transition: theme =>
              theme.transitions.create('width',
                { easing: theme.transitions.easing.easeInOut }
              )
          })
        },
        transition: {
          // this ensures animation runs when the temporary drawer mounts
          onEnter: () => isMobile && animateDrawer(true)
        }
      }}
      open={drawerOpen}
      onClose={() => toggleDrawer(false)}
      variant={isMobile ? 'temporary' : 'permanent'}>
      <Toolbar open={drawerOpen} toggleDrawer={toggleDrawer} />

      <List
        className='flex flex-column'
        sx={{ gap: 1.25, height: '100%' }}
        disablePadding>
        <DrawerActions open={drawerOpen} toggleDrawer={toggleDrawer} />

        {projectId && (
          <>
            <Divider sx={{ my: 1, opacity: 0.8, mx: 1 }} />
            <Suspense fallback={null}>
              <ProjectNavFolder />
            </Suspense>
          </>
        )}

        <Box className='flex flex-column' mt='auto' gap={1.5} minHeight='10rem'>
          <ProfileButton
            open={drawerOpen}
            showTexts
            className='drawer-action'
            sx={{
              p: 1.5,
              mr: drawerOpen ? 0 : 'auto',
              justifyContent: drawerOpen ? 'start' : 'center',
              maxWidth: '100%',
              mt: 'auto'
            }}
            tooltipPosition='right'
          />
        </Box>
      </List>
    </Drawer>
  )
}
