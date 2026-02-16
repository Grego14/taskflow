import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'

import gsap from 'gsap'
import useUser from '@hooks/useUser'

const containerStyles = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  justifyContent: 'center',
  alignItems: 'center'
}

const logoStyles = {
  width: 120,
  height: 'auto',
  userSelect: 'none'
}

export default function LogoLoader() {
  const { t } = useTranslation('common')
  const { preferences } = useUser()

  const userTheme = preferences?.theme === 'light' ? 'light' : 'dark'
  const logoPath = `/taskflow-logo-${userTheme}.svg`

  useGSAP(() => {
    // infinite pulse animation
    gsap.to('.logo-pulse', {
      scale: 1.1,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })

    gsap.to('.text-loading', {
      opacity: 0.5,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  return (
    <Box sx={containerStyles}>
      <Box
        component='img'
        src={logoPath}
        alt='TaskFlow Logo'
        className='logo-pulse'
        sx={logoStyles}
      />
      <Typography
        variant='overline'
        className='text-loading'
        sx={{ fontWeight: 600, letterSpacing: 2 }}
      >
        {t('loading')}
      </Typography>
    </Box>
  )
}
