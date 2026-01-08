import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Section from './Section'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { SplitText } from 'gsap/SplitText'

export default function MainText({ setShowAppBar, setAnimationEnded }) {
  const { t } = useTranslation('landing')
  const navigate = useNavigate()

  useGSAP(() => {
    document.fonts.ready.then(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'back.out(2)' }
      })

      SplitText.create('#bigText', {
        type: 'words',
        onSplit(self) {
          gsap.set('#bigText', { opacity: 1 })

          tl.from(self.words, {
            y: 50,
            autoAlpha: 0,
            stagger: 0.1,
            delay: 0.25
          })

          const shortText = SplitText.create('#shortText', {
            type: 'chars',
            smartWrap: true
          })

          gsap.set('#shortText', { opacity: 1 })
          gsap.set(shortText.chars, { opacity: 0, x: -10 })

          tl.to(shortText.chars, {
            x: 0,
            autoAlpha: 1,
            stagger: 0.02,
            duration: 0.1,
            ease: 'power2.out',

            // start loading the cards
            onComplete: setAnimationEnded
          })

          gsap.set('#startFree', { y: 100 })

          tl.to('#startFree', {
            autoAlpha: 1,
            y: 0,

            // load and show the appbar
            onComplete: () => setShowAppBar(true)
          })
        }
      })
    })
  })

  return (
    <Section className='text-center' sx={{ px: 2 }} id='main-text'>
      <Typography
        className='text-balance'
        variant='h1'
        sx={[
          theme => ({
            ...theme.typography.h1,
            mb: 2,
            fontWeight: 700,
            opacity: 0
          })
        ]}
        id='bigText'>
        {t('title0')}
      </Typography>
      <Typography
        color='textSecondary'
        variant='h2'
        sx={[theme => ({ ...theme.typography.h5, opacity: 0 })]}
        id='shortText'>
        {t('title1')}
      </Typography>
      <Button
        sx={{ mt: 4, opacity: 0 }}
        variant='contained'
        id='startFree'
        onClick={() => navigate('signup')}>
        {t('startForFree')}
      </Button>
    </Section>
  )
}
