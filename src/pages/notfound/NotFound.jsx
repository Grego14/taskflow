import GoBackButton from '@components/reusable/buttons/GoBackButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircleLoader from '@components/reusable/loaders/CircleLoader'

import useUser from '@hooks/useUser'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useLoadResources from '@hooks/useLoadResources'

export default function NotFound() {
  const { t } = useTranslation(['common', 'ui'])
  const navigate = useNavigate()
  const { preferences, uid } = useUser()
  const userTheme = preferences?.theme || 'light'

  const loadingResources = useLoadResources('ui')

  if (loadingResources) return <CircleLoader text={t('loading', { ns: 'common' })} />

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
        my: 'auto',
        height: '100dvh'
      }}>
      <Typography variant='h3' textAlign='center' color='error'>
        404
      </Typography>
      <Typography
        className='text-balance text-center'
        variant='h4'
        sx={[
          theme => ({
            color: theme.palette.error[userTheme]
          })
        ]}>
        {t('ruteNotFound', { ns: 'ui' })}
      </Typography>
      <GoBackButton handler={() => navigate(uid ? '/home' : '/')} />
    </Box>
  )
}
