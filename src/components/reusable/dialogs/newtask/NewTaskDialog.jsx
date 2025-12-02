// components
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'
import Dialog from '../Dialog'
import TaskDate from './components/TaskDate'
import TaskLabels from './components/TaskLabels'
import TaskMembers from './components/TaskMembers'
import TaskPriority from './components/TaskPriority'
import TaskTitle from './components/TaskTitle'

import useApp from '@hooks/useApp'
// hooks
import useAuth from '@hooks/useAuth'
import useLoadResources from '@hooks/useLoadResources'
import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import {
  memo,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

// utils
import { priorities } from '@/constants'
import {
  getFriendlyAuthError,
  getFriendlyErrorFormatted
} from '@utils/getFriendlyAuthError.js'
import lazyImport from '@utils/lazyImport'

// services
import createTask from '@services/createTask.js'
import updateProject from '@services/updateProject.js'

import getDateByKey from '@utils/tasks/getDateByKey'

// unique
import { initialValue, tasksReducer } from './tasksReducer.js'

export default memo(function NewTaskDialog({
  open,
  setOpen,
  taskId,
  subtask = false,
  onCreate,
  isArchived
}) {
  // the isArchived state can't be changed so we dont pay attention to the
  // below hook calls
  if (isArchived) return null

  const { t } = useTranslation(['dialogs', 'ui'])
  const { isOffline } = useAuth()
  const { preferences } = useUser()
  const { appNotification, isMobile } = useApp()
  const { id, data: projectData } = useProject()
  const [titleError, setTitleError] = useState(null)

  const loadingResources = useLoadResources('dialogs')
  const [task, dispatch] = useReducer(tasksReducer, initialValue)

  const setTaskTitle = useCallback(
    payload => dispatch({ type: 'update_title', payload }),
    []
  )
  const setTaskDueDate = useCallback(
    payload => dispatch({ type: 'update_dueDate', payload }),
    []
  )
  const setTaskPriority = useCallback(
    payload => dispatch({ type: 'update_priority', payload }),
    []
  )
  const setTaskLabels = useCallback(
    payload => dispatch({ type: 'update_labels', payload }),
    []
  )
  const setTaskMembers = useCallback(
    payload => dispatch({ type: 'update_members', payload }),
    []
  )

  const handleAccept = useCallback(async () => {
    if (!id || !projectData?.createdBy || isOffline) return

    if (!priorities.some(priority => priority === task.priority)) return

    if (!/^[\p{L}\d_()\s!@#%^&*+|\]\[;,.<>:?¿-]{3,}/u.test(task.title)) {
      setTitleError(t('newtask.errors.title', { ns: 'dialogs' }))
      return
    }

    const { members: _, ...data } = task

    try {
      // if the user is creating a subtask append the task parent id
      const taskData = subtask
        ? { ...data, assignedTo: _, subtask: taskId }
        : { ...data, assignedTo: _ }

      const selectedDate = getDateByKey(taskData.dueDate)

      const task = await createTask({
        user: projectData?.createdBy,
        project: id,
        data: {
          ...taskData,
          // convert the selected date to a iso string
          dueDate:
            // "nodate" date returns null so we don't ISOString it
            selectedDate instanceof Date
              ? selectedDate?.toISOString()
              : selectedDate,
          rawDate: taskData.dueDate
        },
        subtask
      })

      onCreate?.()
    } catch (e) {
      const lang = preferences.lang || 'en'
      const msg = e.message

      // console.error(e.message)
      appNotification({
        message: getFriendlyAuthError(msg, lang).message,
        status: 'error'
      })
      throw getFriendlyErrorFormatted('NewTaskDialog:', msg, lang).message
    } finally {
      setOpen(false)
    }
  }, [
    id,
    projectData?.createdBy,
    appNotification,
    isOffline,
    preferences.lang,
    onCreate,
    subtask,
    setOpen,
    task,
    taskId,
    t
  ])

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      onAccept={handleAccept}
      disableAcceptBtn={!task.title}
      maxWidth='tablet'
      title={t('newtask.title', { ns: 'dialogs' })}
      sx={{
        '& .MuiSelect-select': {
          display: 'flex',
          fontSize: 'var(--fs-tiny)',
          gap: '.75rem',
          py: '.75rem',
          alignItems: 'center'
        },
        '& .form': { gap: '1.25rem' },
        // date and priority selectors
        '& .MuiFormControl-root:not(".MuiTextField-root")': {
          mt: '.5rem'
        }
      }}
      titleLoaded={!loadingResources}>
      <form className='form flex flex-column'>
        <TaskTitle
          updateTitle={setTaskTitle}
          error={titleError}
          updateError={setTitleError}
        />

        <Box display='flex' gap={isMobile ? 2 : 4}>
          <TaskPriority
            priority={task.priority}
            updatePriority={setTaskPriority}
          />
          <TaskDate date={task.dueDate} setDate={setTaskDueDate} />
        </Box>

        <TaskLabels actualLabels={task.labels} changeLabels={setTaskLabels} />
        <TaskMembers members={task.members} updateMembers={setTaskMembers} />
      </form>
    </Dialog>
  )
})
