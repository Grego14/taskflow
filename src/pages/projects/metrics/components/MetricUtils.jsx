import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'

export function MetricGauge({ value, size = 200, fontSize = 40 }) {
  return (
    <Gauge
      width={size}
      height={size}
      value={value}
      cornerRadius='50%'
      text={`${value}%`}
      sx={theme => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: theme.palette.primary.main
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: theme.palette.text.disabled
        }
      })}
    />
  )
}

export function MetricPaper(props) {
  const { children, title, ...other } = props
  return (
    <Paper
      elevation={3}
      {...other}
      className={`flex flex-column ${props?.className}`}
      sx={{ gap: 2, p: 2, ...other?.sx, width: '100%', maxWidth: 'mobile' }}>
      {title && (
        <Typography
          color='primary'
          className='text-center text-balance'
          fontWeight={600}>
          {title}
        </Typography>
      )}
      {children}
    </Paper>
  )
}

export function TotalRow({ icon, total, text, isLast = false }) {
  return (
    <Box>
      <Box className='flex flex-center' gap={2} mb={1.25}>
        {icon}
        <Typography
          className='flex text-balance'
          alignItems='center'
          justifyContent='space-between'
          gap={2}
          width='100%'
          maxWidth='mobile'>
          {text}{' '}
          <Typography
            component='span'
            color='primary'
            sx={[theme => ({ ...theme.typography.h5 })]}>
            {total}
          </Typography>
        </Typography>
      </Box>
      {!isLast && <Divider />}
    </Box>
  )
}

export function MetricColumn({ text, value }) {
  return (
    <Paper sx={{ p: 1, flex: '1 1 10rem' }} elevation={4}>
      <Typography variant='caption' color='textSecondary'>
        {text}
      </Typography>
      <Typography color='primary' sx={[theme => ({ ...theme.typography.h5 })]}>
        {value}
      </Typography>
    </Paper>
  )
}
