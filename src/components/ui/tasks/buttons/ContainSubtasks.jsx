import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@components/reusable/dialogs/Dialog'

import useLoadResources from '@hooks/useLoadResources'
import { useTranslation } from 'react-i18next'

export default function ContainSubtasks({ open, close, onConfirm }) {
  const { t } = useTranslation('dialogs')
  const loadingResources = useLoadResources('dialogs')

  if (loadingResources) return null

  return (
    <Dialog
      maxWidth='mobile'
      onClose={close}
      open={open}
      removeActions
      title={t('deleteTask.title')}>
      <Box className='flex flex-column text-balance' gap={2} sx={{ mt: 1 }}>
        <Button
          variant='outlined'
          onClick={() => onConfirm(true)}>
          {t('deleteTask.deleteAll')}
        </Button>
        <Button
          variant='outlined'
          onClick={() => onConfirm(false)}>
          {t('deleteTask.schedule')}
        </Button>
      </Box>
    </Dialog>
  )
}
