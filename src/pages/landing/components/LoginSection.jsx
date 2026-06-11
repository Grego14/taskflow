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

const circle1Positions = { bottom: '35%', left: '-25%' }
const circle2Positions = { top: '10%', right: '-5%' }

export default function LoginSection({ prefetchAuth }) {
  const { isOnlyMobile } = useApp()
  const { t, i18n } = useTranslation('landing')
  const lang = i18n.language

  useGSAP(() => {
    document.fonts.ready.then(() => {
      const loginText = SplitText.create('#login-text', { type: 'words' })

      gsap.set('#login-text', { opacity: 1 })
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

      const btns = ['#login-btn', '#signup-btn']
      gsap.set(btns, { y: 30 })

      tl.to(btns, {
        y: 0,
        autoAlpha: 1,
        stagger: 0.15,
        ease: 'elastic(1.3, 0.6)',
        duration: 0.8,
        onComplete() {
          gsap.to('#signup-btn', {
            scale: 1.05,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          })
        }
      })
    })
  }, { dependencies: [lang], revertOnUpdate: true })

  return (
    <Section
      className='flex flex-column relative flex-center login-section'
      id='login'>
      <div className='flex flex-column flex-center' style={{ zIndex: 2 }}>
        <Typography
          key={`loginText-${lang}`}
          variant='h3'
          className='text-center login-title'
          id='login-text'>
          {t('login')}
        </Typography>

        <Box className={`login-btns ${isOnlyMobile ? 'flex flex-column' : 'flex'}`}>
          <LoginButton
            key={`loginBtn-${lang}`}
            variant='outlined'
            id='login-btn'
            onMouseEnter={prefetchAuth}
            className='login-btn-custom hide-element'
          />
          <SignUpButton
            key={`signupBtn-${lang}`}
            id='signup-btn'
            onMouseEnter={prefetchAuth}
            className='signup-btn-custom hide-element'
          />
        </Box>
      </div>

      <div className='built-by flex flex-center'>
        <Typography variant='h6' key={`builtBy-${lang}`}>
          {t('builtBy')}
        </Typography>
        <a
          className='github-link'
          target='_blank'
          href='https://github.com/Grego14'>
          Gregorio Piñero
        </a>
      </div>

      <BlurredCircle positions={circle1Positions} color='primary' />
      <BlurredCircle positions={circle2Positions} color='secondary' />
    </Section>
  )
}

function BlurredCircle({ positions, color = 'secondary', blur = 80, className }) {
  const { preferences } = useUser()
  const isDark = preferences?.theme === 'dark'

  const alpha = isDark ? '0.5' : '0.5'

  return (
    <Box
      className='blur-circle absolute'
      style={{
        backgroundColor: 
          `rgb(var(--mui-palette-${color}-mainChannel) / ${alpha})`,
        filter: `blur(${blur}px)`,
        ...positions
      }}
    />
  )
}
