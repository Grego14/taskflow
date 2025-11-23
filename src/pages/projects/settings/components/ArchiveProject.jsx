import ArchiveIcon from '@mui/icons-material/Inventory'
import Button from '@mui/material/Button'

import useProject from '@hooks/useProject'
import { Suspense, lazy, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ArchiveProjectDialog = lazy(
  () =>
    import('@components/reusable/dialogs/archiveProject/ArchiveProjectDialog')
)

export default function ArchiveProject() {
  const { t } = useTranslation('ui')
  const [openArchive, setOpenArchive] = useState(false)
  const { id, isArchived, isOwner } = useProject()

  return (
    <>
      <Button
        startIcon={<ArchiveIcon fontSize='small' />}
        color='warning'
        variant='outlined'
        onClick={() => setOpenArchive(true)}
        disabled={isArchived || !isOwner}>
        {t('projects.archiveProject')}
      </Button>

      {openArchive && (
        <ArchiveProjectDialog
          open={open}
          onClose={() => setOpenArchive(false)}
          projectId={id}
        />
      )}
    </>
  )
}
