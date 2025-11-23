import MenuAction from '@components/reusable/MenuAction'
import AbandoneProjectDialog from '@components/reusable/dialogs/abandoneProject/AbandoneProjectDialog'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AbandonProject({ id, owner }) {
  const { t } = useTranslation('ui')
  const [open, setOpen] = useState(false)

  return (
    <>
      <MenuAction
        handler={() => setOpen(true)}
        text={t('projects.abandoneProject')}
        icon={<ExitToAppIcon fontSize='small' color='info' />}
        sx={[
          theme => ({
            '& .MuiListItemText-root': {
              color: theme.palette.info.light,
              ...theme.applyStyles('dark', {
                color: theme.palette.info.dark
              })
            }
          })
        ]}
      />
      {open && (
        <AbandoneProjectDialog
          open={open}
          onClose={() => setOpen(false)}
          projectId={id}
          projectOwner={owner}
        />
      )}
    </>
  )
}
