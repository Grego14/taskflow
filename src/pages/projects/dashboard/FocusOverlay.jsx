import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
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

const circleSize = `clamp(245px, 200px + 12.5vw, 400px)`

export default function FocusOverlay() {
  const { t } = useTranslation('tasks')
  const { toggleWorkingTask, actions } = useTasks()
  const container = useRef()

  const { title, priority, parentTitle } = activeTaskData?.value || {}
  const [fgColor] = priorityColors[priority || 'none']

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
        ease: 'power2.out'
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
      className='flex flex-column flex-center'
      sx={theme => ({
        position: 'fixed',
        inset: 0,
        zIndex: t => t.zIndex.zenOverlay,
        backgroundColor: theme.alpha(theme.palette.background.default, 0.95),
        justifyContent: 'space-between',
        overflow: 'hidden'
      })}>

      <Tooltip
        title={t('minimizeSession')}
        placement='left'
        slotProps={{ popper: { sx: { zIndex: t => t.zIndex.zenPriority } } }}>
        <IconButton
          sx={theme => ({
            position: 'absolute',
            top: 24,
            right: 24,
            color: theme.alpha(theme.palette.common.white, 0.6)
          })}
          onClick={() => { showOverlay.value = false }}>
          <CloseFullscreenIcon />
        </IconButton>
      </Tooltip>

      <Box
        id='titleContainer'
        className='flex text-center flex-center text-balance flex-column'
        gap={2}
        mt={6}
        mx={6}>
        {parentTitle && (
          <>
            <Typography
              variant='h3'
              fontWeight={800}
              sx={{
                color: t => t.alpha(t.palette.text.primary, 0.8),
                lineBreak: { mobile: 'anywhere', tablet: 'normal' }
              }}>
              {parentTitle}
            </Typography>
          </>
        )}

        <Box className='flex flex-center'>
          {parentTitle && <TitleSeparatorIcon />}
          <Typography
            variant={parentTitle ? 'subtitle1' : 'h3'}
            sx={{
              fontWeight: 500,
              color: t => t.palette.text.primary
            }}>
            {title}
          </Typography>
        </Box>
      </Box>

      <Box
        id='focus-circle'
        className='flex flex-center relative'
        sx={{
          px: 6,
          py: 3,
          borderRadius: '50%',
          backgroundColor: 'rgba(20, 20, 20, 0.7)',
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 0 0 1px ${fgColor}20`,
          color: fgColor,
          position: 'relative',
          width: circleSize,
          height: circleSize,
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -2,
            left: '10%',
            width: '80%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${fgColor}, transparent)`,
            filter: 'blur(2px)',
            opacity: 0.75
          }
        }}>
        {targetTime.value && (
          <Typography
            variant='body2'
            sx={{
              position: 'absolute',
              top: '20%',
              letterSpacing: 1.5,
              fontWeight: 700,
              opacity: 0.6,
              color: fgColor,
              animation: 'fadeIn 0.3s ease-out'
            }}>
            {t('sessionGoal')}{': '}{Math.round((targetTime.value - pomoStart.value) / 60000)}m
          </Typography>
        )}

        <BigTimerDisplay />
      </Box>

      <Button
        id='finish-btn'
        variant='outlined'
        onClick={handleFinish}
        startIcon={<WorkspacePremiumIcon fontSize='large' />}
        sx={theme => ({
          bgcolor: isAlarmRinging.value ? fgColor : 'transparent',
          color: isAlarmRinging.value ? '#000' : 'primary.main',
          borderColor: isAlarmRinging.value
            ? theme.darken(fgColor, 0.35)
            : 'primary.light',
          mb: 6,
          px: 4,
          py: 1.5,
          height: 'auto',
          '& .MuiSvgIcon-root': { fontSize: 30, mr: 1.5 },
          textTransform: 'none',
          fontSize: '1.2rem',
          fontWeight: 600,
          borderRadius: 5,
          transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
          animation: isAlarmRinging.value ? 'pulse-button 1.5s infinite' : 'none',
          '@keyframes pulse-button': {
            '0%': { transform: 'scale(1)', boxShadow: `0 0 0 0px ${fgColor}60` },
            '50%': { transform: 'scale(1.1)', boxShadow: `0 0 0 15px ${fgColor}00` },
            '100%': { transform: 'scale(1)', boxShadow: `0 0 0 0px ${fgColor}00` }
          },
          '&:hover': {
            backgroundColor: isAlarmRinging.value
              ? fgColor
              : theme.palette.primary.main,
            color: theme.palette.background.paper,
            filter: 'brightness(1.2)'
          }
        })}>
        {t('finishSession')}
      </Button>
      <FocusDrawer onSetTarget={handleSetTarget} />
    </Box>
  )
}
