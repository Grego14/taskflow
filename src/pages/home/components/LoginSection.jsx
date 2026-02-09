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
import { alpha } from '@mui/material/styles'

const textStyles = (theme) => ({
  ...theme.typography.h3,
  mx: 2,
  opacity: 0,
  maxWidth: '30ch',
  fontWeight: 700,
  lineHeight: 1.2,
  perspective: '1000px',
  transformOrigin: '0 50% -50'
})

export default function LoginSection({ gradientFrom }) {
  const { isOnlyMobile } = useApp()
  const { t } = useTranslation('landing')

  useGSAP(() => {
    document.fonts.ready.then(() => {
      const loginText = SplitText.create('#login-text', { type: 'words' })

      gsap.set('#login-text', { opacity: 1 })
      gsap.set(['#login-btn', '#signup-btn'], { autoAlpha: 0, y: 40 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#login',
          end: '50% 55%',
          start: 'top+=25% 75%',
          scrub: true,
          toggleActions: 'play none none none',
          once: true
        }
      })

      tl.from(loginText.words, {
        y: 20,
        scale: 0.9,
        stagger: 0.15,
        autoAlpha: 0,
        ease: 'power3.out',
      })
        .to(['#login-btn', '#signup-btn'], {
          y: 0,
          autoAlpha: 1,
          stagger: 0.25,
          ease: 'back.out(1.7)',
          duration: 0.8
        }, '-=0.2')

      // Subtle float animation for background circles
      gsap.to('.blur-circle', {
        y: '+=50',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5
      })
    })
  })

  return (
    <Section
      id='login'
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: gradientFrom,
      }}>
      <div className='flex flex-column flex-center' style={{ zIndex: 2 }}>
        <Typography variant='h4' className='text-center' sx={textStyles} id='login-text'>
          {t('login')}
        </Typography>
        <Box
          className={isOnlyMobile ? 'flex flex-column' : 'flex'}
          gap={isOnlyMobile ? 2 : 3}
          mt={6}>
          <LoginButton variant='outlined' id='login-btn' />
          <SignUpButton id='signup-btn' />
        </Box>
      </div>

      <BlurredCircle className='blur-circle' positions={{ bottom: '10%', left: '-5%' }} color='primary' />
      <BlurredCircle className='blur-circle' positions={{ top: '10%', right: '-5%' }} color='secondary' />
    </Section>
  )
}

function BlurredCircle({ positions, color = 'secondary', blur = 80, className }) {
  const { preferences } = useUser()
  const isDark = preferences?.theme === 'dark'

  return (
    <Box
      className={className}
      sx={theme => ({
        width: 250,
        height: 250,
        borderRadius: '50%',
        backgroundColor: alpha(theme.palette[color].main, isDark ? 0.2 : 0.15),
        position: 'absolute',
        filter: `blur(${blur}px)`,
        zIndex: 1,
        ...positions
      })}
    />
  )
}
