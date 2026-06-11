import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import AppTooltip from '@components/reusable/AppTooltip'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremiumRounded'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import TitleSeparatorIcon from '@mui/icons-material/NavigateNext'
import FocusDrawer from './FocusDrawer'
import BigTimerDisplay from './BigTimerDisplay'

import { useMemo, useRef } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import useTasks from '@hooks/useTasks'
import { useGSAP } from '@gsap/react'

import { priorityColors } from '@/constants'
import { playSound, stopSound } from '@services/audio'
import gsap from 'gsap'

import {
  activeTaskData,
  isWorking,
  showOverlay,
  targetTime,
  pomoStart,
  isAlarmRinging,
  clearFocusGoals,
  showResetPrompt,
  currentMinutes
} from '@stores/task'
import { globalAlert, setGlobalAlert, closeGlobalAlert } from '@stores/ui'

import '@styles/components/ui/tasks/focusSession.css'

export default function FocusOverlay() {
  const { t } = useTranslation('tasks')
  const { toggleWorkingTask, actions } = useTasks()
  const container = useRef()

  const { title, priority, parentTitle } = activeTaskData?.value || {}

  const dynamicStyles = useMemo(() => {
    const [fgColor, bgColor] = priorityColors[priority || 'none']
    return {
      '--fg-priority': fgColor,
      '--bg-priority': bgColor
    }
  }, [priority])

  useGSAP(() => {
    if (!isWorking.value || !showOverlay.value || !container.current) return

    const tl = gsap.timeline()

    tl.fromTo(container.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.inOut' }
    )
      .from('#titleContainer', { opacity: 0, y: 25, ease: 'power2.out' })
      .from('#focus-circle', {
        scale: 0.4,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.5)',
        onComplete() {
          // infinite pulse animation
          gsap.to('#focus-circle', {
            keyframes: [{ y: -10 }, { y: 10 }],
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          })
        }
      }, '-=0.2')
      .from('#finish-btn', {
        y: 40,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'transform'
      }, '-=0.3')

  }, { scope: container, dependencies: [isWorking.value, showOverlay.value] })

  if (!showOverlay.value) return null

  // calculate the exact moment to trigger the alarm
  const handleSetTarget = (minutes) => {
    const now = Date.now()
    const task = activeTaskData.value

    // save the pomodoro time
    currentMinutes.value = minutes
    const elapsed = Math.floor((now - task.startTime) / 1000)

    // reset the startTime if the user clicks one of the pomodoro options
    // inside the drawer before reaching 2 minutes working
    if (elapsed < 120) {
      task.startTime = now 
      pomoStart.value = now
      targetTime.value = now + (minutes * 60 * 1000)
    } else {
      showResetPrompt.value = true

      setGlobalAlert({
        message: t('resetPrompt', { minutes: Math.floor(elapsed / 60) }),
        autoHideDuration: 10000,
        action: (
          <Box>
            <Button 
              color='primary' 
              size='small' 
              onClick={() => {
                actions.resetSession()
                closeGlobalAlert()
              }}>
              {t('resetSession')}
            </Button>
            <Button 
              color='inherit' 
              size='small' 
              onClick={() => {
                pomoStart.value = task.startTime 
                targetTime.value = task.startTime + (minutes * 60 * 1000)
              
                showResetPrompt.value = false
                closeGlobalAlert()
              }}>
              {t('keepSession')}
            </Button>
          </Box>
        )
      })
    }
  }

  const handleFinish = () => {
    if (isAlarmRinging.value) {
      isAlarmRinging.value = false
      stopSound('endSessionGoal')
    }

    playSound('endSession')
    toggleWorkingTask()
  }

  return (
    <Box
      ref={container}
      className='focus-overlay flex flex-column flex-center'
      style={dynamicStyles}>

      <AppTooltip
        title={t('minimizeSession')}
        placement='left'
        slotProps={{ popper: { sx: { zIndex: t => t.zIndex.zenPriority } } }}>
        <IconButton
          className='minimize-btn'
          onClick={() => { showOverlay.value = false }}>
          <CloseFullscreenIcon />
        </IconButton>
      </AppTooltip>

      <Box
        id='titleContainer'
        className='focus-title-container flex text-center flex-center flex-column'>
        {parentTitle && (
          <Typography variant='h3' className='parent-title'>
            {parentTitle}
          </Typography>
        )}

        <Box className='flex flex-center'>
          {parentTitle && <TitleSeparatorIcon />}
          <Typography
            variant={parentTitle ? 'subtitle1' : 'h3'}
            className='current-task-title'>
            {title}
          </Typography>
        </Box>
      </Box>

      <Box id='focus-circle' className='focus-circle flex flex-center'>
        {targetTime.value && (
          <Typography className='goal-label' variant='body2'>
            {t('sessionGoal')}{': '}{Math.round((targetTime.value - pomoStart.value) / 60000)}m
          </Typography>
        )}

        <BigTimerDisplay />
      </Box>

      <Button
        id='finish-btn'
        variant='outlined'
        onClick={handleFinish}
        className={`finish-btn ${isAlarmRinging.value ? 'alarm-ringing' : ''}`}
        startIcon={<WorkspacePremiumIcon fontSize='large' />}>
        {t('finishSession')}
      </Button>
      <FocusDrawer onSetTarget={handleSetTarget} />
    </Box>
  )
}
