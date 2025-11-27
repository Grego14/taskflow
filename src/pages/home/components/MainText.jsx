import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Section from './Section'

import { useGSAP } from '@gsap/react'
import useApp from '@hooks/useApp'
import gsap from 'gsap'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { SplitText } from 'gsap/SplitText'

const MainText = forwardRef(function MainText(props, ref) {
  const { t } = useTranslation('landing')
  const { isMobile, appBarHeight } = useApp()
  const { setShowAppBar } = props
  const navigate = useNavigate()

  useGSAP(() => {
    document.fonts.ready.then(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'bounce.out' }
      })

      SplitText.create('#bigText', {
        type: 'words',
        onSplit(self) {
          gsap.set('#bigText', { opacity: 1 })

          tl.from(self.words, {
            y: 50,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'back.out(2)',
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
            ease: 'power2.out'
          })

          gsap.set('#startFree', { y: 100 })

          tl.to('#startFree', {
            autoAlpha: 1,
            y: 0,
            ease: 'bounce.out',
            onComplete: () => setShowAppBar(true)
          })
        }
      })
    })
  })

  return (
    <Section
      className='text-center'
      sx={{ mx: 2, pt: appBarHeight }}
      id='main-text'>
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
        className='text-balance'
        color='textSecondary'
        sx={[theme => ({ ...theme.typography.h5, opacity: 0 })]}
        id='shortText'>
        {t('title1')}
      </Typography>
      <Button
        sx={{ mt: 4, opacity: 0 }}
        variant='contained'
        id='startFree'
        onClick={() => navigate('/login')}>
        {t('startForFree')}
      </Button>
    </Section>
  )
})

export default MainText
