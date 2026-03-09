import useLoadResources from '@hooks/useLoadResources'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import AnimatedTitle from '@components/reusable/texts/AnimatedTitle'

import CircleLoader from '@components/reusable/loaders/CircleLoader'

export default function Templates() {
  const { t } = useTranslation(['common', 'templates'])
  const loadingResources = useLoadResources('templates')

  if (loadingResources) return (
    <CircleLoader
      height='100dvh'
      text={t('common:loading')}
    />
  )

  return (
    <Box className='flex flex-column flex-grow' p={2}>
      <AnimatedTitle id='projects-title' textAlign='start'>
        {t('templates:mainTitle')}
      </AnimatedTitle>

      <Typography
        className='text-center'
        my='auto'>
        {t('templates:empty')}
      </Typography>
    </Box>
  )
}
