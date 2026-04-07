import Typography from '@mui/material/Typography'
import useTasks from '@hooks/useTasks'
import formatTimer from '@utils/formatTimer'
import { currentSessionSeconds } from '@stores/task'

export default function BigTimerDisplay() {
  return (
    <Typography
      variant='h1'
      fontWeight={800}
      sx={{
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: -2,
        '&:after': { content: () => `'${formatTimer(currentSessionSeconds)}'` }
      }}
    />
  )
}

