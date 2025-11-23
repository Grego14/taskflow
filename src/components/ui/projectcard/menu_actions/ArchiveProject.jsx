import MenuAction from '@components/reusable/MenuAction'
import ArchiveProjectDialog from '@components/reusable/dialogs/archiveProject/ArchiveProjectDialog'
import ArchiveIcon from '@mui/icons-material/Inventory'
import Button from '@mui/material/Button'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ArchiveProject({ id }) {
  const { t } = useTranslation('ui')
  const [open, setOpen] = useState(false)

  return (
    <>
      <MenuAction
        handler={() => setOpen(true)}
        text={t('projects.archiveProject')}
        icon={<ArchiveIcon color='warning' fontSize='small' />}
        sx={[
          theme => ({
            '& .MuiListItemText-root': {
              color: theme.palette.warning.light,
              ...theme.applyStyles('dark', {
                color: theme.palette.warning.dark
              })
            }
          })
        ]}
      />

      <ArchiveProjectDialog
        open={open}
        onClose={() => setOpen(false)}
        projectId={id}
      />
    </>
  )
}
