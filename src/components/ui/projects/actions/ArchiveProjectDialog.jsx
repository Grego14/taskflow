import Dialog from '@components/reusable/dialogs/Dialog'
import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'
import projectService from '@services/project'
import { useTranslation } from 'react-i18next'
import useUser from '@hooks/useUser'

export default function ArchiveProjectDialog({ open, onClose, projectId }) {
  const { uid } = useUser()
  const { t } = useTranslation(['dialogs', 'ui'])
  const { appNotification } = useApp()

  const handleArchive = async () => {
    try {
      await projectService.archiveProject(uid, projectId)

      appNotification({
        message: t('notifications.projectArchived', { ns: 'ui' }),
        status: 'success'
      })

      onClose()
    } catch (err) {
      console.error(err)
      appNotification({
        message: t('errors.couldNotArchive', { ns: 'ui' }),
        status: 'error'
      })
    }
  }

  return (
    <Dialog
      title='projects.archive'
      subTitle='projects.archive2'
      onAccept={handleArchive}
      open={open}
      onClose={onClose}
    />
  )
}
