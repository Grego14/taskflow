import { useRef, useState } from 'preact/hooks'

import Typography from '@mui/material/Typography'
import MetricPaper from './MetricPaper'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import useCounterAnimation from '@hooks/animations/useCounterAnimation'

export default function StatCard({
  icon,
  total,
  label,
  color = 'primary',
  pulse = false
}) {
  const cardRef = useRef(null)
  const animatedCount = useCounterAnimation(total, { trigger: cardRef })

  useGSAP(() => {
    if (pulse && total > 0) {
      gsap.to(cardRef.current, {
        boxShadow: `0px 0px 15px var(--stat-color-alpha-40)`,
        borderColor: 'var(--stat-color-alpha-80)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }
  }, { dependencies: [total, pulse], scope: cardRef })

  const dynamicColorStyle = {
    '--stat-color-main': `var(--mui-palette-${color}-main)`,
    '--stat-color-main-channel': `var(--mui-palette-${color}-mainChannel)`,
    '--stat-color-alpha-40': `rgb(var(--mui-palette-${color}-mainChannel) / 0.4)`,
    '--stat-color-alpha-80': `rgb(var(--mui-palette-${color}-mainChannel) / 0.8)`
  }

  return (
    <MetricPaper
      className='flex flex-column flex-center metric-paper'
      color={color}
      ref={cardRef}
      style={dynamicColorStyle}
      elevation={0}>
      <div className='flex stat-card-icon-box'>
        {icon}
      </div>
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
