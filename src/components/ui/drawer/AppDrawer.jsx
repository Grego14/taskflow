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
  const { drawerRef, toggleDrawer, drawerOpen } = useLayout()
  const theme = useTheme()

  const loadingResources = useLoadResources('ui')

  const isLight = theme.palette.mode === 'light'
  const shadowColor = theme.palette.grey[isLight ? 300 : 800]
  const isProjectAndDesktop = projectId && !isMobile
  const shadow = `0 ${isProjectAndDesktop ? APPBAR_HEIGHT.other : 0} 3px ${shadowColor}`

  // trigger animation when dependencies change (for permanent drawer, or
  // initial animation)
  useGSAP(() => {
    if (loadingResources || isMobile) return

    toggleDrawer(getItem('drawerOpen'))
  }, { dependencies: [loadingResources, projectId], scope: drawerRef })

  if (isMobile && !projectId || loadingResources) return

  const drawerWidth = DRAWER_CONFIG[drawerOpen ? 'widthOpen' : 'widthClosed']

  return (
    <Drawer
      slotProps={{
        paper: {
          ref: drawerRef,
          className: drawerOpen ? 'is-open' : 'is-closed',
          sx: theme => ({
            display: 'flex',
            textWrap: 'nowrap',
            width: drawerWidth,
            ...(!drawerOpen && { boxShadow: shadow }),
            backgroundImage: theme.palette.background.drawer,
            overflowX: 'hidden',
            transition: theme.transitions.create(['transform', 'width'],
              { duration: '0.3s', easing: 'ease-in-out' })
          })
        },
        transition: {
          // this ensures animation runs when the temporary drawer mounts
          onEnter: () => { console.log('enter drawer animation'), toggleDrawer(true) }
        }
      }}
      open={drawerOpen}
      onClose={() => toggleDrawer(false)}
      variant={isMobile ? 'temporary' : 'permanent'}>
      <Toolbar />

      <List
        className='flex flex-column'
        sx={{ gap: 1.25, height: '100%' }}
        disablePadding>
        <DrawerActions />

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
