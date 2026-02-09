import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

export default function CircleLoader({ text, height = '100%' }) {
  const { t } = useTranslation('common')

  return (
    <Box
      sx={{
        width: '100%',
        height,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <CircularProgress
        color='secondary'
        {...(text ? { 'aria-hidden': true } : { 'aria-label': t('loading') })}
      />
      {text && <Typography>{text}</Typography>}
    </Box>
  )
}
