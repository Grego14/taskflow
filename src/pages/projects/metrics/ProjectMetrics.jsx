import { lazy, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import MetricsTabs from './components/MetricsTabs'

const Metrics = lazy(() => import('./components/Metrics'))
const MembersMetrics = lazy(() => import('./components/MembersMetrics'))

import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'
import useProjectMetrics from '@hooks/useProjectMetrics'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

export default function ProjectMetrics() {
  const { uid, update, metadata } = useUser()
  const { appBarHeight, isOnlyMobile } = useApp()
  const { t } = useTranslation(['metrics', 'ui'])
  const loadingResources = useLoadResources('metrics')

  const { loading, error, projectMetrics, membersMetrics } = useProjectMetrics()
  const [preview, setPreview] = useState(
    metadata?.lastUsedMetricFilter || 'project'
  )

  useEffect(() => {
    if (metadata?.lastUsedMetricFilter !== preview) {
      update(uid, { lastUsedMetricFilter: preview })
    }
  }, [update, uid, metadata, preview])

  if (loadingResources || loading)
    return (
      <CircleLoader
        text={t('projects.loadingMetrics', { ns: 'ui' })}
        height={`calc(100dvh - ${appBarHeight})`}
      />
    )

  const emptyMetrics =
    Object.keys(projectMetrics)?.length < 1 &&
    Object.keys(membersMetrics)?.length < 1

  return (
    <Box className='flex flex-column' p={2} gap={2}>
      <Box className='flex flex-column' gap={2}>
        <MetricsTabs preview={preview} setPreview={setPreview} />
      </Box>

      {emptyMetrics && (
        <Typography
          mt={2}
          className='text-center'
          variant='h2'
          sx={[theme => ({ ...theme.typography.h6 })]}>
          {t('emptyMetrics')}
        </Typography>
      )}
      <Box
        className='flex flex-column flex-center'
        gap={4}
        p={isOnlyMobile ? 1.5 : 4}>
        {preview === 'project' ? <Metrics /> : <MembersMetrics />}
      </Box>
    </Box>
  )
}
