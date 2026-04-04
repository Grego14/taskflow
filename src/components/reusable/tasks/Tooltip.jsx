import Tooltip from '@mui/material/Tooltip'

export default function TaskTooltip({ children, ...props }) {
  return (
    <Tooltip
      placement='top'
      enterDelay={750}
      enterTouchDelay={0}
      leaveTouchDelay={2000}
      {...props}>
      {children}
    </Tooltip>
  )
}
