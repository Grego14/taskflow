import { Suspense, lazy } from 'preact/compat'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Section from './Section'
import Box from '@mui/material/Box'

const ScrollIndicator = lazy(() => import('./ScrollIndicator'))

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { SplitText } from 'gsap/SplitText'
import useUser from '@hooks/useUser'

import { APPBAR_HEIGHT } from '@/constants'

const h1Styles = (theme) => ({
  ...theme.typography.h1,
  '&.MuiTypography-root': {
    fontSize: 'clamp(2.75rem, 2.75rem + 2vw, 3.8rem)'
  },
  perspective: '1000px',
  mb: 2,
  fontWeight: 800,
  opacity: 0,
  maxWidth: '15ch',
  lineHeight: 1.2,
  background: `linear-gradient(
    90deg, 
    ${theme.palette.primary.main} 0%, 
    ${theme.palette.secondary.main} 35%, 
    ${theme.palette.primary.light} 50%, 
    ${theme.palette.secondary.main} 65%, 
    ${theme.palette.primary.main}
  )`,
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  WebkitFontSmoothing: 'antialiased',
  textShadow: `0 0 25px ${theme.palette.primary.main}59`,
})

const h2Styles = (theme) => ({
  ...theme.typography.h5,
  opacity: 0,
  maxWidth: { xs: '40ch', laptop: '50ch' },
  perspective: '1000px',
  lineHeight: 1.45
})

const btnStyles = (theme) => ({
  opacity: 0,
  visibility: 'hidden',
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
  boxShadow: `0 3px 18px ${theme.palette.primary.main}80`
})

const secondaryBtnStyles = (theme) => ({
  opacity: 0,
  visibility: 'hidden',
  ...theme.typography.h6,
  py: 1.5,
  px: 3,
  borderWidth: '2px'
})

export default function MainText({
  setAnimationEnded,
  prefetchAuth,
  animationEnded
}) {
  const { t, i18n } = useTranslation('landing')
  const { preferences } = useUser()
  const lang = preferences?.lang
  const navigate = useNavigate()

  const resourceExists = i18n.hasResourceBundle(lang, 'landing')

  useGSAP((context) => {
    if (!resourceExists) return

    const bigSplit = new SplitText('#bigText', { type: 'words' })
    const shortSplit = new SplitText('#shortText', {
      type: 'chars',
      smartWrap: true
    })

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        gsap.to('#startBtn', {
          '--shine-left': '200%',
          duration: 2.5,
          repeat: -1,
          ease: 'power1.inOut',
          repeatDelay: 1
        })
        gsap.to('#bigText', {
          backgroundPosition: '200% center',
          duration: 5,
          repeat: -1,
          ease: 'none'
        })
      }
    })

    gsap.set(['#bigText', '#shortText'], { opacity: 1 })
    gsap.set(['#startBtn', '#previewBtn'], { y: 40, scale: 0.9 })

    tl.from(bigSplit.words, {
      y: 50,
      autoAlpha: 0,
      stagger: 0.8 / bigSplit.words.length,
      ease: 'back.out(2.5)',
      rotateZ: -45,
      transformOrigin: '0 50% -50'
    })
      .from(shortSplit.chars, {
        opacity: 0,
        y: 15,
        rotateX: -80,
        stagger: 0.85 / shortSplit.chars.length
      }, '-=0.4')
      .to(['#startBtn', '#previewBtn'], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        stagger: 0.3,
        onComplete: setAnimationEnded
      }, '-=0.5')
  }, { dependencies: [resourceExists] })

  const getPaddingTop = (ammount) => `calc(${APPBAR_HEIGHT.other} * ${ammount})`

  return (
    <Section className='text-center relative' sx={{
      px: 2,
      justifyContent: { xs: 'start', desktop: 'center' },
      pt: { xs: getPaddingTop(1), mobile: getPaddingTop(2), desktop: 0 }
    }}
      id='main-text'>
      <Typography
        className='text-balance'
        id='bigText'
        variant='h1'
        sx={h1Styles}>
        {t('title0')}
      </Typography>

      <Box className='relative'>
        <Typography
          color='textSecondary'
          variant='body1'
          className='text-balance'
          sx={h2Styles}
          id='shortText'
          aria-hidden='true'>
          {t('title1')}
        </Typography>

        {/* Only visible to screen readers */}
        <span className='sr-only'>
          {t('title1')}
        </span>
      </Box>

      <Box className='flex flex-center'
        sx={{
          mt: {
            xs: 3,
            tablet: 5,
            laptop: 4
          },
          gap: 2,
          flexDirection: { xs: 'column', laptop: 'row' }
        }}>
        <Button
          sx={btnStyles}
          variant='contained'
          onMouseEnter={prefetchAuth}
          id='startBtn'
          onClick={() => navigate('signup')}>
          {t('startForFree')}
        </Button>

        <Button
          sx={secondaryBtnStyles}
          variant='outlined'
          id='previewBtn'
          onClick={() => navigate('preview')}>
          {t('livePreview')}
        </Button>
      </Box>

      {animationEnded && (
        <Suspense fallback={null}>
          <ScrollIndicator nextSectionId='cards' />
        </Suspense>
      )}
    </Section>
  )
}
