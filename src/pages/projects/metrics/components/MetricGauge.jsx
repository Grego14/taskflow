import { useRef } from 'preact/hooks'

import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import MetricPaper from './MetricPaper'

import useCounterAnimation from '@hooks/animations/useCounterAnimation'

export default function MetricGauge({
  value,
  title,
  hideTitle = false,
  size = 160
}) {
  const gaugeRef = useRef(null)

  const displayValue = useCounterAnimation(value, {
    trigger: gaugeRef,
    decimals: 1
  })

  return (
    <Tooltip title={hideTitle && title}>
      <MetricPaper className='flex flex-column flex-center relative'>
        <Gauge
          width={size}
          height={size}
          value={displayValue}
          innerRadius='80%'
          outerRadius='100%'
          text={size > 100 ? `${displayValue}%` : ''}
          sx={theme => ({
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 32,
              fontWeight: 700
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: value > 70 ? '#4caf50' : value > 40 ? '#ff9800'
                : theme.palette.primary.main
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: theme.palette.action.hover
            }
          })}
        />
        {(!hideTitle && title) && (
          <Typography
            variant='caption'
            color='textSecondary'
            className='text-center'
            sx={{ mt: -2, fontWeight: 500, maxWidth: 120 }}>
            {title}
          </Typography>
        )}
      </MetricPaper>
    </Tooltip>
  )
}
