import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Container from '@mui/material/Container'

import { useGSAP } from '@gsap/react'
import { useTranslation } from 'react-i18next'
import useApp from '@hooks/useApp'

import gsap from 'gsap'

const FAQ_KEYS = ['free', 'security', 'mobile', 'export', 'author']

const accordionStyles = (t) => ({
  background: 'transparent',
  borderBottom: `1px solid ${t.palette.divider}`,
  '&:before': { display: 'none' },
  '&.Mui-expanded': { margin: 0 },
  boxShadow: 'none'
})

export default function FAQSection({ setAnimationEnded }) {
  const { t } = useTranslation('landing')
  const { isMobile } = useApp()

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#faq-container',
        start: isMobile ? 'top+=35% 50%' : 'top+=30% 65%',
        end: 'bottom top+=50%',
        toggleActions: 'play none none none',
        scrub: true,
        once: true
      }
    })

    tl.from('#faq-title', {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power3.out'
    })

    tl.from('.faq-item', {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: setAnimationEnded
    }, '-=0.4')
  }, [])

  return (
    <Container
      id='faq-container'
      maxWidth='md'
      sx={{ py: { xs: 8, tablet: 12 }, px: { xs: 5, tablet: 8 } }}>
      <Typography
        variant='h4'
        component='h2'
        id='faq-title'
        sx={{
          mb: 6,
          fontWeight: 800,
          textAlign: 'center',
          letterSpacing: '-0.02em'
        }}>
        {t('faq.title')}
      </Typography>

      <Box className='flex flex-column' gap={2}>
        {FAQ_KEYS.map(key => (
          <Accordion
            key={key}
            sx={accordionStyles}
            className='faq-item'>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              sx={{ px: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {t(`faq.${key}.q`)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0, pb: 3 }}>
              <Typography color='text.secondary' sx={{ lineHeight: 1.7 }}>
                {t(`faq.${key}.a`)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  )
}
