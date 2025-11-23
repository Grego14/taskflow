import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

// components

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import Box from '@mui/material/Box'
import AuthForm from './components/AuthForm'
import AuthTexts from './components/AuthTexts'
import Footer from './components/Footer'

// hooks

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// utils

import useLoadResources from '@hooks/useLoadResources'
import setPageTitle from '@utils/setPageTitle'

// translations used in this component
const resources = ['validations', 'auth', 'common']

export default function Auth({ type = 'login' }) {
  const { t } = useTranslation(resources)
  const navigate = useNavigate()

  const [isSignup, setIsSignup] = useState(type === 'signup')
  const loadingResources = useLoadResources(resources)

  const localType = isSignup ? 'signup' : 'login'

  // manage the tab title
  useEffect(() => {
    setPageTitle(t(localType, { ns: 'common' }))
  }, [t, localType])

  function navigateToRute(rute) {
    navigate(rute)
    setIsSignup(rute === '/signup')
  }

  if (loadingResources)
    return (
      <CircleLoader text={t('loading', { ns: 'common' })} height='100dvh' />
    )

  return (
    <Box className='flex flex-column flex-center' gap={2} py={6} my='auto'>
      <AuthTexts type={localType} />
      <AuthForm type={localType} isSignup={isSignup} />
      <Footer type={localType} isSignup={isSignup} navigate={navigateToRute} />
    </Box>
  )
}
