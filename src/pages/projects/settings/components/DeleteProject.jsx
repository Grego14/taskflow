import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function DeleteProject({ isArchived, isOwner }) {
  const { t } = useTranslation('ui')
  const [openDelete, setOpenDelete] = useState(false)

  return (
    <Button
      startIcon={<DeleteIcon fontSize='small' />}
      color='error'
      variant='outlined'
      disabled={isArchived || !isOwner}>
      {t('projects.deleteProject')}
    </Button>
  )
}
