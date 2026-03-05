import Paper from '@mui/material/Paper'
import { forwardRef } from 'preact/compat'

const MetricPaper = forwardRef((props, ref) => {
  const { color = 'primary', children, ...other } = props

  return (
    <Paper
      ref={ref}
      sx={t => ({
        p: 2,
        gap: 1,
        borderRadius: 3,
        border: `1px solid ${t.palette.divider}`,
        background: t.alpha(t.palette[color].main, 0.085),
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' }
      })}
      {...other}>
      {children}
    </Paper>
  )
})

export default MetricPaper
