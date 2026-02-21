import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Dialog from '../Dialog'

import { useTranslation } from 'react-i18next'

export default function KickMemberDialog(props) {
  const { t } = useTranslation('dialogs')
  const { username, ...other } = props

  return (
    <Dialog
      {...other}
      title={t('kickMember.title')}>
      <Box className='flex flex-column flex-center'>
        <Typography className='text-center' variant='body2' component='span'>
          {t('kickMember.text1')}
          <Typography variant='body2' fontWeight={600} component='span'>
            {username}
          </Typography>
          {t('kickMember.text2')}
        </Typography>
      </Box>
    </Dialog>
  )
}
