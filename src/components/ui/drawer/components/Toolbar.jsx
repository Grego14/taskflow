import { Suspense, lazy, memo, useEffect, useState } from 'react'

// components
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

const ToolbarSelect = lazy(() => import('./ToolbarSelect'))

// hooks
import useApp from '@hooks/useApp'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

// utils
import lazyImport from '@utils/lazyImport'

export default memo(function DrawerToolbar({ open, toggleDrawer }) {
  const { t } = useTranslation('ui')
  const { appBarHeight } = useApp()
  const [selectLoaded, setSelectLoaded] = useState(false)

  useEffect(() => {
    if (!selectLoaded && open) setSelectLoaded(true)
  }, [open, selectLoaded])

  return (
    <Box mb={2}>
      <Box
        className='flex flex-center'
        // remove the 1px of the divider
        minHeight={`calc(${appBarHeight} - 1px)`}
        px={1}>
        {selectLoaded && (
          <Suspense>
            <ToolbarSelect open={open} toggleDrawer={toggleDrawer} />
          </Suspense>
        )}

        <IconButton
          aria-label={t(`drawer.toolbar.${open ? 'collapse' : 'expand'}`)}
          onClick={() => toggleDrawer(!open)}
          sx={{ ml: open ? 'auto' : 0 }}>
          {open ? (
            <ChevronLeftIcon fontSize='small' />
          ) : (
            <MenuIcon fontSize='small' />
          )}
        </IconButton>
      </Box>
      <Divider sx={{ display: 'block' }} />
    </Box>
  )
})
