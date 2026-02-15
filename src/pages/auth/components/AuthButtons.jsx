import GithubIcon from '@mui/icons-material/GitHub'
import GoogleIcon from '@mui/icons-material/Google'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import useUser from '@hooks/useUser'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth'
import { auth } from '@/firebase/firebase-config'
import lazyImport from '@utils/lazyImport'

export default function AuthButtons({ type, disabledBtn }) {
  const { t } = useTranslation('auth')
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

    const googleProvider = new GoogleAuthProvider()
    googleProvider.addScope('email')

    const githubProvider = new GithubAuthProvider()
    githubProvider.addScope('email')

    await signInWithPopup(
      auth,
      provider === 'google' ? googleProvider : githubProvider
    )
      .then(async result => {
        const { locale, ...otherPrefs } = preferences

        const user = result.user

        const creationTimestamp = new Date(user.metadata.creationTime).getTime()
        const lastSignInTimestamp = new Date(
          user.metadata.lastSignInTime
        ).getTime()

        const isNewUser =
          Math.abs(creationTimestamp - lastSignInTimestamp) < 5000

        if (isNewUser) {
          const createUserDoc = await lazyImport('/src/services/createUserDoc')

          // Create the user document
          await createUserDoc(
            { ...user, email: user?.email || user?.providerData?.[0]?.email },
            otherPrefs
          )

          const sendWelcomeNotification = await lazyImport(
            '/src/services/notifications/sendWelcomeNotification'
          )
          await sendWelcomeNotification(result.user.uid)
        }

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
