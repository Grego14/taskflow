import Typography from '@mui/material/Typography'
import useTasks from '@hooks/useTasks'
import formatTimer from '@utils/formatTimer'
import {
  targetTime,
  pomoStart,
  globalClock,
  activeTaskData,
  isAlarmRinging
} from '@stores/task'

export default function BigTimerDisplay() {
  const clock = globalClock.value
  const task = activeTaskData.value
  const pomo = pomoStart.value
  const target = targetTime.value

  return (
    <Typography
      variant='h1'
      fontWeight={800}
      sx={{
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: -2,
        '&:after': {
          content: () => {
            if (!task) return `'00:00'`

            // if there's an active pomo, calculate since his start
            if (pomo) {
              // determine which time to use: actual or the goal
              const referenceTime = isAlarmRinging.value
                ? targetTime.value
                : globalClock.value

              const pomoElapsed = Math.floor((referenceTime - pomo) / 1000)
              return `'${formatTimer(pomoElapsed)}'`
            }

            // if not, show the total accumulated of the task
            const elapsed = Math.floor((clock - task.startTime) / 1000)
            return `'${formatTimer(task.initialSeconds + elapsed)}'`
          }
        }
      }}
    />
  )
}

