import GithubIcon from '@mui/icons-material/GitHub'
import GoogleIcon from '@mui/icons-material/Google'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { useTranslation } from 'react-i18next'

export default function AuthButtons({ type, disabledBtn }) {
  const { t } = useTranslation('auth')

  return (
    <Box className='flex flex-column flex-center' my={4} gap={2}>
      <Button
        type='submit'
        form='authForm'
        disabled={disabledBtn}
        variant='contained'
        sx={{ width: '100%' }}>
        {t(`${type}.authButton`)}
      </Button>

      <Typography
        variant='body2'
        color='textSecondary'
        sx={{ display: 'block', mx: 'auto' }}>
        {t('separatorText')}
      </Typography>

      <Button startIcon={<GithubIcon />} variant='outlined'>
        {t('githubButton')}
      </Button>
      <Button startIcon={<GoogleIcon />} variant='outlined'>
        {t('googleButton')}
      </Button>
    </Box>
  )
}
