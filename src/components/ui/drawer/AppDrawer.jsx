import { useCallback, useRef, Suspense, lazy, useMemo } from 'preact/compat'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ProfileButton from '@components/reusable/buttons/ProfileButton'
import DrawerActions from './components/DrawerActions'
import Toolbar from './components/Toolbar'
import Divider from '@mui/material/Divider'

const ProjectNavFolder = lazy(() => import('./components/ProjectNavFolder'))

import { useParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import useApp from '@hooks/useApp'
import useLayout from '@hooks/useLayout'
import useLoadResources from '@hooks/useLoadResources'

import { DRAWER_CONFIG } from '@/constants'

import { getItem } from '@utils/storage.js'
import gsap from 'gsap'

import '@styles/components/drawer.css'
import { isDrawerOpen } from '@stores/ui'

export default function AppDrawer() {
  const { isMobile } = useApp()
  const { projectId } = useParams()
  const { drawerRef, toggleDrawer, isPreview } = useLayout()
  const drawerOpen = isDrawerOpen.value

  const loadingResources = useLoadResources('ui')
  const shadowWithAppbar = (projectId && !isMobile) || isPreview

  // trigger when dependencies change (for temporary drawer initial animation)
  useGSAP(() => {
    if (loadingResources) return

    toggleDrawer(getItem('drawerOpen'))
  }, { dependencies: [loadingResources, isMobile], scope: drawerRef })

  const drawerWidth = DRAWER_CONFIG[drawerOpen ? 'widthOpen' : 'widthClosed']

  const memoizedSlotProps = useMemo(() => {
    return {
      paper: { 
        ref: drawerRef, 
        className: 'app-drawer-paper flex flex-column'
      },
      root: { keepMounted: true }
    }
  }, [isMobile])

  return (
    <Drawer
      style={{
        '--drawer-width': `${drawerWidth}px`,
        '--drawer-shadow': shadowWithAppbar 
          ? 'var(--mui-palette-shadows-drawer-withAppbar)' 
          : 'var(--mui-palette-shadows-drawer-solo)'
      }}
      data-state={drawerOpen ? 'open' : 'closed'}
      slotProps={memoizedSlotProps}
      open={drawerOpen}
      onClose={() => toggleDrawer(false, isMobile)}
      variant={isMobile ? 'temporary' : 'permanent'}>
      <Toolbar />

      <List
        className='flex flex-column app-drawer-list'
        disablePadding>
        <DrawerActions />

        {projectId && (
          <>
            <Divider className='app-drawer-divider' role='none' />
            <Suspense fallback={null}>
              <ProjectNavFolder />
            </Suspense>
          </>
        )}

        <Box
          className='flex flex-column app-drawer-profile-container'
          component='li'>
          <ProfileButton
            showTexts
            className='app-drawer-profile-btn flex drawer-action'
            tooltipPosition='right'
          />
        </Box>
      </List>
    </Drawer>
  )
}
