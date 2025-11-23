import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useTranslation } from 'react-i18next'

export default function AuthTexts({ type }) {
  const { t } = useTranslation('auth')

  return (
    <Box className='flex flex-column text-center' gap={0.75} mb={4}>
      <Typography variant='h1' sx={[theme => ({ ...theme.typography.h2 })]}>
        {t(`${type}.title0`)}
      </Typography>
      <Typography variant='h2' sx={[theme => ({ ...theme.typography.h4 })]}>
        {t(`${type}.title1`)}
      </Typography>
      <Typography color='textSecondary' className='text-balance'>
        {t(`${type}.text`)}
      </Typography>
    </Box>
  )
}
