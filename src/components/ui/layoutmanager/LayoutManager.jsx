import Box from '@mui/material/Box'
import { Suspense, lazy, memo } from 'react'
import { Outlet, useParams } from 'react-router-dom'

const LayoutAppBar = lazy(() => import('./components/LayoutAppBar'))
const AppDrawer = lazy(() => import('@components/ui/drawer/AppDrawer'))

import useApp from '@hooks/useApp'
import useLayout from '@hooks/useLayout'
import useLoadResources from '@hooks/useLoadResources'

import { APPBAR_HEIGHT, DRAWER_CONFIG } from '@/constants'

export default memo(function LayoutManager({ children }) {
  const { isMobile } = useApp()
  const { projectId } = useParams()
  const loadingResource = useLoadResources('ui')
  const { isPreview } = useLayout()

  const showDrawer = !isMobile || (isMobile && (!!projectId || isPreview))

  return (
    <Box>
      <Suspense fallback={null}>
        {!projectId && !isPreview && <LayoutAppBar />}
      </Suspense>

      <Suspense fallback={null}>{showDrawer && <AppDrawer />}</Suspense>

      <Box
        component='main'
        minHeight='100dvh'
        pl={`${!isMobile ? DRAWER_CONFIG.widthClosed : 0}px`}
        sx={{ background: 'var(--mui-palette-background-app)' }}
        className='flex flex-column'
        pb={isMobile ? APPBAR_HEIGHT.mobile : 0}>
        <Suspense fallback={null}>
          {!isPreview ? <Outlet /> : children}
        </Suspense>
      </Box>
    </Box>
  )
})
