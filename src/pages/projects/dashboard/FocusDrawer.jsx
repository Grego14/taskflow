import { useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'

import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import AppTooltip from '@components/reusable/AppTooltip'

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import TimerIcon from '@mui/icons-material/Timer'
import CustomTimerSelector from './CustomTimerSelector'

import { currentMinutes } from '@stores/task'

const PRESETS = [15, 25, 30, 45, 50, 90]

const drawerSlotProps = {
  paper: { className: 'focus-drawer-paper' }, 
  backdrop: { className: 'focus-drawer-backdrop' } 
}

export default function FocusDrawer({ onSetTarget }) {
  const { t } = useTranslation('tasks')
  const theme = useTheme()

  const [open, setOpen] = useState(false)
  const [customMinutes, setCustomMinutes] = useState('')
  const [error, setError] = useState(null)

  const handleApply = (mins) => {
    const minutes = parseInt(mins)

    if (isNaN(minutes) || minutes <= 0) return

    onSetTarget(minutes)
    setOpen(false)
    setCustomMinutes('')
  }

  const handleCustomMinutes = (e) => {
    const minutes = parseInt(e.target.value)

    setCustomMinutes(minutes)

    if (Math.sign(minutes) !== 1) {
      return setError(t('positiveMinutes'))
    }

    setError(null)
  }

  const isDark = theme.palette.mode === 'dark'
  const subtitleColor = theme.alpha(theme.palette.common[
    isDark ? 'white' : 'black'
  ], 0.725)

  return (
    <>
      {!open && (
        <AppTooltip title={t('openTimerMenu')} placement='left'>
          <IconButton 
            onClick={() => setOpen(true)} 
            className='focus-drawer-toggle' 
            variant='outlined'>
            <KeyboardArrowLeftIcon />
          </IconButton>
        </AppTooltip>
      )}

      <Drawer
        anchor='right'
        open={open}
        slotProps={drawerSlotProps}
        onClose={() => setOpen(false)}
        style={{ 
          zIndex: 'var(--mui-zIndex-zenPriority)', 
          '--subtitle-color': subtitleColor
        }}>
        <Box className='flex flex-center' gap={1}>
          <TimerIcon style={{ fontSize: 20 }} />
          <Typography className='drawer-section-title'>
            {t('sessionGoal')}
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          <Typography 
            variant='caption' 
            className='presets-label'>
            {t('presets')}
          </Typography>
          <Box className='presets-grid'>
            {PRESETS.map(mins => (
              <Button
                key={mins}
                variant='outlined'
                size='small'
                onClick={() => handleApply(mins)}
                className='preset-btn'>
                {mins}m
              </Button>
            ))}
          </Box>
        </Stack>

        <CustomTimerSelector 
          value={currentMinutes.value} 
          onChange={(val) => { currentMinutes.value = val }} 
          handleApply={handleApply}
        />

        <Button
          variant='text'
          className='drawer-close-btn'
          onClick={() => setOpen(false)}
          startIcon={<KeyboardArrowRightIcon />}>
          {t('closeTimerMenu')}
        </Button>
      </Drawer>
    </>
  )
}
