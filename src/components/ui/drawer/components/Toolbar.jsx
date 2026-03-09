import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import useApp from '@hooks/useApp'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'

const ToolbarSelect = lazy(() => import('./ToolbarSelect'))

import { APPBAR_HEIGHT } from '@/constants'

export default function DrawerToolbar({ open, toggleDrawer }) {
  const { isMobile } = useApp()
  const { t } = useTranslation('ui')

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
          <ToolbarSelect open={open} toggleDrawer={toggleDrawer} />
        </Suspense>

        <IconButton
          aria-label={t(`drawer.toolbar.${open ? 'collapse' : 'expand'}`)}
          onClick={toggleDrawer}
          sx={{ ml: open ? 'auto' : 0 }}>
          {open ? <ChevronLeftIcon fontSize='small' /> : <MenuIcon fontSize='small' />}
        </IconButton>
      </Box>
      <Divider sx={{ display: 'block' }} />
    </Box>
  )
}
