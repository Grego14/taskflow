import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import AuthForm from './components/AuthForm'
import AuthTexts from './components/AuthTexts'
import Footer from './components/Footer'

import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import useLoadResources from '@hooks/useLoadResources'

import setPageTitle from '@utils/setPageTitle'
import { Typography } from '@mui/material'

const resources = ['validations', 'auth', 'common']

export default function Auth({ type = 'login' }) {
  const { t } = useTranslation(resources)
  const navigate = useNavigate()
  const location = useLocation()
  const sesionExpired = location.state?.message

  const [isSignup, setIsSignup] = useState(type === 'signup')
  const loadingResources = useLoadResources(resources)

  const localType = isSignup ? 'signup' : 'login'

  useEffect(() => {
    setPageTitle(t(localType, { ns: 'common' }))
  }, [t, localType])

  const navigateToRoute = (route) => {
    navigate(route)
    setIsSignup(route === '/signup')
  }

  if (loadingResources) {
    return (
      <CircleLoader text={t('loading', { ns: 'common' })} height='100dvh' />
    )
  }

  return (
    <Box className='flex flex-column flex-center' gap={2} py={6} my='auto'>
      {sesionExpired && (
        <Typography color='error'>
          {sesionExpired}
        </Typography>
      )}

      <AuthTexts type={localType} />

      <AuthForm type={localType} isSignup={isSignup} />

      <Footer
        type={localType}
        isSignup={isSignup}
        navigate={navigateToRoute}
      />
    </Box>
  )
}
