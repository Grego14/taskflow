import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Dialog from '@components/reusable/dialogs/Dialog'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const getContextConfig = (key, t) => {
  const configs = {
    'profile': {
      title: t('preview:upsell.profile.title'),
      desc: t('preview:upsell.profile.desc')
    },
    'drawer-action': {
      title: t('preview:upsell.drawer.title'),
      desc: t('preview:upsell.drawer.desc')
    },
    'new-project': {
      title: t('preview:upsell.project.title'),
      desc: t('preview:upsell.project.desc')
    },
    'add-members': {
      title: t('preview:upsell.add-members.title'),
      desc: t('preview:upsell.add-members.desc')
    },
    'archive': {
      title: t('preview:upsell.archive.title'),
      desc: t('preview:upsell.archive.desc')
    }
  }

  return configs[key]
}

export default function UpsellDialog({ open, setOpen, upsellKey }) {
  const { t } = useTranslation()
  const config = getContextConfig(upsellKey, t)
  const navigate = useNavigate()

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth='mobile'
      fullWidth
      hideHeader
      removeActions>
      <Box sx={{ position: 'relative', p: 4, textAlign: 'center' }}>
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>

        <Box sx={{
          mb: 3,
          display: 'inline-flex',
          p: 2,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          <RocketLaunchIcon fontSize='large' />
        </Box>

        <Typography variant='h5' fontWeight={800} gutterBottom>
          {config.title}
        </Typography>

        <Typography color='textSecondary' sx={{ mb: 4 }}>
          {config.desc}
        </Typography>

        <Box className='flex flex-column' gap={2}>
          <Button
            variant='contained'
            size='large'
            fullWidth
            onClick={() => navigate('/signup')}
            sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}>
            {t('preview:upsell.button_primary')}
          </Button>

          <Button
            variant='text'
            fullWidth
            onClick={() => setOpen(false)}
            sx={{ textTransform: 'none' }}>
            {t('preview:upsell.button_secondary')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}
