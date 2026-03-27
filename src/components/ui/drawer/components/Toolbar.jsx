import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import useApp from '@hooks/useApp'
import useLayout from '@hooks/useLayout'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'

const ToolbarSelect = lazy(() => import('./ToolbarSelect'))

import { APPBAR_HEIGHT } from '@/constants'

export default function DrawerToolbar({ open }) {
  const { isMobile } = useApp()
  const { t } = useTranslation('ui')
  const { toggleDrawer, drawerOpen } = useLayout()

  return (
    <Box mb={2}>
      <Box
        className='flex flex-center'
        sx={{
          minHeight:
            `calc(${(APPBAR_HEIGHT[isMobile ? 'mobile' : 'other'])} - 1px)`,
          px: 1
        }}>
        <Suspense fallback={null}>
          <ToolbarSelect />
        </Suspense>

        <IconButton
          className='toggle-drawer-btn'
          aria-label={t(`drawer.toolbar.${drawerOpen ? 'collapse' : 'expand'}`)}
          onClick={() => toggleDrawer(!drawerOpen, isMobile)}
          sx={{ ml: 0, '.is-open &': { ml: 'auto' } }}>
          <ChevronLeftIcon fontSize='small' sx={{ '.is-closed &': { display: 'none' } }} />
          <MenuIcon fontSize='small' sx={{ '.is-open &': { display: 'none' } }} />
        </IconButton>
      </Box>
      <Divider sx={{ display: 'block' }} />
    </Box>
  )
}
