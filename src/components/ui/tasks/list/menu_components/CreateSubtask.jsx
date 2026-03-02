import MenuAction from '@components/reusable/MenuAction'
import AddIcon from '@mui/icons-material/Add'
import { Suspense, lazy, useState } from 'react'
import { useTranslation } from 'react-i18next'

const NewTaskDialog = lazy(
  () => import('@components/reusable/dialogs/newtask/NewTaskDialog')
)

export default function CreateSubtask({ id, showMenu }) {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const { t } = useTranslation('tasks')

  const handleOpen = () => setTaskDialogOpen(true)

  const handleCreate = () => {
    setTaskDialogOpen(false)
    showMenu(false)
  }

  return (
    <>
      <MenuAction
        text={t('actions.createSubtask')}
        handler={handleOpen}
        icon={<AddIcon fontSize='small' />}
        styles={{
          color: 'primary.main',
          '& .MuiListItemIcon-root': { color: 'primary.main' }
        }}
      />

      {taskDialogOpen && (
        <Suspense fallback={null}>
          <NewTaskDialog
            open={taskDialogOpen}
            setOpen={setTaskDialogOpen}
            subtask
            taskId={id}
            onCreate={handleCreate}
          />
        </Suspense>
      )}
    </>
  )
}
