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
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import Section from './Section'
import { useGSAP } from '@gsap/react'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { alpha } from '@mui/material/styles'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CARDS_DATA = [
  { type: 'cloud', icon: Cloud },
  { type: 'management', icon: ListAlt },
  { type: 'collaborate', icon: People },
  { type: 'public_templates', icon: Public },
  { type: 'private_templates', icon: Lock },
  { type: 'metrics', icon: BarChart }
]

const getText = (cardType, title = true) =>
  `cards.${cardType}.${title ? 'title' : 'text'}`

const cardStyles = (theme, isDark) => ({
  overflow: 'visible',
  backgroundColor: isDark
    ? alpha(theme.palette.background.paper, 0.4)
    : alpha('#fff', 0.6),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
  borderRadius: '16px',
  height: '100%',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    border: `1px solid ${theme.palette.secondary.main}`
  }
})

export default function Cards({ setAnimationEnded, bg }) {
  const { t } = useTranslation('landing')
  const { preferences } = useUser()
  const isDark = preferences?.theme === 'dark'
  const isLaptop = useMediaQuery(theme => theme.breakpoints.up('laptop'))

  useGSAP(() => {
    document.fonts.ready.then(() => {
      gsap.set('.card', { autoAlpha: 0, scale: 0.8, y: 40 })

      const tween = gsap.to('.card', {
        scrollTrigger: {
          trigger: '#cards',
          start: 'top 80%',
          toggleActions: 'play none none none',
          end: 'bottom center',
          once: true,
          scrub: 0.2,
        },
        autoAlpha: 1,
        scale: 1,
        y: 0,
        stagger: 0.25,
        duration: 1.2,
        ease: 'elastic.out(1, 0.8)',
        onProgress: (card) => { if (card === 3) setAnimationEnded() }
      })
    })
  }, [isLaptop])

  return (
    <Section
      id='cards'
      sx={{
        gap: isLaptop ? 4 : 2,
        padding: isLaptop ? 8 : 3,
        backgroundImage: `linear-gradient(rgba(0,0,0,0), ${bg})`,
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${isLaptop ? '350px' : '100%'}, 1fr))`,
        height: 'auto',
        minHeight: '100dvh'
      }}
    >
      {CARDS_DATA.map(({ type, icon: Icon }) => (
        <Card key={type} sx={t => cardStyles(t, isDark)} className='card' elevation={0}>
          <CardHeader
            avatar={
              <Box sx={{
                p: 1.5,
                borderRadius: '50%',
                background: t => alpha(t.palette.primary.main, 0.1),
                display: 'flex'
              }}>
                <Icon color='primary' fontSize='large' />
              </Box>
            }
            title={
              <Typography variant='h2' sx={[theme => ({ ...theme.typography.h5, fontWeight: 600, })]}>
                {t(`cards.${type}.title`)}
              </Typography>
            }
          />
          <CardContent>
            <Typography variant='body1' color='text.secondary'>
              {t(`cards.${type}.text`)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Section>
  )
}
