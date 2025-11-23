import RemoveIcon from '@mui/icons-material/Clear'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { lighten } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

export default function ProjectLabels({ labels = [], setLabels }) {
  const { t } = useTranslation('ui')

  return (
    <div>
      <Typography variant='body2' color='textSecondary'>
        {t('projects.settings.labelsLabel')}
      </Typography>
      <Typography variant='body2' my={1} fontStyle='italic'>
        {t('projects.settings.labelsInfo', { count: labels?.length })}
      </Typography>
      <Box className='flex flex-wrap' mt={1} gap={1}>
        {labels.map(label => (
          <Chip key={label} label={label} size='small' color='primary' />
        ))}
      </Box>
    </div>
  )
}
