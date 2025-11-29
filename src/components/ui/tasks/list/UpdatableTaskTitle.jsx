// components
import TextField from '@mui/material/TextField'

// hooks
import useAuth from '@hooks/useAuth'
import useApp from '@hooks/useApp'
import useDebounce from '@hooks/useDebounce.js'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import { useTheme } from '@mui/material/styles'
import lazyImport from '@utils/lazyImport'
import { useRef, useState } from 'react'
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
  const { t } = useTranslation('ui')
  const { currentUser, isOffline } = useAuth()
  const { appNotification } = useApp()
  const { id, isArchived } = useProject()
  const theme = useTheme()
  const { actions } = useTasks()

  const [taskTitle, setTaskTitle] = useState(title)
  const lastUpdatedTitle = useRef(taskTitle)
  const inputRef = useRef(null)

  const [debounceUpdate] = useDebounce(async e => {
    // update the task title if the user press the enter key or on blur
    if ((e.type === 'keydown' && e.keyCode === 13) || e.type === 'blur') {
      const trimmedTitle = e.target.value.trim()

      setTaskTitle(isOffline ? title : trimmedTitle)

      if (trimmedTitle === lastUpdatedTitle.current || isArchived) return

      // reset the title if the user is offline
      if (isOffline) {
        appNotification({ message: t('tasks.noUpdate'), status: 'error' })

        // remove the input focus so we avoid sending another notification if
        // the user blurs the input
        inputRef.current.blur()
        return
      }

      await actions?.updateTask({
        id: taskId,
        data: { title: trimmedTitle },
        subtask
      })
      lastUpdatedTitle.current = trimmedTitle
    }
  }, 1000)

  return (
    <TextField
      fullWidth
      disabled={isArchived}
      onChange={e => setTaskTitle(e.target.value)}
      onClick={() => setShow(true)}
      onBlur={e => {
        setShow(false)
        debounceUpdate(e)
      }}
      inputRef={inputRef}
      onKeyDown={debounceUpdate}
      slotProps={{
        htmlInput: {
          sx: [
            theme => ({
              py: !subtask ? 1 : 0.5,
              pl: 1,
              fontSize: !subtask ? theme.typography.h6.fontSize : '.9rem',
              textOverflow: 'ellipsis',
              ...(isChecked
                ? {
                    textDecoration: 'line-through',
                    textDecorationColor: isCancelled
                      ? theme.palette.error.main
                      : 'initial',
                    textDecorationThickness: isCancelled ? 2 : 1,
                    fontStyle: isCancelled ? 'italic' : 'inherit',
                    color: !isCancelled ? theme.palette.info.main : 'inherit'
                  }
                : {})
            })
          ]
        }
      }}
      value={taskTitle}
      sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          ...(show
            ? {
                transition:
                  'box-shadow .25s ease-in-out, border-color .25s ease-in-out',
                boxShadow: `0 0 6px 2px ${theme.palette.action.focus}`,
                border: 1
              }
            : { border: 'transparent' })
        }
      }}
    />
  )
}
