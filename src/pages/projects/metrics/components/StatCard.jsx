import { useRef, useState } from 'preact/hooks'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import MetricPaper from './MetricPaper'

import { alpha, useTheme } from '@mui/material/styles'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import useCounterAnimation from '../hooks/useCounterAnimation'

export default function StatCard({
  icon,
  total,
  label,
  color = 'primary',
  pulse = false
}) {
  const cardRef = useRef(null)
  const theme = useTheme()

  const animatedCount = useCounterAnimation(total, { trigger: cardRef })

  useGSAP(() => {
    if (pulse && total > 0) {
      gsap.to(cardRef.current, {
        boxShadow: `0px 0px 15px ${alpha(theme.palette[color].main, 0.4)}`,
        borderColor: alpha(theme.palette[color].main, 0.8),
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }
  }, { dependencies: [total, pulse], scope: cardRef })

  return (
    <MetricPaper
      className='flex flex-column flex-center'
      color={color}
      ref={cardRef}
      elevation={0}>
      <Box
        sx={theme => ({
          color: theme.palette[color]?.main,
          bgcolor: alpha(theme.palette[color]?.main ||
            theme.palette.primary.main, 0.1),
          p: 1,
          borderRadius: '50%',
          mb: 1
        })}>
        {icon}
      </Box>
      <Typography variant='h4' fontWeight={700}>
        {animatedCount}
      </Typography>
      <Typography
        variant='caption'
        color='textSecondary'
        fontWeight={600}
        className='text-center'>
        {label.toUpperCase()}
      </Typography>
    </MetricPaper>
  )
}
