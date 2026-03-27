import { useMutation } from '@tanstack/react-query'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'

import taskService from '@services/task'

export default function useTaskMutations() {
  const { t } = useTranslation(['tasks', 'common'])
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
      })
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
