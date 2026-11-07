import useTasks from '@hooks/useTasks'
import Typography from '@mui/material/Typography'
import { currentSessionSeconds } from '@stores/task'
import formatTimer from '@utils/formatTimer'

export default function BigTimerDisplay() {
  return (
    <Typography
      variant='h1'
      className='big-timer-display'
      style={{ '--current-time': `'${formatTimer(currentSessionSeconds)}'` }}
    />
  )
}
