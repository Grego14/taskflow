import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddRounded from '@mui/icons-material/AddRounded'
import RemoveRounded from '@mui/icons-material/RemoveRounded'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import { useTranslation } from 'react-i18next'

const MIN_TIME = 5
const MAX_TIME = 120
const STEP = 5

export default function CustomTimerSelector({ value, onChange, handleApply }) {
  const { t } = useTranslation('tasks')

  const handleIncrement = () => (value < MAX_TIME) && onChange(value + STEP)
  const handleDecrement = () => (value >= MIN_TIME) && onChange(value - STEP)

  return (
    <Box className='flex flex-center flex-column custom-timer-container'>
      <Box className='flex flex-center selector-row'>
        <IconButton 
          onClick={handleDecrement}
          disabled={value < MIN_TIME}
          className='step-btn'>
          <RemoveRounded />
        </IconButton>

        <Box className='time-display text-center'>
          <Typography className='time-value' variant='h4'>
            {value}
          </Typography>
          <Typography 
            variant='caption' 
            className='time-label'>
            {t('minutes')}
          </Typography>
        </Box>

        <IconButton 
          onClick={handleIncrement}
          disabled={value >= MAX_TIME}
          className='step-btn'>
          <AddRounded />
        </IconButton>
      </Box>

      <IconButton 
        color='primary'
        onClick={() => handleApply(value)}
        className='apply-timer-btn'>
        <PlayArrowIcon />
      </IconButton>
    </Box>
  )
}
