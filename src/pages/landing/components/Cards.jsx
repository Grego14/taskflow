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

import gsap from 'gsap'

const CARDS_DATA = [
  { type: 'cloud', icon: Cloud },
  { type: 'management', icon: ListAlt },
  { type: 'collaborate', icon: People },
  { type: 'public_templates', icon: Public },
  { type: 'private_templates', icon: Lock },
  { type: 'metrics', icon: BarChart }
]

const cardStyles = (t, isDark) => ({
  overflow: 'visible',
  backgroundColor: isDark
    ? t.alpha(t.palette.background.paper, 0.4)
    : t.alpha('#fff', 0.6),
  border: `1px solid ${t.alpha(t.palette.secondary.main, 0.3)}`,
  borderRadius: '16px',
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
  const { preferences } = useUser()
  const isDark = preferences?.theme === 'dark'

  useGSAP(() => {
    showAppBar()

    gsap.set('.card', { autoAlpha: 0, scale: 0.8, y: 40 })

    if (!pluginsReady) return

    const tween = gsap.to('.card', {
      scrollTrigger: {
        trigger: '#cards',
        start: 'top 50%',
        toggleActions: 'play none none none',
        end: 'bottom 75%',
        once: true,
        scrub: true
      },
      autoAlpha: 1,
      scale: 1,
      y: 0,
      stagger: 0.25,
      duration: 1.2,
      ease: 'elastic.out(1, 0.8)',
      onComplete: setAnimationEnded,
      clearProps: 'all'
    })
  }, [pluginsReady])

  return (
    <Section
      id='cards'
      sx={{
        gap: { xs: 2, laptop: 4 },
        padding: { xs: 3, laptop: 8 },
        display: 'grid',
        backgroundImage: `linear-gradient(rgba(0,0,0,0), ${bg})`,
        gridTemplateColumns:
        {
          xs: 'repeat(auto-fit, minmax(100%, 1fr))',
          laptop: 'repeat(auto-fit, minmax(350px, 1fr))'
        },
        height: 'auto',
      }}>
      {CARDS_DATA.map(({ type, icon: Icon }) => (
        <Card
          key={type}
          sx={t => cardStyles(t, isDark)}
          className='card'
          elevation={0}>
          <CardHeader
            avatar={
              <Box sx={{
                p: 1.5,
                borderRadius: '50%',
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
