import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'

import { useGSAP } from '@gsap/react'
import { useMemo, useRef } from 'preact/hooks'

import { APPBAR_HEIGHT, priorityColors } from '@/constants'
import formatTimer from '@utils/formatTimer'
import gsap from 'gsap'

import {
  activeTaskData,
  currentSessionSeconds,
  isWorking,
  showOverlay
} from '@stores/task'

const FabTimer = () => {
  const task = activeTaskData.value
  if (!task) return null

  return (
    <Typography variant='caption' className='fab-timer-text'>
      {formatTimer(currentSessionSeconds.value)}
    </Typography>
  )
}

export default function FocusFAB() {
  const fabRef = useRef()
  const task = activeTaskData.value
  const working = isWorking.value
  const showingOverlay = showOverlay.value

  useGSAP(
    () => {
      if (!fabRef.current) return

      if (isWorking && !showingOverlay) {
        gsap.fromTo(
          fabRef.current,
          { scale: 0, rotation: -45 },
          { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' }
        )
      }
    },
    { dependencies: [working, showingOverlay] }
  )

  const dynamicStyles = useMemo(() => {
    if (!task?.priority) return {}

    const priority = task.priority || 'none'
    const [fgColor] = priorityColors[priority]
    return { '--fg-priority': fgColor }
  }, [task?.priority])

  if (!task || showingOverlay || !working) return null

  return (
    <Fab
      ref={fabRef}
      variant='extended'
      onClick={() => {
        showOverlay.value = true
      }}
      style={dynamicStyles}
      className='focus-fab flex flex-center'>
      <OpenInFullIcon size='small' />
      <FabTimer />
    </Fab>
  )
}
