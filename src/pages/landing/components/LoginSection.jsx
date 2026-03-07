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

const loginBtnStyles = (t) => ({
  borderRadius: '12px',
  px: 4,
  py: 1.5,
  textTransform: 'none',
  fontWeight: 600,
  borderColor: t.palette.divider,
  color: t.palette.text.primary,
  '&:hover': {
    backgroundColor: t.alpha(t.palette.primary.main, 0.05),
    borderColor: t.palette.primary.main
  }
})

const signUpBtnStyles = (t) => ({
  borderRadius: '12px',
  px: 4,
  py: 1.5,
  textTransform: 'none',
  fontWeight: 700,
  boxShadow: `0 6px 16px ${t.alpha(t.palette.primary.main, 0.3)}`,
  background:
    `linear-gradient(45deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
  '&:hover': {
    boxShadow: `0 10px 20px ${t.alpha(t.palette.primary.main, 0.4)}`,
    transform: 'translateY(-2px)'
  },
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  textRendering: 'optimizeLegibility'
})

export default function LoginSection({ prefetchAuth }) {
  const { isOnlyMobile } = useApp()
  const { t } = useTranslation('landing')

  useGSAP(() => {
    document.fonts.ready.then(() => {
      const loginText = SplitText.create('#login-text', { type: 'words' })

      gsap.set('#login-text', { opacity: 1 })
      gsap.set(['#login-btn', '#signup-btn'], { autoAlpha: 0, y: 30 })
      gsap.set('.blur-circle', { opacity: 0, scale: 0.8 })

      gsap.to('.blur-circle', {
        opacity: 0.6,
        scale: 1.2,
        y: '+=40',
        x: '+=20',
        duration: 'random(4, 6)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.8,
          from: 'random'
        }
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#login',
          start: 'top 50%',
          end: 'bottom-=20% 80%',
          scrub: 1,
          once: true
        }
      })

      tl.from(loginText.words, {
        y: 40,
        rotationX: -40,
        autoAlpha: 0,
        stagger: 0.1,
        ease: 'power3.out',
        duration: 1
      })
        .to(['#login-btn', '#signup-btn'], {
          y: 0,
          autoAlpha: 1,
          stagger: 0.2,
          ease: 'back.out(1.2)',
          duration: 0.8,
          onComplete() {
            gsap.to('#signup-btn', {
              scale: 1.05,
              duration: 0.8,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            })
          }
        }, '-=0.3')
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
        alignItems: 'center'
      }}>
      <div className='flex flex-column flex-center' style={{ zIndex: 2 }}>
        <Typography
          variant='h3'
          className='text-center'
          sx={{
            mx: 2,
            opacity: 0,
            maxWidth: '30ch',
            fontWeight: 700,
            lineHeight: 1.2,
            perspective: '1000px',
            transformOrigin: '0 50% -50',
          }}
          id='login-text'>
          {t('login')}
        </Typography>
        <Box
          className={isOnlyMobile ? 'flex flex-column' : 'flex'}
          gap={{ xs: 2, mobile: 3 }}
          mt={6}>
          <LoginButton
            variant='outlined'
            id='login-btn'
            onMouseEnter={prefetchAuth}
            sx={loginBtnStyles}
          />
          <SignUpButton
            id='signup-btn'
            onMouseEnter={prefetchAuth}
            sx={signUpBtnStyles}
          />
        </Box>
      </div>

      <BlurredCircle
        className='blur-circle'
        positions={{ bottom: '10%', left: '-5%' }}
        color='primary'
      />
      <BlurredCircle
        className='blur-circle'
        positions={{ top: '10%', right: '-5%' }}
        color='secondary'
      />
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
        backgroundColor:
          theme.alpha(theme.palette[color].main, isDark ? 0.3 : 0.18),
        position: 'absolute',
        filter: `blur(${blur}px)`,
        zIndex: 1,
        opacity: 0,
        ...positions
      })}
    />
  )
}
