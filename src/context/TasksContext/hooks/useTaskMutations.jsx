import Button from '@mui/material/Button'

import { useMutation } from '@tanstack/react-query'
import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'

import taskService from '@services/task'

export default function useTaskMutations({ deletedTaskData, setDeletedTaskData }) {
  const { t } = useTranslation(['tasks', 'common'])
  const { appNotification } = useApp()
  const { id: projectId, data: projectData } = useProject()

  const ownerId = projectData?.createdBy

  const deleteTaskMutation = useMutation({
    mutationKey: ['deleteTask'],
    mutationFn: ({ id, subtask, deleteSubtasks }) =>
      taskService.deleteTask({
        ownerId,
        projectId,
        taskId: subtask || id,
        subtaskId: subtask ? id : null,
        deleteSubtasks
      }),
    onSuccess: () => {
      const undoTaskRemoval = async () => {
        await taskService.createTask({
          ownerId,
          projectId,
          data: deletedTaskData,
          subtaskId: deletedTaskData?.isSubtask
            ? deletedTaskData.parentId
            : null
        })
        setDeletedTaskData(null)
      }

      appNotification({
        message: t('tasks:notifications.taskDeleted'),
        onClose: () => setDeletedTaskData(null),
        action: !deletedTaskData?.isSubtask && (
          <Button
            sx={theme => ({ ...theme.typography.body2 })}
            onClick={undoTaskRemoval}>
            {t('common:undo')}
          </Button>
        )
      })
    }
  })

  const updateTaskMutation = useMutation({
    mutationKey: ['updateTask'],
    mutationFn: ({ id, data, subtask }) =>
      taskService.updateTask({
        ownerId,
        projectId,
        // if subtask exists it means the task is a subtask (subtask prop will
        // be the id of the parent task)
        taskId: subtask || id,
        subtaskId: subtask ? id : null,
        data
      })
  })

  return { deleteTaskMutation, updateTaskMutation }
}
