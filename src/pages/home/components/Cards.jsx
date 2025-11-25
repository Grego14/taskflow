import Cloud from '@mui/icons-material/Cloud'
import ListAlt from '@mui/icons-material/ListAlt'
import People from '@mui/icons-material/People'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useTranslation } from 'react-i18next'

const getText = (cardType, title = true) =>
  `cards.${cardType}.${title ? 'title' : 'text'}`

export default function Cards({ mainTextHeight, userTheme }) {
  const { t } = useTranslation('landing')

  const cards = [
    {
      type: 'cloud',
      icon: <Cloud fontSize='large' />
    },
    {
      type: 'management',
      icon: <ListAlt fontSize='large' />
    },
    {
      type: 'collaborate',
      icon: <People fontSize='large' />
    }
  ]

  useGSAP(
    () => {
      document.fonts.ready.then(() => {
        if (!mainTextHeight) return

        gsap.set('.card', { opacity: 0, scale: 0.5 })

        gsap.to('.card', {
          scale: 1,
          autoAlpha: 1,
          stagger: 0.2,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: '#section-cards',
            scrub: 0.8,
            start: `top-=25% bottom-=${mainTextHeight}`,
            end: `bottom-=${mainTextHeight} top`,
            once: true
          }
        })

        const cardsTitles = cards.map(card => `#${card.type}`)
        const splittedTitles = cardsTitles.map(title => {
          const splittedTitle = SplitText.create(title, {
            type: 'chars'
          }).chars
          gsap.set(splittedTitle, { x: -30, opacity: 0 })
          return splittedTitle
        })

        gsap.to(splittedTitles, {
          autoAlpha: 1,
          stagger: 0.2,
          ease: 'bounce.out',
          x: 0,
          scrollTrigger: {
            scrub: 0.8,
            trigger: '#section-cards',
            start: `top-=25% bottom-=${mainTextHeight}`,
            end: 'top+=5% top',
            markers: true,
            once: true
          }
        })
      })
    },
    { dependencies: [mainTextHeight], revertOnUpdate: true }
  )

  return cards.map(card => (
    <Card
      key={card.type}
      sx={[
        theme => ({
          mx: 2,
          width: '75%',
          border: `1px solid ${theme.palette.secondary[userTheme]}`
        })
      ]}
      elevation={3}
      className='card'>
      <CardHeader
        avatar={card.icon}
        title={t(getText(card.type))}
        slotProps={{
          title: {
            sx: [theme => ({ ...theme.typography.h6 })],
            color: 'primary',
            id: card.type
          }
        }}
      />
      <CardContent sx={{ overflowX: 'hidden', '&:last-child': { pb: 4 } }}>
        <Typography>{t(getText(card.type, false))}</Typography>
      </CardContent>
    </Card>
  ))
}
