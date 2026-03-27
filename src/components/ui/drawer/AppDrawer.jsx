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
  const { drawerRef, toggleDrawer, drawerOpen, isPreview } = useLayout()
  const theme = useTheme()

  const loadingResources = useLoadResources('ui')
  const shadowWithAppbar = (projectId && !isMobile) || isPreview

  // trigger when dependencies change (for temporary drawer initial animation)
  useGSAP(() => {
    if (loadingResources) return

    const timer = requestAnimationFrame(() => toggleDrawer(
      getItem('drawerOpen')
    ))

    return () => cancelAnimationFrame(timer)
  }, { dependencies: [loadingResources, projectId, isMobile], scope: drawerRef })

  const drawerWidth = DRAWER_CONFIG[drawerOpen ? 'widthOpen' : 'widthClosed']

  return (
    <Drawer
      slotProps={{
        paper: {
          ref: drawerRef,
          className: `${drawerOpen ? 'is-open' : 'is-closed'} 
          ${isMobile ? 'is-temporary' : ''}`,
          sx: theme => ({
            willChange: 'width',
            display: 'flex',
            textWrap: 'nowrap',
            width: drawerWidth,
            backgroundImage: theme.palette.background.drawer,
            overflow: 'hidden',
            transition: 'none',
            translate: `-${drawerWidth}px`,
            '&.is-closed': {
              boxShadow:
                theme.palette.shadows.drawer[shadowWithAppbar
                  ? 'withAppbar' : 'solo']
            }
          })
        },
        root: { keepMounted: true }
      }}
      open={drawerOpen}
      onClose={() => toggleDrawer(false, isMobile)}
      variant={isMobile ? 'temporary' : 'permanent'}>
      <Toolbar />

      <List
        className='flex flex-column'
        sx={{ gap: 1.25, height: '100%' }}
        disablePadding>
        <DrawerActions />

        {projectId && (
          <>
            <Divider sx={{ my: 1, opacity: 0.8, mx: 1 }} role='none' />
            <Suspense fallback={null}>
              <ProjectNavFolder />
            </Suspense>
          </>
        )}

        <Box
          className='flex flex-column'
          mt='auto'
          gap={1.5}
          minHeight='10rem'
          component='li'>
          <ProfileButton
            showTexts
            className='drawer-action'
            sx={{
              p: 1.5,
              mr: 'auto',
              justifyContent: 'center',
              maxWidth: '100%',
              mt: 'auto',

              '.is-open &': {
                justifyContent: 'start',
                mr: 0
              }
            }}
            tooltipPosition='right'
          />
        </Box>
      </List>
    </Drawer>
  )
}
