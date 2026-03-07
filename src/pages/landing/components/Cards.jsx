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
import Box from '@mui/material/Box'
import Section from './Section'

import { useGSAP } from '@gsap/react'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import useApp from '@hooks/useApp'

import gsap from 'gsap'

const CARDS_DATA = [
  {
    type: 'cloud',
    icon: Cloud,
    gridArea: { xs: 'auto', tablet: '1 / 1 / 3 / 2' }
  },
  {
    type: 'management',
    icon: ListAlt,
    gridArea: { xs: 'auto', tablet: '1 / 2 / 2 / 4' }
  },
  {
    type: 'collaborate',
    icon: People,
    gridArea: { xs: 'auto', tablet: '2 / 2 / 3 / 3' }
  },
  {
    type: 'public_templates',
    icon: Public,
    gridArea: { xs: 'auto', tablet: '2 / 3 / 3 / 4' }
  },
  {
    type: 'private_templates',
    icon: Lock,
    gridArea: { xs: 'auto', tablet: '3 / 1 / 4 / 3' }
  },
  {
    type: 'metrics',
    icon: BarChart,
    gridArea: { xs: 'auto', tablet: '3 / 3 / 4 / 4' }
  }
]

const cardStyles = (t, isDark) => ({
  overflow: 'visible',
  backgroundColor: isDark
    ? t.alpha(t.palette.background.paper, 0.4)
    : t.alpha('#fff', 0.6),
  border: `1px solid ${t.alpha(t.palette.secondary.main, 0.3)}`,
  borderRadius: 3,
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    border: `1px solid ${t.palette.secondary.main}`
  },
  backgroundImage: 'none',
  width: '100%',
  maxWidth: { xs: '100%', tablet: '40rem' },
  mx: 'auto'
})

export default function Cards({ setAnimationEnded, bg, showAppBar, pluginsReady }) {
  const { t } = useTranslation('landing')
  const { isMobile } = useApp()
  const { preferences } = useUser()
  const isDark = preferences?.theme === 'dark'

  useGSAP(() => {
    if (!pluginsReady) return

    showAppBar()

    gsap.from('.card', {
      scrollTrigger: {
        trigger: '#cards',
        start: `top ${isMobile ? '40%' : '60%'}`,
        end: isMobile ? 'bottom+=10% bottom-=40%' : 'bottom+=15% bottom-=35%',
        toggleActions: 'play none none none',
        scrub: 0.1,
        once: true
      },
      autoAlpha: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: setAnimationEnded
    })
  }, [pluginsReady, isMobile])

  return (
    <Section
      id='cards'
      sx={{
        gap: { xs: 2, laptop: 4 },
        padding: { xs: 3, laptop: 8 },
        display: 'grid',
        backgroundImage: `linear-gradient(rgba(0,0,0,0), ${bg})`,
        gridTemplateColumns: {
          xs: '1fr',
          tablet: 'repeat(3, 1fr)'
        },
        height: 'auto'
      }}>
      {CARDS_DATA.map(({ type, icon: Icon, gridArea }) => (
        <Card
          key={type}
          sx={t => ({ ...cardStyles(t, isDark), gridArea })}
          className='card'
          elevation={0}>
          <CardHeader
            avatar={
              <Box sx={{
                p: 1.5,
                borderRadius: '12px',
                background: t => t.alpha(t.palette.primary.main, 0.1),
                display: 'flex'
              }}>
                <Icon color='primary' fontSize='large' />
              </Box>
            }
            title={
              <Typography
                variant='h2'
                sx={[theme => ({
                  ...theme.typography.h5,
                  fontWeight: 600,
                })]}>
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
