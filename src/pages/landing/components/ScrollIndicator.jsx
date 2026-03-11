import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollSmoother from 'gsap/ScrollSmoother'

const scrollIndicatorStyles = {
  position: 'absolute',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  opacity: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  zIndex: 10,
  gap: 0.5
}

export default function ScrollIndicator({ nextSectionId, label = 'Scroll' }) {
  const containerId = '#scroll-indicator'

  useGSAP(() => {
    gsap.to(containerId, {
      opacity: 1,
      duration: 1,
      y: -10,
      ease: 'power2.out'
    })

    gsap.to(`${containerId} .arrow-icon`, {
      y: 8,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  const scrollToContent = () => {
    const nextSection = document.getElementById(nextSectionId)

    const scroller = ScrollSmoother.get()
    scroller.scrollTo(nextSection, true)
  }

  return (
    <Box
      id='scroll-indicator'
      sx={scrollIndicatorStyles}
      onClick={scrollToContent}>
      <Typography
        variant='caption'
        sx={{
          fontWeight: 600,
          letterSpacing: '0.15rem',
          textTransform: 'uppercase',
          color: 'action.active',
          userSelect: 'none'
        }}>
        {label}
      </Typography>
      <KeyboardArrowDownIcon
        className='arrow-icon'
        sx={{ fontSize: '2.5rem', color: 'primary.main', opacity: 0.7 }}
      />
    </Box>
  )
}
