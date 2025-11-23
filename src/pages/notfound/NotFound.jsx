import GoBackButton from '@components/reusable/buttons/GoBackButton'
import useUser from '@hooks/useUser'
import GoBackIcon from '@mui/icons-material/ChevronLeft'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const { t } = useTranslation('ui')
  const navigate = useNavigate()
  const { preferences } = useUser()
  const userTheme = preferences?.theme || 'light'

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
        my: 'auto',
        height: '100dvh'
      }}>
      <Typography variant='h3' textAlign='center' color='error'>
        404
      </Typography>
      <Typography
        className='text-balance text-center'
        variant='h4'
        sx={[
          theme => ({
            color: theme.palette.error[userTheme]
          })
        ]}>
        {t('ruteNotFound')}
      </Typography>
      <GoBackButton handler={() => navigate('/')} />
    </Box>
  )
}
