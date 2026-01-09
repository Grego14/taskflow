import Cloud from '@mui/icons-material/Cloud'
import ListAlt from '@mui/icons-material/ListAlt'
import People from '@mui/icons-material/People'
import Lock from '@mui/icons-material/Lock'
import Public from '@mui/icons-material/Public'
import BarChart from '@mui/icons-material/BarChart'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Section from './Section'
import Box from '@mui/material/Box'

import { useGSAP } from '@gsap/react'
import useUser from '@hooks/useUser'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTranslation } from 'react-i18next'

const getText = (cardType, title = true) =>
  `cards.${cardType}.${title ? 'title' : 'text'}`

import gsap from 'gsap'
import { alpha } from '@mui/material/styles'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import setPageTitle from '@utils/setPageTitle'

gsap.registerPlugin(ScrollTrigger)

const cards = [
  { type: 'cloud', icon: Cloud },
  { type: 'management', icon: ListAlt },
  { type: 'collaborate', icon: People },
  { type: 'public_templates', icon: Public },
  { type: 'private_templates', icon: Lock },
  { type: 'metrics', icon: BarChart }
]

export default function Cards({ setAnimationEnded, bg }) {
  const { t } = useTranslation('landing')
  const { preferences } = useUser()
  const userTheme = preferences?.theme || 'light'

  const isBigDevice = useMediaQuery(theme =>
    theme.breakpoints.up('laptop')
  )

  useGSAP(() => {
    document.fonts.ready.then(() => {
      gsap.set('.card', { autoAlpha: 0, scale: 0.5, y: 25 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#cards',
          scrub: 0.3,
          start: `${isBigDevice ? 'top-=10%' : 'top'} bottom-=50%`,
          end: 'top+=55% top',
          once: true
        }
      })

      tl.to('.card', {
        autoAlpha: 1,
        keyframes: [{ scale: 1 }, { scale: 1.1 }, { scale: 1 }],
        stagger: 1.5,
        y: 0,
        ease: 'power4.out',
        duration: 1.5,
      })

      // load the login section
      tl.call(() => setAnimationEnded(), null, 0.33 * tl.duration())
    })
  }, [isBigDevice])

  const cardWidth = !isBigDevice ? '18rem' : '25rem'

  return (
    <Section
      id='cards'
      sx={{
        gap: !isBigDevice ? 3 : 6,
        paddingInline: !isBigDevice ? 3 : 6,
        backgroundImage: `linear-gradient(rgba(0,0,0,0), ${bg})`,
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth}, 1fr))`,
        gridTemplateRows: '1fr 1fr 1fr',
        placeContent: 'center',
        // replace Section component default height (100dvh)
        height: '100%'
      }}
      className={!isBigDevice ? 'flex flex-center' : ''}>
      {cards.map(({ type, icon: Icon }) => (
        <Card
          key={type}
          elevation={3}
          sx={[theme => ({
            overflow: 'visible',
            border: `1px solid ${alpha(theme.palette.secondary[userTheme], 0.65)}`,
            backgroundImage: `
            linear-gradient(-30deg, 
              ${alpha(theme.palette.secondary[userTheme], 0.15)} 10%, 
              ${alpha(theme.palette.secondary[userTheme], 0.40)} 80%
            )`,
            height: '100%'
          })
          ]}
          className='card'>
          <CardHeader
            avatar={<Icon fontSize='large' />}
            title={
              <Typography
                color='primary'
                variant='h3'
                sx={[theme => ({ ...theme.typography.h5, fontWeight: 300 })]}>
                {t(getText(type))}
              </Typography>
            }
          />
          <CardContent>
            <Typography
              sx={[
                theme => ({ fontSize: theme.typography.h6.fontSize })
              ]}>
              {t(getText(type, false))}
            </Typography>
          </CardContent>
        </Card>
      ))
      }
    </Section >
  )
}
