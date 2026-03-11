import { Suspense, lazy, useState } from 'preact/compat'

import MenuAction from '@components/reusable/MenuAction'
import DeleteIcon from '@mui/icons-material/Delete'

const ContainSubtasks = lazy(() => import('./ContainSubtasks'))

import useUser from '@hooks/useUser'
import useTasks from '@hooks/useTasks'
import { useTranslation } from 'react-i18next'
import useProject from '@hooks/useProject'

const getColor = (theme) => ({
  color: theme.palette.error.light,
  ...theme.applyStyles('dark', { color: theme.palette.error.dark })
})

export default function DeleteTask({
  id,
  subtask,
  subtasks,
  showMenu,
  isPreview
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
      await actions.deleteTask({ id, subtask, deleteSubtasks: true })
    } else {
      if (isPreview) {
        await actions.deleteTask({ id, subtask, deleteSubtasks: false })
        return
      }

      await actions.moveSubtasks({ taskId: id, subtasks })
    }
  }

  const handleDelete = async () => {
    const hasPendingSubtasks = !subtask && subtasks?.some(
      s => s.status !== 'done' && s.status !== 'cancelled')

    if (hasPendingSubtasks) {
      setOpenConfirm(true)
      return
    }

    showMenu(false)
    await actions.deleteTask({ id, subtask })
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
            isSubtask={!!subtask}
            parentId={subtask}
            onConfirm={handleConfirmDelete}
          />
        </Suspense>
      )}
    </>
  )
}
