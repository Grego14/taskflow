import Cloud from '@mui/icons-material/Cloud'
import ListAlt from '@mui/icons-material/ListAlt'
import People from '@mui/icons-material/People'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Section from './Section'

import { useGSAP } from '@gsap/react'
import useUser from '@hooks/useUser'
import useMediaQuery from '@mui/material/useMediaQuery'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'

import { alpha } from '@mui/material/styles'

const getText = (cardType, title = true) =>
  `cards.${cardType}.${title ? 'title' : 'text'}`

export default function Cards() {
  const { t } = useTranslation('landing')
  const { preferences } = useUser()
  const userTheme = preferences?.theme

  const isBigDevice = useMediaQuery(theme =>
    theme.breakpoints.between('laptop', 'desktop')
  )

  const iconSize = !isBigDevice ? 'medium' : 'large'

  const cards = [
    {
      type: 'cloud',
      icon: <Cloud fontSize={iconSize} />
    },
    {
      type: 'management',
      icon: <ListAlt fontSize={iconSize} />
    },
    {
      type: 'collaborate',
      icon: <People fontSize={iconSize} />
    }
  ]

  useGSAP(() => {
    document.fonts.ready.then(() => {
      gsap.set('.card', { opacity: 0, scale: 0, x: 'random(500, -500)' })
      gsap.to('.card', {
        scale: 1,
        autoAlpha: 1,
        stagger: 1.5,
        ease: 'power2.out',
        x: 0,
        duration: 1.5,
        scrollTrigger: {
          trigger: '#cards',
          scrub: 0.5,
          start: `${isBigDevice ? 'top-=25%' : 'top-=10%'} bottom-=50%`,
          // if the device is not mobile/tablet the animation should end faster
          // (the cards are next to each other in a row direction)
          end: `${isBigDevice ? 'top+=50%' : 'top+=10%'} top`,
          once: true
        }
      })
    })
  })

  return (
    <Section
      id='cards'
      sx={{
        gap: 5,
        justifyContent: 'center',
        flexDirection: !isBigDevice ? 'column' : 'row',
        height: !isBigDevice ? '100dvh' : '75dvh'
      }}
      className={!isBigDevice ? 'flex flex-center' : ''}>
      {cards.map(card => (
        <Card
          key={card.type}
          sx={[
            theme => ({
              width: !isBigDevice ? '80%' : '16.5rem',
              height: !isBigDevice ? 'auto' : '75%',
              border: `1px solid ${theme.palette.secondary[userTheme]}`,
              backgroundImage: `linear-gradient(
                -30deg, 
                ${alpha(theme.palette.secondary[userTheme], 0.1)}, 
                ${alpha(theme.palette.secondary[userTheme], 0.35)}
              )`
            })
          ]}
          elevation={3}
          className='card'>
          <CardHeader
            avatar={card.icon}
            title={
              <Typography
                color='primary'
                variant='h3'
                sx={[theme => ({ ...theme.typography.h6, fontWeight: 300 })]}>
                {t(getText(card.type))}
              </Typography>
            }
          />
          <CardContent
            sx={{
              overflowX: 'hidden',
              '&:last-child': { pb: !isBigDevice ? 4 : 0 }
            }}>
            <Typography
              sx={[
                theme =>
                  isBigDevice && { fontSize: theme.typography.h6.fontSize }
              ]}>
              {t(getText(card.type, false))}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Section>
  )
}
