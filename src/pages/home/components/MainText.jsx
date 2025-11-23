import { useGSAP } from '@gsap/react'
import useApp from '@hooks/useApp'
import Typography from '@mui/material/Typography'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

const MainText = forwardRef(function MainText(props, ref) {
  const { t } = useTranslation('landing')
  const { isMobile } = useApp()
  const { userTheme } = props
  const taskflowColor = userTheme === 'light' ? '#7E60E0' : '#CFC0FF'

  useGSAP(() => {
    document.fonts.ready.then(() => {
      SplitText.create('.mainTitle', {
        type: 'words',
        ignore: '.taskflow',
        onSplit(self) {
          gsap.set('.mainTitle', { opacity: 1 })

          return gsap.from(self.words, {
            y: 50,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'back.out(2)',
            delay: 0.25
          })
        }
      })

      SplitText.create('.taskflow', {
        type: 'chars',
        smartWrap: true,
        onRevert: self => {
          return gsap.to(self.chars, {
            x: 50,
            rotateZ: 'random(-50deg, 50deg)',
            autoAlpha: 0,
            duration: 1,
            stagger: 0.05,
            ease: 'bounce.out',
            delay: 1
          })
        },
        onSplit: self => {
          gsap.set('.taskflow', { opacity: 1 })

          return gsap.from(self.chars, {
            x: 50,
            rotateZ: 'random(-50deg, 50deg)',
            autoAlpha: 0,
            duration: 1,
            stagger: 0.05,
            ease: 'bounce.out',
            delay: 1.25,
            onComplete: () => {
              gsap.set('.taskflow', {
                textShadow: `0 0 5px ${taskflowColor}aa, 0 0 10px ${taskflowColor}80`
              })
            }
          })
        }
      })
    })
  })

  return (
    <Typography
      ref={ref}
      className='mainTitle text-center'
      variant='h1'
      sx={[
        theme => ({ ...theme.typography.h2, mx: isMobile ? 2 : 5, opacity: 0 })
      ]}
      color='primary'>
      {t('title0')}
      <Typography
        className='taskflow'
        variant='span'
        sx={{
          opacity: 0,
          transition: 'text-shadow .3s ease-in-out',
          color: taskflowColor
        }}
        aria-hidden={true}>
        TaskFlow
      </Typography>
      {t('title1')}
    </Typography>
  )
})

export default MainText
