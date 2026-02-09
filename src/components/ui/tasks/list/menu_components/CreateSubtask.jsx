import MenuAction from '@components/reusable/MenuAction'
import AddIcon from '@mui/icons-material/Add'
import { useTheme } from '@mui/material/styles'
import { Suspense, lazy, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
const NewTaskDialog = lazy(
  () => import('@components/reusable/dialogs/newtask/NewTaskDialog')
)

export default function CreateSubtask({ id, showMenu }) {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [dialogProps, setDialogProps] = useState(null)
  const { t } = useTranslation('ui')
  const theme = useTheme()

  const color = theme.palette.primary.main

  return (
    <>
      <MenuAction
        text={t('tasks.actions.createSubtask')}
        data-taskid={id}
        handler={() => {
          setTaskDialogOpen(true)
          setDialogProps({ subtask: true, taskId: id })
        }}
        icon={<AddIcon fontSize='small' />}
        styles={{ color, '& .MuiListItemIcon-root': { color } }}
      />

      {taskDialogOpen && (
        <Suspense fallback={null}>
          <NewTaskDialog
            open={taskDialogOpen}
            setOpen={setTaskDialogOpen}
            {...dialogProps}
            onCreate={() => showMenu(false)}
          />
        </Suspense>
      )}
    </>
  )
}
