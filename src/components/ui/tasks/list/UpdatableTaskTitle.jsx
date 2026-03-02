import TextField from '@mui/material/TextField'
import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function UpdatableTaskTitle({
  title,
  taskId,
  subtask,
  show,
  setShow,
  isChecked,
  isCancelled
}) {
  const { t } = useTranslation('tasks')
  const { isOffline } = useAuth()
  const { appNotification } = useApp()
  const { isArchived } = useProject()
  const { actions } = useTasks()

  const [taskTitle, setTaskTitle] = useState(title)
  const lastUpdatedTitle = useRef(title)
  const inputRef = useRef(null)

  // sync internal state if title prop changes from outside
  useEffect(() => {
    setTaskTitle(title)
    lastUpdatedTitle.current = title
  }, [title])

  const handleUpdate = async (val) => {
    const trimmedTitle = val.trim()

    // no changes, empty or archived
    if (!trimmedTitle || trimmedTitle === lastUpdatedTitle.current || isArchived) {
      setTaskTitle(lastUpdatedTitle.current)
      return
    }

    if (isOffline) {
      appNotification({ message: t('noUpdate'), status: 'error' })
      setTaskTitle(lastUpdatedTitle.current)
      inputRef.current?.blur()
      return
    }

    await actions?.updateTask({
      id: taskId,
      data: { title: trimmedTitle },
      subtask
    })

    lastUpdatedTitle.current = trimmedTitle
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur() // this triggers handleUpdate via onBlur
    }

    if (e.key === 'Escape') {
      setTaskTitle(lastUpdatedTitle.current)
      setShow(false)
      inputRef.current?.blur()
    }
  }

  return (
    <TextField
      fullWidth={show}
      inputRef={inputRef}
      value={taskTitle}
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
            py: !subtask ? 1 : 0.5,
            pl: 1,
            fontSize: !subtask ? theme.typography.h6.fontSize : '.9rem',
            textOverflow: 'ellipsis',
            transition: 'color 0.3s ease',
            ...(isChecked && {
              textDecoration: 'line-through',
              textDecorationColor: isCancelled ? theme.palette.error.main : 'initial',
              textDecorationThickness: isCancelled ? 2 : 1,
              fontStyle: isCancelled ? 'italic' : 'inherit',
              color: !isCancelled ? theme.palette.info.main : 'text.secondary'
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
