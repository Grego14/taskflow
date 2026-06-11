import { useRef } from 'preact/hooks'

import { Gauge } from '@mui/x-charts/Gauge'
import Box from '@mui/material/Box'
import AppTooltip from '@components/reusable/AppTooltip'
import Typography from '@mui/material/Typography'
import MetricPaper from './MetricPaper'

import useCounterAnimation from '@hooks/animations/useCounterAnimation'

const getArcColor = (value) => {
  if (value > 70) return '#4caf50'
  if (value > 40) return '#ff9800'

  return 'var(--mui-palette-primary-main)'
}

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

  const gaugeStyle = { '--gauge-arc-color': getArcColor(value) }

  return (
    <AppTooltip title={hideTitle && title}>
      <MetricPaper 
        className='flex flex-column flex-center relative metric-gauge-paper'>
        <Gauge
          width={size}
          height={size}
          value={displayValue}
          innerRadius='80%'
          outerRadius='100%'
          text={size >= 100 ? `${displayValue}%` : ''}
          className='metric-gauge-chart'
          style={gaugeStyle}
        />
        {/* sx={theme => ({ */}
        {/*   [`& .${gaugeClasses.valueText}`]: { */}
        {/*     fontSize: { xs: 25, tablet: 32 }, */}
        {/*     fontWeight: 700 */}
        {/*   }, */}
        {/*   [`& .${gaugeClasses.valueArc}`]: { */}
        {/*     fill: value > 70 ? '#4caf50' : value > 40 ? '#ff9800' */}
        {/*       : theme.palette.primary.main */}
        {/*   }, */}
        {/*   [`& .${gaugeClasses.referenceArc}`]: { */}
        {/*     fill: theme.palette.action.hover */}
        {/*   } */}
        {/* })} */}
        {(!hideTitle && title) && (
          <Typography
            variant='caption'
            color='textSecondary'
            className='text-center metric-gauge-title'>
            {title}
          </Typography>
        )}
      </MetricPaper>
    </AppTooltip>
  )
}
