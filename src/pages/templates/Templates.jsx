import useLoadResources from '@hooks/useLoadResources'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import useApp from '../../hooks/useApp'

export default function Templates() {
  const { t, i18n } = useTranslation('templates')
  const loadingResources = useLoadResources('templates')
  const { appBarHeight, isMobile } = useApp()

  if (loadingResources) return <CircleLoader height='100dvh' />

  return (
    <Box className='flex flex-column flex-grow' p={2}>
      <Typography variant='h1' sx={[theme => ({ ...theme.typography.h4 })]}>
        {t('mainTitle')}
      </Typography>

      <Typography
        className='text-center'
        my='auto'
        pb={isMobile ? appBarHeight : 0}>
        {t('empty')}
      </Typography>
    </Box>
  )
}
