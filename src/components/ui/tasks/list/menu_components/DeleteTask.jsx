import { Suspense, lazy, useRef, useState } from 'react'

import MenuAction from '@components/reusable/MenuAction'
import DeleteIcon from '@mui/icons-material/Delete'

import useTaskActions from '@hooks/useTaskActions'
// hooks
import useUser from '@hooks/useUser'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

export default function DeleteTask({ id, subtask }) {
  const { deleteTask } = useTaskActions()
  const { t } = useTranslation(['common', 'dialogs'])
  const { preferences } = useUser()
  const theme = useTheme()

  const color = theme.palette.error[preferences.theme]

  return (
    <>
      <MenuAction
        text={t('delete_x', { ns: 'common', x: t('task', { ns: 'common' }) })}
        icon={<DeleteIcon fontSize='small' sx={{ color }} />}
        styles={{ color }}
        handler={deleteTask}
        data-task-id={id}
        // we pass null if the task is not a subtask because the method
        // getTaskMetadata used inside deleteTask will return isSubtask = string "false"
        data-is-subtask={!!subtask || null}
        data-parent-id={subtask}
      />
    </>
  )
}
