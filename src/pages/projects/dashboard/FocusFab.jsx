import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'

import { useRef } from 'preact/hooks'
import { useGSAP } from '@gsap/react'

import gsap from 'gsap'
import { APPBAR_HEIGHT, priorityColors } from '@/constants'
import formatTimer from '@utils/formatTimer'

import { activeTaskData, globalClock, isWorking, showOverlay }
  from '@stores/task'

const FabTimer = () => {
  const task = activeTaskData.value

  if (!task) return null

  const elapsed = Math.floor((globalClock.value - task.startTime) / 1000)

  return (
    <Typography
      variant='caption'
      fontWeight={800}
      sx={{ fontVariantNumeric: 'tabular-nums' }}>
      {formatTimer(task.initialSeconds + elapsed)}
    </Typography>
  )
}

export default function FocusFAB() {
  const fabRef = useRef()
  const task = activeTaskData.value
  const working = isWorking.value
  const showingOverlay = showOverlay.value

  useGSAP(() => {
    if (!fabRef.current) return

    if (isWorking && !showingOverlay) {
      gsap.fromTo(fabRef.current,
        { scale: 0, rotation: -45 },
        { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' }
      )
    }
  }, { dependencies: [working, showingOverlay] })

  if (!task) return null

  const priority = task.priority || 'none'
  const [fgColor] = priorityColors[priority]

  return (
    <Fab
      ref={fabRef}
      variant='extended'
      onClick={() => (showOverlay.value = true)}
      sx={theme => ({
        position: 'fixed',
        bottom: `calc(${APPBAR_HEIGHT.mobile} + 1rem)`,
        right: 24,
        zIndex: theme.zIndex.speedDial,
        backgroundColor: fgColor,
        color: theme.palette.background.paper,
        gap: 1.5,
        px: 2,
        '&:hover': {
          backgroundColor: theme.alpha(fgColor, 0.9),
          transform: 'scale(1.05)'
        },
        transition: 'background-color 0.2s, transform 0.2s'
      })}>
      <OpenInFullIcon size='small' />
      <FabTimer />
    </Fab>
  )
}
