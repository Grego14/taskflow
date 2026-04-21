import Tooltip from '@mui/material/Tooltip'
import { useState } from 'preact/hooks'

export default function TaskTooltip({ children, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleMouseEnter = () => setIsLoaded(true)

  if (!isLoaded) {
    return (
      <div onMouseEnter={handleMouseEnter} style={{ display: 'contents' }}>
        {children}
      </div>
    )
  }


  return (
    <Tooltip
      placement='top'
      enterDelay={750}
      enterTouchDelay={0}
      leaveTouchDelay={2000}
      onClose={() => setIsLoaded(false)}
      {...props}>
      {children}
    </Tooltip>
  )
}
