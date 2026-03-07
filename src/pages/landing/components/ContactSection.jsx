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
  }, [])

  return (
    <Container maxWidth='tablet' sx={{ py: 10, textAlign: 'center' }}>
      <Box
        className='flex flex-column'
        id='contact-box'
        sx={theme => ({
          p: { xs: 4, tablet: 6 },
          borderRadius: '24px',
          background: theme.alpha(theme.palette.primary.main, 0.03),
          border: `1px dashed ${theme.alpha(theme.palette.primary.main, 0.4)}`,
          alignItems: 'center'
        })}>
        <Typography
          variant='h5'
          sx={{
            fontWeight: 800,
            mb: 2,
            letterSpacing: '-0.01em'
          }}>
          {t('contact.title')}
        </Typography>

        <Typography color='text.secondary' sx={{ mb: 4, maxWidth: '400px' }}>
          {t('contact.text')}
        </Typography>

        <Button
          variant='contained'
          id='contact-btn'
          startIcon={<EmailIcon />}
          href='mailto:gre208981@gmail.com'
          disableElevation
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            px: 5,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
            boxShadow:
              t => `0 10px 20px ${t.alpha(t.palette.primary.main, 0.2)}`
          }}>
          {t('contact.button', 'Get in Touch')}
        </Button>
      </Box>
    </Container>
  )
}
