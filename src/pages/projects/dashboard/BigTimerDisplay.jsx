import Typography from '@mui/material/Typography'
import useTasks from '@hooks/useTasks'
import formatTimer from '@utils/formatTimer'
import { currentSessionSeconds } from '@stores/task'

export default function BigTimerDisplay() {
  return (
    <Typography
      variant='h1'
      className='big-timer-display'
      style={{ '--current-time': `'${formatTimer(currentSessionSeconds)}'` }}
    />
  )
}

