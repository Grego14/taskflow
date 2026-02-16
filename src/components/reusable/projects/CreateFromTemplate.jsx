import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@components/reusable/Link'

import { useTranslation } from 'react-i18next'

export default function CreateFromTemplate({ sx }) {
  const { t } = useTranslation(['common', 'projects'])

  return (
    <Box
      gap={{ xs: 1, mobile: 2 }}
      className='flex flex-column flex-center'
      sx={sx}
    >
      <Typography color='textSecondary' sx={[theme => ({ ...theme.typography.subtitle2 })]}>
        {t('or', { ns: 'common' })}
      </Typography>
      <Link to='/templates'>{t('createFromTemplate', { ns: 'projects' })}</Link>
    </Box>
  )
}
