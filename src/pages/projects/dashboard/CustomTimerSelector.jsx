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
  const {t} = useTranslation('tasks')

  const handleIncrement = () => {
    if (value < MAX_TIME) onChange(value + STEP)
  }

  const handleDecrement = () => {
    if (value > MIN_TIME) onChange(value - STEP)
  }

  return (
    <Box 
      className='flex flex-center flex-column'
      sx={{ 
        gap: 3,
        p: 2,
        bgcolor: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.03)',
        borderRadius: '16px',
        mx: 'auto',
        width: '100%'
      }}>
      <Box className='flex flex-center' width='100%' justifyContent='space-between'>
        <IconButton 
          onClick={handleDecrement}
          disabled={value <= MIN_TIME}
          sx={{ 
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { bgcolor: 'background.paper', opacity: 0.8 }
          }}>
          <RemoveRounded />
        </IconButton>

        <Box sx={{ textAlign: 'center', minWidth: '80px' }}>
          <Typography 
            variant='h4' 
            sx={{ 
              fontWeight: 700, 
              lineHeight: 1,
              color: 'primary.main' 
            }}>
            {value}
          </Typography>
          <Typography 
            variant='caption' 
            sx={{ 
              textTransform: 'uppercase', 
              letterSpacing: 1,
              fontWeight: 500,
              opacity: 0.7
            }}>
            {t('minutes')}
          </Typography>
        </Box>

        <IconButton 
          onClick={handleIncrement}
          disabled={value >= MAX_TIME}
          sx={{ 
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { bgcolor: 'background.paper', opacity: 0.8 }
          }}>
          <AddRounded />
        </IconButton>
      </Box>

      <IconButton 
        color='primary'
        onClick={() => handleApply(value)}
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          width: '45px',
          height: '45px',
          boxShadow: (theme) => `0 4px 14px ${theme.palette.primary.main}50`,
          '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' },
          '&:active': { transform: 'translateY(2px)' },
          transition: 'transform 0.2s ease-in-out'
        }}>
        <PlayArrowIcon />
      </IconButton>
    </Box>
  )
}
