import Paper from '@mui/material/Paper'
import { forwardRef } from 'preact/compat'

const MetricPaper = forwardRef((props, ref) => {
  const { 
    color = 'primary', 
    children, 
    ...other
  } = props

  return (
    <Paper
      ref={ref}
      style={{ '--metric-paper-color': `var(--mui-palette-${color}-mainChannel)` }}
      className='metric-paper'
      {...other}>
      {children}
    </Paper>
  )
})

export default MetricPaper
