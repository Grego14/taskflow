import LoginButton from '@components/reusable/buttons/LoginButton'
import SignUpButton from '@components/reusable/buttons/SignUpButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Section from './Section'

import { useGSAP } from '@gsap/react'
import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useTranslation } from 'react-i18next'

export default function LoginSection() {
  const { isOnlyMobile } = useApp()
  const { t } = useTranslation('landing')

  useGSAP(() => {
    document.fonts.ready.then(() => {
      const loginText = SplitText.create('#login-text', { type: 'words' })
      gsap.set('#login-text', { opacity: 1 })
      gsap.set(['#login-btn', '#signup-btn'], { opacity: 0, y: 120 })

      const tl = gsap.timeline()

      tl.from(loginText.words, {
        x: 15,
        scale: 0.9,
        stagger: 0.05,
        autoAlpha: 0,
        ease: 'power2.out',
        duration: 2,
        scrollTrigger: {
          scrub: 0.3,
          trigger: '#login',
          once: true,
          start: 'top+=50% bottom',
          end: 'top+=25% bottom-=40%'
        },
        onComplete: () => {
          tl.to(['#login-btn', '#signup-btn'], {
            y: 0,
            autoAlpha: 1,
            ease: 'back.out(2)'
          })
        }
      })
    })
  })

  return (
    <Section
      id='login'
      sx={{ position: 'relative', overflow: 'hidden', height: '75dvh' }}>
      <div className='flex flex-column flex-center'>
        <Typography
          variant='h4'
          className='text-balance text-center'
          sx={[theme => ({ ...theme.typography.h3, mx: 2, opacity: 0 })]}
          id='login-text'>
          {t('login')}
        </Typography>
        <Box
          className={isOnlyMobile ? 'flex flex-column' : 'flex'}
          gap={isOnlyMobile ? 2 : 4}
          mt={4}>
          <LoginButton variant='outlined' id='login-btn' />
          <SignUpButton id='signup-btn' />
        </Box>
      </div>

      <BlurredCircle positions={{ bottom: 0, left: -75 }} blur={100} />
      <BlurredCircle positions={{ bottom: -75, right: -50 }} />
    </Section>
  )
}

function BlurredCircle({ positions, color, blur = 75 }) {
  const { preferences } = useUser()
  const userTheme = preferences?.theme

  return (
    <Box
      sx={theme => ({
        width: 150,
        height: 150,
        borderRadius: '50%',
        backgroundColor: theme.palette.secondary[userTheme],
        position: 'absolute',
        filter: `blur(${blur}px)`,
        ...positions
      })}
    />
  )
}
