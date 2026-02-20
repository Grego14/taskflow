import MenuAction from '@components/reusable/MenuAction'
import ArchiveProjectDialog from './ArchiveProjectDialog'
import ArchiveIcon from '@mui/icons-material/Inventory'
import Button from '@mui/material/Button'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ArchiveProject({ id, owner, asButton, disabled }) {
  const { t } = useTranslation('projects')
  const [open, setOpen] = useState(false)

  return (
    <>
      {asButton ? (
        <Button
          startIcon={<ArchiveIcon fontSize='small' />}
          color='warning'
          variant='outlined'
          fullWidth
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          {t('archiveProject')}
        </Button>
      ) : (
        <MenuAction
          handler={() => setOpen(true)}
          text={t('archiveProject')}
          icon={<ArchiveIcon color='warning' fontSize='small' />}
          disabled={disabled}
          sx={[
            theme => ({
              '& .MuiListItemText-root': { color: theme.palette.warning.light }
            })
          ]}
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
    </>
  )
}
