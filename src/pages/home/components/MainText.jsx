import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Section from './Section'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { SplitText } from 'gsap/SplitText'

const h1Styles = (theme) => ({
  ...theme.typography.h1,
  perspective: '1000px',
  mb: 2,
  fontWeight: 700,
  opacity: 0,
  maxWidth: '15ch',
  lineHeight: 1.2,
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, 
  ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  WebkitFontSmoothing: 'antialiased'
})

const h2Styles = (theme) => ({
  ...theme.typography.h5,
  opacity: 0,
  maxWidth: '40ch',
  perspective: '1000px',
  lineHeight: 1.45
})

const btnStyles = (theme) => ({
  mt: 6,
  opacity: 0,
  ...theme.typography.h6,
  py: 1.5,
  px: 3,
  position: 'relative',
  overflow: 'hidden',
  '--shine-left': '-100%',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 'var(--shine-left)',
    width: '50%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
    transform: 'skewX(-20deg)'
  },
  boxShadow: theme.palette.mode === 'light' ? `0 10px 20px -10px ${theme.palette.primary.main}80` : 'none'
})

export default function MainText({ setAnimationEnded, prefetchAuth }) {
  const { t } = useTranslation('landing')
  const navigate = useNavigate()
  const mainRef = useRef(null)

  useGSAP(() => {
    document.fonts.ready.then(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      const bigSplit = SplitText.create('#bigText', { type: 'words' })
      const shortSplit = SplitText.create('#shortText', { type: 'chars', smartWrap: true })

      gsap.set(['#bigText', '#shortText'], { opacity: 1 })
      gsap.set('#startFree', { y: 40, scale: 0.9 })

      tl.from(bigSplit.words, {
        y: 50,
        autoAlpha: 0,
        stagger: 0.6 / bigSplit.words.length,
        ease: 'back.out(2.5)',
        rotate: 45,
        transformOrigin: '0 50% -50',
        delay: 0.25
      })
        .from(shortSplit.chars, {
          opacity: 0,
          y: 15,
          rotateX: -80,
          stagger: 0.85 / shortSplit.chars.length,

          // start loading the cards
          onComplete: setAnimationEnded
        }, '-=0.3')
        .to('#startFree', {
          autoAlpha: 1, y: 0, scale: 1,
          onComplete: () => {
            gsap.to('#startFree', { '--shine-left': '200%', duration: 2.5, repeat: -1, ease: 'power1.inOut', repeatDelay: 1 })
            gsap.to('#bigText', { backgroundPosition: '200% center', duration: 5, repeat: -1, ease: 'none' })
          }
        }, '-=0.3')
    })
  }, { scope: mainRef })

  return (
    <Section className='text-center' sx={{ px: 2 }} id='main-text' ref={mainRef}>
      <Typography
        className='text-balance'
        variant='h1'
        sx={h1Styles}
        id='bigText'>
        {t('title0')}
      </Typography>
      <Typography
        color='textSecondary'
        variant='body1'
        className='text-balance'
        sx={h2Styles}
        id='shortText'>
        {t('title1')}
      </Typography>
      <Button
        sx={btnStyles}
        variant='contained'
        onMouseEnter={prefetchAuth}
        id='startFree'
        onClick={() => navigate('signup')}>
        {t('startForFree')}
      </Button>
    </Section >
  )
}
