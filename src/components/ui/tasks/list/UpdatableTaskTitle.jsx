import TextField from '@mui/material/TextField'
import useAuth from '@hooks/useAuth'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import { useRef, useState, useEffect, useMemo } from 'preact/compat'
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
  }, [setShow])

  const fieldClassName = `task-title-field ${show ? 'is-editing' : ''}`

  const inputClassName = `
    task-title-input 
    ${show ? 'is-editing' : ''} 
    ${isChecked ? 'is-checked' : ''} 
    ${isCancelled ? 'is-cancelled' : ''}`

  const inputStyles = useMemo(() => {
    const checkedColor = !isCancelled 
      ? 'var(--mui-palette-success-light)' 
      : 'var(--mui-palette-text-secondary)'

    return {
      '--title-font': !parentId ? 'var(--mui-font-h6)' : '0.9rem',
      '--title-checked-color': checkedColor
    }
  }, [parentId, isCancelled])

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
      className={fieldClassName}
      slotProps={{
        htmlInput: {
          className: inputClassName,
          style: inputStyles
        }
      }}
    />
  )
}
