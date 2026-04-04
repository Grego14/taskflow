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
import Tooltip from '@components/reusable/tasks/Tooltip'

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import TimerIcon from '@mui/icons-material/Timer'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

const PRESETS = [15, 25, 30, 45, 50]

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

  const color = theme.palette.common[
    theme.palette.mode === 'dark' ? 'white' : 'black']
  const subtitleColor = theme.alpha(color, 0.725)

  const handleCustomMinutes = (e) => {
    const minutes = parseInt(e.target.value)

    setCustomMinutes(minutes)

    if (Math.sign(minutes) !== 1) {
      return setError(t('positiveMinutes'))
    }

    setError(null)
  }

  return (
    <>
      {!open && (
        <Tooltip
          title={t('openTimerMenu')}
          slotProps={{ popper: { sx: { zIndex: 13000 } } }}
          placement='left'>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              position: 'fixed',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              borderRadius: '12px 0 0 12px',
              border: `1px solid ${theme.alpha(color, 0.3)}`,
              borderRight: 'none'
            }}>
            <KeyboardArrowLeftIcon sx={{ opacity: 0.65 }} />
          </IconButton>
        </Tooltip>
      )}

      <Drawer
        anchor='right'
        open={open}
        onClose={() => setOpen(false)}
        sx={{ zIndex: 12000 }}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              backgroundImage: t => t.palette.background.drawer,
              backdropFilter: 'blur(10px)',
              bgcolor: 'transparent',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }
          }
        }}>
        <Box className='flex flex-center' gap={1}>
          <TimerIcon sx={{ color: 'primary.light', fontSize: 20 }} />
          <Typography
            sx={{
              letterSpacing: 2,
              fontWeight: 700,
              color: subtitleColor
            }}>
            {t('sessionGoal')}
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          <Typography variant='caption' sx={{ color: subtitleColor }}>
            {t('presets')}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {PRESETS.map(mins => (
              <Button
                key={mins}
                variant='outlined'
                size='small'
                onClick={() => handleApply(mins)}
                sx={{
                  borderColor: theme.alpha(color, 0.15),
                  color: 'white',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: theme.alpha(theme.palette.secondary.main, 0.15)
                  }
                }}>
                {mins}m
              </Button>
            ))}
          </Box>
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant='caption' color={subtitleColor}>
            {t('customTime')}
          </Typography>
          <TextField
            fullWidth
            size='small'
            placeholder={t('customTimePlaceholder')}
            type='number'
            value={customMinutes}
            onInput={handleCustomMinutes}
            onKeyDown={e => e.key === 'Enter' && handleApply(customMinutes)}
            helperText={error}
            error={!!error}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      size='small'
                      onClick={() => handleApply(customMinutes)}
                      disabled={customMinutes <= 0}
                      sx={{ color: 'primary.light' }}>
                      <PlayArrowIcon fontSize='small' />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: theme.alpha(color, 0.05),
                  '& fieldset': { borderColor: theme.alpha(color, 0.2) }
                }
              }
            }}
          />
        </Stack>

        <Button
          variant='text'
          onClick={() => setOpen(false)}
          startIcon={<KeyboardArrowRightIcon />}
          sx={{ mt: 'auto', color: subtitleColor }}>
          {t('closeTimerMenu')}
        </Button>
      </Drawer>
    </>
  )
}
