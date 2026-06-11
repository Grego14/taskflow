import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import useApp from '@hooks/useApp'
import useLayout from '@hooks/useLayout'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'

import ToolbarSelect from './ToolbarSelect'

import { APPBAR_HEIGHT } from '@/constants'
import { isDrawerOpen } from '@stores/ui'

export default function DrawerToolbar() {
  const { isMobile } = useApp()
  const { t } = useTranslation('ui')
  const { toggleDrawer } = useLayout()
  const drawerOpen = isDrawerOpen.value

  const currentBarHeight = APPBAR_HEIGHT[isMobile ? 'mobile' : 'other']

  return (
    <div className='app-drawer-toolbar-wrapper'>
      <div
        className='app-drawer-toolbar flex flex-center'
        style={{ '--appbar-height': currentBarHeight }}>
        <ToolbarSelect />

        <IconButton
          className='toggle-drawer-btn'
          aria-label={t(`drawer.toolbar.${drawerOpen ? 'collapse' : 'expand'}`)}
          onClick={() => toggleDrawer(!drawerOpen, isMobile)}>
          <ChevronLeftIcon fontSize='small' className='collapse'/>
          <MenuIcon fontSize='small' className='expand' />
        </IconButton>
      </div>
      <Divider className='app-drawer-toolbar-divider' />
    </div>
  )
}
