import { lazy } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
const Dialog = lazy(() => import('@components/reusable/dialogs/Dialog'))

import useLoadResources from '@hooks/useLoadResources'
import useTasks from '@hooks/useTasks'
import lazyImport from '@utils/lazyImport'
import getTaskMetadata from '@utils/tasks/getTaskMetadata'
import { useTranslation } from 'react-i18next'
import useProject from '../../../hooks/useProject'

export default function ContainSubtasks({
  open,
  close,
  taskId,
  isSubtask,
  parentId
}) {
  const { t } = useTranslation('dialogs')
  const { actions, tasks } = useTasks()
  const { data: projectData } = useProject()

  const loadingResouces = useLoadResources('dialogs')

  return (
    <Dialog
      maxWidth='mobile'
      onClose={close}
      open={open}
      removeActions
      title='deleteTask.title'
      titleLoaded={!loadingResouces}>
      <Box className='flex flex-column text-balance' gap={2}>
        <Button
          variant='outlined'
          onClick={async e => {
            await actions.deleteTask({
              id: isSubtask ? parentId : taskId,
              subtask: isSubtask ? taskId : null,
              deleteSubtasks: true
            })

            close()
          }}>
          {t('deleteTask.deleteAll', { ns: 'dialogs' })}
        </Button>
        <Button
          variant='outlined'
          onClick={async () => {
            const taskData = tasks.find(task => task.id === taskId)
            const tasksToMove = taskData.subtasks

            if (Array.isArray(tasksToMove) && tasksToMove.length < 1) return

            const moveSubtasks = await lazyImport('/src/services/moveSubtasks')
            await moveSubtasks({
              user: projectData?.createdBy,
              project: projectData?.id,
              task: taskId,
              tasks: tasksToMove
            })
            close()
          }}>
          {t('deleteTask.schedule', { ns: 'dialogs' })}
        </Button>
      </Box>
    </Dialog>
  )
}
