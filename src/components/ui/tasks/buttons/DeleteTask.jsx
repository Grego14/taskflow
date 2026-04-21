import { Suspense, lazy, useState } from 'preact/compat'

import MenuAction from '@components/reusable/MenuAction'
import DeleteIcon from '@mui/icons-material/Delete'

const ContainSubtasks = lazy(() => import('./ContainSubtasks'))

import useUser from '@hooks/useUser'
import useTasks from '@hooks/useTasks'
import { useTranslation } from 'react-i18next'
import useProject from '@hooks/useProject'

import { taskRegistry } from '@stores/task'

const getColor = (theme) => ({
  color: theme.palette.error.light,
  ...theme.applyStyles('dark', { color: theme.palette.error.main })
})

export default function DeleteTask({
  id,
  parentId,
  subtaskIds,
  showMenu
}) {
  const { actions } = useTasks()
  const { t } = useTranslation('common')
  const { preferences } = useUser()
  const [openConfirm, setOpenConfirm] = useState(false)

  const { data } = useProject()
  const owner = data?.createdBy
  const projectId = data?.id

  const handleConfirmDelete = async (deleteAll) => {
    setOpenConfirm(false)

    if (deleteAll) {
      await actions.deleteTask({ id, parentId, deleteSubtasks: true })
      return
    }

    await actions.moveSubtasks({ taskId: id, subtaskIds })
  }

  const handleDelete = async () => {
    const registry = taskRegistry.value

    const hasPendingSubtasks = !parentId && subtaskIds?.some(sId => {
      const subtask = registry.get(sId)
      if (!subtask) return false

      return subtask.status !== 'done' && subtask.status !== 'cancelled'
    })

    if (hasPendingSubtasks) {
      setOpenConfirm(true)
      return
    }

    showMenu(false)
    await actions.deleteTask({ id, parentId })
  }

  return (
    <>
      <MenuAction
        text={t('delete_x', { x: t('task') })}
        icon={<DeleteIcon fontSize='small' sx={getColor} />}
        styles={getColor}
        handler={handleDelete}
      />

      {openConfirm && (
        <Suspense fallback={null}>
          <ContainSubtasks
            open={openConfirm}
            close={() => setOpenConfirm(false)}
            taskId={id}
            isSubtask={!!parentId}
            parentId={parentId}
            onConfirm={handleConfirmDelete}
          />
        </Suspense>
      )}
    </>
  )
}
