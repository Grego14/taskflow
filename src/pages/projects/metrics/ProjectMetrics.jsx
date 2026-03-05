import { Suspense, lazy, useState, useCallback, useRef, useTransition }
  from 'preact/compat'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import MetricsTabs from './components/MetricsTabs'
import MetricsFilters from './components/MetricsFilters'

const Metrics = lazy(() => import('./components/Metrics'))
const MembersMetrics = lazy(() => import('./components/MembersMetrics'))

import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'
import useProjectMetrics from '@hooks/useProjectMetrics'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import { isPointScale } from '@mui/x-charts/internals'

export default function ProjectMetrics() {
  const { update: updateUser, metadata } = useUser()
  const { appBarHeight } = useApp()
  const { t } = useTranslation(['metrics', 'common'])
  const loadingResources = useLoadResources('metrics')

  const [preview, setPreview] = useState(metadata?.lastUsedMetricFilter ||
    'project')
  const { loading, projectMetrics, membersMetrics, dateRange } =
    useProjectMetrics()

  const containerRef = useRef(null)
  const [isPending, startTransition] = useTransition()

  const { contextSafe } = useGSAP({ scope: containerRef })

  useGSAP(() => {
    if (loadingResources) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from('.metrics-header', {
      y: -50,
      opacity: 0,
      duration: 0.6
    })
      .from('.metrics-content', {
        y: 75,
        opacity: 0,
        duration: 0.8
      }, '-=0.4')
  }, { dependencies: [loadingResources], scope: containerRef })

  useGSAP(() => {
    if (!loading && !loadingResources) {
      gsap.fromTo('.metrics-data-wrapper',
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'back.out(1.2)',
          clearProps: 'all'
        }
      )
    }
  }, { dependencies: [loading, loadingResources, preview], scope: containerRef })

  const updatePreview = contextSafe((newPreview) => {
    gsap.to('.metrics-data-wrapper', {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        updateUser({ lastUsedMetricFilter: newPreview })
        startTransition(() => setPreview(newPreview)
        )
      }
    })
  })

  if (loadingResources) {
    return (
      <CircleLoader
        text={t('common:loading')}
        height={`calc(100dvh - ${appBarHeight})`}
      />
    )
  }

  const hasNoData = !Object.keys(projectMetrics).length &&
    !membersMetrics.length

  const isUsingRange = dateRange.start || dateRange.end

  return (
    <Box ref={containerRef} className='flex flex-column' p={2} gap={2}>
      <Box className='metrics-header flex flex-center flex-column' gap={2}>
        <MetricsTabs preview={preview} setPreview={updatePreview} />
        <MetricsFilters preview={preview} />
      </Box>

      {hasNoData && !loading && (
        <Typography mt={2} className='text-center' variant='h6'>
          {t(isUsingRange ? 'emptyMetricsPeriod' : 'emptyMetrics')}
        </Typography>
      )}

      <Box className='metrics-content'>
        {loading ? (
          <CircleLoader text={t('loadingMetrics')} />
        ) : (
          <Box
            className='metrics-data-wrapper flex flex-column flex-center'
            gap={4}
            p={{ xs: 1.5, mobile: 4 }}
            opacity={isPending ? 0.4 : 1}
            filter={isPending ? 'blur(4px)' : 'none'}
            transition='opacity 0.3s ease, filter 0.3s ease'
            pointerEvents={isPending ? 'none' : 'auto'}>
            <Suspense fallback={null}>
              {preview === 'project' ? <Metrics /> : <MembersMetrics />}
            </Suspense>
          </Box>
        )}
      </Box>
    </Box>
  )
}
