import MenuAction from '@components/reusable/MenuAction'
import Dialog from '@components/reusable/dialogs/Dialog'
import Delete from '@mui/icons-material/Delete'

import { useAuth } from '@/firebase/AuthContext'
import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import removeProject from '@services/removeProject'

export default function DeleteProject({ id }) {
  const { currentUser } = useAuth()
  const { t } = useTranslation('ui')
  const [open, setOpen] = useState(false)
  const { appNotification } = useApp()

  const loadingResources = useLoadResources('dialogs')

  async function handleProjectRemoval() {
    await removeProject({ user: currentUser?.uid, project: id })

    appNotification({ message: t('notifications.projectDeleted') })
  }

  return (
    <>
      <MenuAction
        handler={() => setOpen(true)}
        text={t('projects.deleteProject')}
        icon={<Delete color='error' fontSize='small' />}
        sx={[
          theme => ({
            '& .MuiListItemText-root': {
              color: theme.palette.error.light,
              ...theme.applyStyles('dark', { color: theme.palette.error.dark })
            }
          })
        ]}
      />

      <Dialog
        title='projects.delete'
        titleLoaded={!loadingResources}
        onClose={() => setOpen(false)}
        removeActonsDivider
        onAccept={handleProjectRemoval}
        open={open}
      />
    </>
  )
}
