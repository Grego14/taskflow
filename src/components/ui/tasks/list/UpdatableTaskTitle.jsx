import TextField from '@mui/material/TextField'
import useAuth from '@hooks/useAuth'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import { useRef, useState, useEffect } from 'preact/compat'
import { useTranslation } from 'react-i18next'

import { setGlobalAlert } from '@stores/ui'
import { useCallback } from 'preact/hooks'

export default function UpdatableTaskTitle({
  title,
  taskId,
  parentId,
  show,
  setShow,
  isChecked,
  isCancelled
}) {
  const { t } = useTranslation('tasks')
  const { isOffline } = useAuth()
  const { isArchived } = useProject()
  const { actions } = useTasks()

  const [taskTitle, setTaskTitle] = useState(title)
  const lastUpdatedTitle = useRef(title)
  const inputRef = useRef(null)

  // sync internal state if title prop changes from outside
  useEffect(() => {
    if(title !== lastUpdatedTitle.current){
      setTaskTitle(title)
      lastUpdatedTitle.current = title
    }
  }, [title])

  const handleUpdate = useCallback((val) => {
    const trimmedTitle = val.trim()

    // no changes, empty or archived
    if (!trimmedTitle || trimmedTitle === lastUpdatedTitle.current || isArchived) {
      setTaskTitle(lastUpdatedTitle.current)
      return
    }

    if (isOffline) {
      setGlobalAlert({ message: t('noUpdate'), status: 'error' })
      setTaskTitle(lastUpdatedTitle.current)
      inputRef.current?.blur()
      return
    }

    lastUpdatedTitle.current = trimmedTitle

    actions.updateTask({
      id: taskId,
      data: { title: trimmedTitle },
      parentId
    })
  }, [actions.updateTask, isArchived, taskId, parentId, t])

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur() // this triggers handleUpdate via onBlur
    }

    if (e.key === 'Escape') {
      setTaskTitle(lastUpdatedTitle.current)
      setShow(false)
      inputRef.current?.blur()
    }
  }, [])

  return (
    <TextField
      fullWidth={show}
      inputRef={inputRef}
      value={taskTitle}
      placeholder={taskTitle}
      disabled={isArchived}
      onClick={() => setShow(true)}
      onChange={e => setTaskTitle(e.target.value)}
      onKeyDown={onKeyDown}
      onBlur={e => {
        setShow(false)
        handleUpdate(e.target.value)
      }}
      slotProps={{
        htmlInput: {
          sx: theme => ({
            py: 0.5,
            pl: 1,
            pr: show ? 1.75 : 0,
            fontSize: !parentId ? theme.typography.h6.fontSize : '.9rem',
            textOverflow: 'ellipsis',
            transition: 'color 0.3s ease',
            ...(isChecked && {
              textDecoration: isCancelled ? 'line-through' : 'none',
              textDecorationColor: isCancelled ? theme.palette.error.main : 'initial',
              textDecorationThickness: isCancelled ? 2 : 1,
              fontStyle: isCancelled ? 'italic' : 'inherit',
              color: !isCancelled ?
                theme.lighten(theme.palette.success.main, 0.25)
                : 'text.secondary'
            })
          })
        }
      }}
      sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          border: show ? 1 : '1px solid transparent',
          transition: 'box-shadow .25s ease-in-out, border-color .25s ease-in-out',
          boxShadow: show ? theme => `0 0 6px 2px ${theme.palette.action.focus}` : 'none'
        }
      }}
    />
  )
}
