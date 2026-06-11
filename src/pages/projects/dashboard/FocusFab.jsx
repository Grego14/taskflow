import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'

import { useRef, useMemo } from 'preact/hooks'
import { useGSAP } from '@gsap/react'

import gsap from 'gsap'
import { APPBAR_HEIGHT, priorityColors } from '@/constants'
import formatTimer from '@utils/formatTimer'

import { 
  activeTaskData, 
  isWorking, 
  showOverlay, 
  currentSessionSeconds
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

  useGSAP(() => {
    if (!fabRef.current) return

    if (isWorking && !showingOverlay) {
      gsap.fromTo(fabRef.current,
        { scale: 0, rotation: -45 },
        { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' }
      )
    }
  }, { dependencies: [working, showingOverlay] })

  const dynamicStyles = useMemo(() => {
    if (!task) return {}

    const priority = task.priority || 'none'
    const [fgColor] = priorityColors[priority]
    return { '--fg-priority': fgColor }
  }, [task?.priority])

  if (!task || showingOverlay || !working) return null

  return (
    <Fab
      ref={fabRef}
      variant='extended'
      onClick={() => (showOverlay.value = true)}
      style={dynamicStyles}
      className='focus-fab flex flex-center'>
      <OpenInFullIcon size='small' />
      <FabTimer />
    </Fab>
  )
}
