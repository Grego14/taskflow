import MenuAction from '@components/reusable/MenuAction'
import ArchiveProjectDialog from './ArchiveProjectDialog'
import ArchiveIcon from '@mui/icons-material/Inventory'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ArchiveProject({ id, owner, asButton, disabled }) {
  const { t } = useTranslation('projects')
  const [open, setOpen] = useState(false)

  return (
    <Box>
      {asButton ? (
        <Button
          startIcon={<ArchiveIcon fontSize='small' />}
          color='warning'
          variant='outlined'
          onClick={() => setOpen(true)}
          className='project-action'
          disabled={disabled}>
          {t('archiveProject')}
        </Button>
      ) : (
        <MenuAction
          handler={() => setOpen(true)}
          text={t('archiveProject')}
          icon={<ArchiveIcon color='warning' fontSize='small' />}
          disabled={disabled}
          className='archive-menu-action'
        />
      )}

      {open && (
        <ArchiveProjectDialog
          open={open}
          onClose={() => setOpen(false)}
          projectId={id}
          ownerId={owner}
        />
      )}
    </Box>
  )
}
