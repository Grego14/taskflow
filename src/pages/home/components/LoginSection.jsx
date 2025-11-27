import LoginButton from '@components/reusable/buttons/LoginButton'
import SignUpButton from '@components/reusable/buttons/SignUpButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Section from './Section'

import { useGSAP } from '@gsap/react'
import { useTheme } from '@mui/material/styles'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useTranslation } from 'react-i18next'

export default function LoginSection({ userTheme }) {
  const { t } = useTranslation('landing')
  const theme = useTheme()

  const blurredCircleColor = theme.palette.secondary[userTheme]

  useGSAP(() => {
    document.fonts.ready.then(() => {
      const loginText = SplitText.create('#login-text', { type: 'words' })
      gsap.set('#login-text', { opacity: 1 })
      gsap.set(['#login-btn', '#signup-btn'], { scale: 0.5, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: '#login-text',
        defaults: { ease: 'bounce.out' }
      })

      tl.from(loginText.words, {
        rotate: 'random(-50, 50)',
        scale: 'random(0.75, 0.9)',
        autoAlpha: 0,
        stagger: 0.05
      }).to(['#login-btn', '#signup-btn'], {
        scale: 1,
        autoAlpha: 1
      })
    })
  })

  return (
    <Section id='login' sx={{ position: 'relative', overflow: 'hidden' }}>
      <div className='flex flex-column flex-center'>
        <Typography
          variant='h3'
          className='text-balance text-center'
          sx={[theme => ({ ...theme.typography.h4, mx: 4, opacity: 0 })]}
          id='login-text'>
          {t('login')}
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 4 }}>
          <LoginButton variant='outlined' id='login-btn' />
          <SignUpButton id='signup-btn' />
        </Box>
      </div>

      <BlurredCircle
        positions={{ bottom: 0, left: -75 }}
        color={blurredCircleColor}
        blur={100}
      />

      <BlurredCircle
        positions={{ bottom: -75, right: -50 }}
        color={blurredCircleColor}
      />
    </Section>
  )
}

function BlurredCircle({ positions, color, blur = 75 }) {
  return (
    <Box
      sx={{
        width: 150,
        height: 150,
        borderRadius: '50%',
        backgroundColor: color,
        position: 'absolute',
        filter: `blur(${blur}px)`,
        ...positions
      }}
    />
  )
}
