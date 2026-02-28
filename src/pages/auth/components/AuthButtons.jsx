import GithubIcon from '@mui/icons-material/GitHub'
import GoogleIcon from '@mui/icons-material/Google'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useUser from '@hooks/useUser'
import { useNavigate } from 'react-router-dom'

import * as authService from '@services/auth'

export default function AuthButtons({ type, disabledBtn }) {
  const { t } = useTranslation('auth')
  const { preferences } = useUser()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAuthProvider = async e => {
    const providerId = e.currentTarget?.id
    if (!providerId) return

    setLoading(true)
    setError(null)

    try {
      const user = await authService.loginWithProvider(providerId, preferences)

      // manual redirection based on verification state
      navigate(user.emailVerified ? '/home' : '/verify', { replace: true })
    } catch (err) {
      console.error(err)
      // only show error if it's not the user closing the popup
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(t('errors.providerError'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className='flex flex-column flex-center' my={4} gap={2}>
      <Button
        type='submit'
        form='authForm'
        disabled={disabledBtn || loading}
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

      <Button
        startIcon={<GithubIcon />}
        variant='outlined'
        disabled={loading}
        onClick={handleAuthProvider}
        id='github'>
        {t('githubButton')}
      </Button>
      <Button
        startIcon={<GoogleIcon />}
        variant='outlined'
        onClick={handleAuthProvider}
        disabled={loading}
        id='google'>
        {t('googleButton')}
      </Button>

      {error && <Typography color='error'>{error}</Typography>}
    </Box>
  )
}
