import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useGSAP } from '@gsap/react'
import { useTranslation } from 'react-i18next'

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, SplitText)

export default function AuthTexts({ type }) {
  const { t } = useTranslation('auth')

  useGSAP(
    () => {
      document.fonts.ready.then(() => {
        const authTitle = SplitText.create('#authTitle', {
          type: 'words',
          onSplit(self) {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
            const authText = SplitText.create('#authText', {
              type: 'chars',
              smartWrap: true
            })

            const authTitle2 = SplitText.create('#authTitle2', {
              type: 'words'
            })

            gsap.set(['#authTitle', '#authText', '#authTitle2'], { opacity: 1 })
            gsap.set(authTitle2.words, { y: 20, opacity: 0 })
            gsap.set([...self.words, ...authText.chars], { opacity: 0, x: 15 })

            tl.to(self.words, {
              x: 0,
              autoAlpha: 1,
              stagger: 0.2
            })
              .to(authTitle2.words, {
                y: 0,
                stagger: 0.2,
                autoAlpha: 1
              })
              .to(authText.chars, {
                autoAlpha: 1,
                x: 0,
                stagger: 0.02
              })
          }
        })
      })
    },
    { dependencies: [type] }
  )

  return (
    <Box className='flex flex-column text-center' gap={0.75} mb={4}>
      <Typography
        variant='h1'
        sx={[theme => ({ ...theme.typography.h2, opacity: 0 })]}
        id='authTitle'>
        {t(`${type}.title0`)}
      </Typography>
      <Typography
        variant='h2'
        sx={[theme => ({ ...theme.typography.h4, opacity: 0 })]}
        id='authTitle2'>
        {t(`${type}.title1`)}
      </Typography>
      <Typography
        color='textSecondary'
        className='text-balance'
        id='authText'
        sx={{ opacity: 0, mt: 1 }}>
        {t(`${type}.text`)}
      </Typography>
    </Box>
  )
}
