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

export default function FAQSection({ setAnimationEnded }) {
  const { t } = useTranslation('landing')
  const { isMobile } = useApp()

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#faq-container',
        start: isMobile ? 'top+=35% 50%' : 'top+=40% 65%',
        end: 'bottom-=15% top+=50%',
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
  }, [isMobile])

  return (
    <Container
      id='faq-container'
      maxWidth='md'
      className='faq-container'>
      <Typography
        variant='h4'
        component='h2'
        id='faq-title'
        className='faq-title text-center'>
        {t('faq.title')}
      </Typography>

      <Box className='flex flex-column' gap={2}>
        {FAQ_KEYS.map(key => (
          <Accordion
            key={key}
            disableGutters
            className='faq-item'>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color='primary' />}
              className='faq-summary-container'>
              <Typography className='faq-question'>
                {t(`faq.${key}.q`)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className='faq-details-container'>
              <Typography color='text.secondary' className='faq-answer'>
                {t(`faq.${key}.a`)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  )
}
