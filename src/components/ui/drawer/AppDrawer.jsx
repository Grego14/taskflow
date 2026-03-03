import { useCallback, useRef, Suspense, lazy } from 'react'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ProfileButton from '@components/reusable/buttons/ProfileButton'
import DrawerActions from './components/DrawerActions'
import Toolbar from './components/Toolbar'
import Divider from '@mui/material/Divider'

const ProjectNavFolder = lazy(() => import('./components/ProjectNavFolder'))

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
  ...(!open && { boxShadow: shadow }),
  backgroundImage: 'none'
})

export default function AppDrawer() {
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

  const { contextSafe } = useGSAP({ scope: drawerRef })

  const animateDrawer = contextSafe((isOpening) => {
    if (!drawerRef.current) return

    const targetWidth = isOpening ? drawerWidth.open : drawerWidth.closed
    const labels = ['.nav-action-text']
    const allIcons = gsap.utils.toArray('.drawer-action .MuiSvgIcon-root')

    if (projectId) labels.push('.nav-folder-text')
    labels.push('.profile-btn-text')

    // get the icons that aren't inside the Collapse container
    const icons = allIcons.filter(icon => !icon.closest('.MuiCollapse-root'))
    icons.push('.profile-btn-avatar')

    const tl = gsap.timeline({
      defaults: {
        ease: 'expo.inOut',
        duration: 0.5,
        overwrite: 'auto'
      }
    })

    if (!isMobile) {
      tl.to(drawerRef.current, {
        width: targetWidth,
        duration: 0.4,
        ease: 'power3.out'
      }).addLabel('items')
    }

    if (isOpening) {
      tl.fromTo(icons,
        { opacity: 0, x: -8, scale: 0.8 },
        { opacity: 1, x: 0, scale: 1, stagger: 0.05 }, 'items')
        .fromTo(labels,
          { x: -15, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.075 }, 'items-=0.2')
    } else {
      tl.to(labels,
        { opacity: 0, x: -15, duration: 0.15, stagger: 0.03 }, 'items-=0.4')
        .to(icons, { x: 0, opacity: 1, scale: 1, duration: 0.3 }, 'items')
    }
  })

  // trigger animation when dependencies change (for permanent drawer)
  useGSAP(() => {
    if (loadingResources || isMobile) return

    animateDrawer(drawerOpen)
  }, {
    dependencies: [drawerOpen, loadingResources, projectId],
    scope: drawerRef
  })

  const toggleDrawer = useCallback((state) => {
    setDrawerOpen(prev => {
      const newState = typeof state === 'boolean' ? state : !prev
      setItem('drawerOpen', newState)
      return newState
    })
  }, [])

  if (isMobile && !projectId || loadingResources) return

  return (
    <Drawer
      slotProps={{
        paper: {
          ref: drawerRef,
          sx: {
            display: 'flex',
            textWrap: 'nowrap',
            width: drawerOpen ? drawerWidth.open : drawerWidth.closed,
            '& .MuiDrawer-paper': drawerPaperStyles(drawerOpen, drawerWidth, shadow),
            overflowX: 'hidden'
          }
        },
        transition: {
          // this ensures animation runs when the temporary drawer mounts
          onEnter: () => isMobile && animateDrawer(true)
        }
      }}
      open={drawerOpen}
      onClose={() => toggleDrawer(false)}
      variant={isMobile ? 'temporary' : 'permanent'}
    >
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
            onClick={() => navigate('/profile')}
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
