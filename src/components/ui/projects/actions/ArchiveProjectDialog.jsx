import Dialog from '@components/reusable/dialogs/Dialog'
import useLoadResources from '@hooks/useLoadResources'
import projectService from '@services/project'
import { useTranslation } from 'react-i18next'
import useUser from '@hooks/useUser'

import { setGlobalAlert } from '@stores/ui'

export default function ArchiveProjectDialog({ open, onClose, projectId }) {
  const { uid } = useUser()
  const { t } = useTranslation(['dialogs', 'ui'])

  const handleArchive = async () => {
    try {
      await projectService.archiveProject(uid, projectId)

      setGlobalAlert({
        message: t('notifications.projectArchived', { ns: 'ui' }),
        status: 'success'
      })

      onClose()
    } catch (err) {
      console.error(err)
      setGlobalAlert({
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
