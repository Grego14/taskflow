import GithubIcon from '@mui/icons-material/GitHub'
import GoogleIcon from '@mui/icons-material/Google'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/firebase/AuthContext'
import useUser from '@hooks/useUser'

import {
  signInWithPopup,
  githubProvider,
  googleProvider,
  auth
} from '@/firebase/firebase-config'
import lazyImport from '@utils/lazyImport'

export default function AuthButtons({ type, disabledBtn }) {
  const { t } = useTranslation('auth')
  const { currentUser } = useAuth()
  const [popup, setPopup] = useState(false)
  const [error, setError] = useState(null)
  const { preferences } = useUser()

  const handleAuthProvider = async e => {
    const provider = e.currentTarget?.id

    if (provider !== 'google' && provider !== 'github') return

    const handleError = () => {
      setError(t('errors.providerError'))
      setPopup(false)
    }

    setPopup(true)

    await signInWithPopup(
      auth,
      provider === 'google' ? googleProvider : githubProvider
    )
      .then(async result => {
        const createUserDoc = await lazyImport('/src/services/createUserDoc')
        const { locale, ...otherPrefs } = preferences

        // Create the user document and make a project template
        const user = await createUserDoc(result.user, otherPrefs)

        const sendWelcomeNotification = await lazyImport(
          '/src/services/notifications/sendWelcomeNotification'
        )
        await sendWelcomeNotification(result.user.uid)

        setPopup(false)
      })
      .catch(handleError)
  }

  return (
    <Box className='flex flex-column flex-center' my={4} gap={2}>
      <Button
        type='submit'
        form='authForm'
        disabled={disabledBtn || popup}
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
        disabled={popup}
        onClick={handleAuthProvider}
        id='github'>
        {t('githubButton')}
      </Button>
      <Button
        startIcon={<GoogleIcon />}
        variant='outlined'
        onClick={handleAuthProvider}
        disabled={popup}
        id='google'>
        {t('googleButton')}
      </Button>

      {error && <Typography color='error'>{error}</Typography>}
    </Box>
  )
}
