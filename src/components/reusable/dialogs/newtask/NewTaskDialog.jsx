import Box from '@mui/material/Box'
import Grow from '@mui/material/Grow'
import Typography from '@mui/material/Typography'

import Dialog from '../Dialog'
import TaskDate from './components/TaskDate'
import TaskLabels from './components/TaskLabels'
import TaskPriority from './components/TaskPriority'
import TaskTitle from './components/TaskTitle'
import AssignMembers from '@components/reusable/tasks/AssignMembers'
import AssignedMembers from './components/AssignedMembers'

import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
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
import useTasks from '@hooks/useTasks'

import { priorities } from '@/constants'
import {
  getFriendlyAuthError,
  getFriendlyErrorFormatted
} from '@utils/getFriendlyAuthError.js'

import { initialValue, tasksReducer } from './tasksReducer.js'

const TITLE_REGEX = /^[\p{L}\d_()\s!@#%^&*+|\]\[;,.<>:?¿-]{3,}/u

const formatTaskData = async (task, subtask, taskId) => {
  const { default: getDateByKey } = await import('@utils/tasks/getDateByKey')

  const { members, ...data } = task
  const selectedDate = getDateByKey(data.dueDate)

  return {
    ...data,
    assignedTo: members,
    subtask: subtask ? taskId : null,
    dueDate: selectedDate,
    rawDate: data.dueDate
  }
}

export default memo(function NewTaskDialog({
  open,
  setOpen,
  taskId,
  subtask = false,
  onCreate,
  isArchived,
  isPreview
}) {
  // the isArchived state can't be changed so we dont pay attention to the
  // below hook calls
  if (isArchived) return null

  const { t } = useTranslation(['dialogs', 'tasks'])
  const { isOffline } = useAuth()
  const { preferences } = useUser()
  const { appNotification } = useApp()
  const { id, data: projectData, projectMembers } = useProject()
  const { actions } = useTasks()

  const [titleError, setTitleError] = useState(null)
  const [task, dispatch] = useReducer(tasksReducer, initialValue)

  const updateField = (field) => (payload) => dispatch({ type: field, payload })

  const handleAccept = useCallback(async () => {
    if (!TITLE_REGEX.test(task.title)) {
      setTitleError(t('dialogs:newtask.errors.title'))
      return
    }

    const passNonPreviewValidations = id && projectData?.createdBy && !isOffline
    if (!isPreview && (!passNonPreviewValidations)) return

    try {
      const taskDataFormatted = await formatTaskData(task, subtask, taskId)

      setOpen(false) // optimistic close

      await actions.createTask({
        data: taskDataFormatted,
        subtaskId: subtask ? taskId : null
      })

      onCreate?.()
    } catch (e) {
      const lang = preferences.lang || 'en'
      appNotification({
        message: getFriendlyAuthError(e.message, lang).message,
        status: 'error'
      })
    }
  }, [
    id,
    projectData,
    isOffline,
    subtask,
    task,
    taskId,
    actions,
    t
  ])

  const handleMemberRemoval = (memberId) => {
    const newMembers = task.members.filter(id => id !== memberId)
    updateField('members')(newMembers)
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      onAccept={handleAccept}
      disableAcceptBtn={!task.title}
      maxWidth='tablet'
      title={t('dialogs:newtask.title')}
      transitionComponent={Grow}
      sx={{
        '& .MuiSelect-select': {
          display: 'flex',
          fontSize: 'var(--fs-tiny)',
          gap: '.75rem',
          py: '.75rem',
          alignItems: 'center'
        },
        '& .form': { gap: '1.25rem' }
      }}>
      <form className='form flex flex-column'>
        <TaskTitle
          updateTitle={updateField('title')}
          error={titleError}
          updateError={setTitleError}
        />

        <Box display='flex' gap={2}>
          <TaskPriority
            priority={task.priority}
            updatePriority={updateField('priority')}
          />
          <TaskDate date={task.dueDate} setDate={updateField('dueDate')} />
        </Box>

        <TaskLabels
          actualLabels={task.labels}
          changeLabels={updateField('labels')}
        />

        <Box
          className='flex'
          gap={1}
          alignItems={task.members.length <= 0 ? 'center' : 'start'}
          justifyContent='space-between' >
          <Box className='flex flex-column' gap={1.5}>
            {task.members.length > 0 && (
              <Typography variant='subtitle1'>
                {t('tasks:assignedMembers')}
              </Typography>
            )}

            <AssignedMembers
              actualMembers={task.members}
              projectMembers={projectMembers}
              removeMember={handleMemberRemoval}
            />
          </Box>

          <AssignMembers
            sx={{ maxWidth: 'max-content' }}
            members={task.members}
            setMembers={updateField('members')}
            creatingTask
          />
        </Box>
      </form>
    </Dialog>
  )
})
