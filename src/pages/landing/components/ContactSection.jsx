import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import EmailIcon from '@mui/icons-material/Email'
import Container from '@mui/material/Container'

import { useGSAP } from '@gsap/react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'

export default function ContactSection({ setAnimationEnded }) {
  const { t } = useTranslation('landing')

  useGSAP(() => {
    gsap.from('#contact-box', {
      scrollTrigger: {
        trigger: '#contact-box',
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: setAnimationEnded
    })

    gsap.to('#contact-btn', {
      y: -4,
      repeat: -1,
      yoyo: true,
      duration: 2.5,
      ease: 'sine.inOut'
    })
  })

  return (
    <Container className='text-center contact-container' maxWidth='tablet'>
      <div
        className='flex flex-column contact-box'
        id='contact-box'>
        <Typography variant='h5' className='contact-title'>
          {t('contact.title')}
        </Typography>

        <Typography color='text.secondary' className='contact-description'>
          {t('contact.text')}
        </Typography>

        <Button
          variant='contained'
          id='contact-btn'
          className='contact-btn'
          startIcon={<EmailIcon />}
          href='mailto:gre208981@gmail.com'
          disableElevation>
          {t('contact.button', 'Get in Touch')}
        </Button>
      </div>
    </Container>
  )
}
