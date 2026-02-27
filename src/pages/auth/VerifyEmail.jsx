import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import useApp from '@hooks/useApp'

import * as authService from '@services/auth'
import playSound from '@services/audio'

export default function VerifyEmail() {
  const { t } = useTranslation(['auth', 'common'])
  const { currentUser, refreshUser } = useAuth()
  const { appNotification } = useApp()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef(null)

  const location = useLocation()
  const emailFromSignup = location.state?.email

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  // if the user is already verified, send him home
  useEffect(() => {
    if (currentUser?.emailVerified) {
      playSound('complete')
      navigate('/home', { replace: true })
    }
  }, [currentUser, navigate])

  const startCountdown = () => {
    setCountdown(60)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleRefresh = async () => {
    setLoading(true)
    await refreshUser()
    setLoading(false)
  }

  const handleResend = async () => {
    setResending(true)

    try {
      startCountdown()
      await authService.resendVerification()
      appNotification({ message: t('verify.emailSend', { ns: 'auth' }) })
    } catch (err) {
      if (err.message === 'NO_USER')
        navigate('/login')
    } finally {
      setResending(false)
    }
  }

  return (
    <Box
      className='flex flex-column flex-center text-center'
      height='100dvh'
      gap={3}
      p={4}
      my='auto'>
      <Typography variant='h4' fontWeight='bold'>
        {t('verify.title', { ns: 'auth' })}
      </Typography>

      <Typography
        className='text-balance'
        color='text.secondary'
        maxWidth='400px'>
        {t('verify.description', {
          ns: 'auth', email:
            currentUser?.email || emailFromSignup
        })}
      </Typography>

      <Box className='flex flex-column' gap={2} width='100%' maxWidth='300px'>
        <Button
          variant='contained'
          onClick={handleRefresh}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}>
          {t('verify.already_verified', { ns: 'auth' })}
        </Button>

        <Button
          variant='text'
          onClick={handleResend}
          disabled={resending || countdown > 0}>
          {resending ? t('common:loading') :
            countdown > 0
              ? `${t('verify.resend', { ns: 'auth' })} (${countdown}s)` :
              t('verify.resend', { ns: 'auth' })
          }
        </Button>
      </Box>
    </Box>
  )
}
