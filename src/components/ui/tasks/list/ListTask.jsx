import {
  Suspense,
  lazy,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

// components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CompleteButton from './CompleteButton'
import Content from './Content'
import Header from './Header'

const Subtasks = lazy(() => import('./Subtasks'))
const TaskContextMenu = lazy(() => import('./TaskContextMenu'))

import useProject from '@hooks/useProject'
import useTaskActions from '@hooks/useTaskActions'
import useTasks from '@hooks/useTasks'
import useUser from '@hooks/useUser'
import useContextMenu from './hooks/useContextMenu'

// utils
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'

export default memo(function ListTask({ data, subtask }) {
  const { metadata } = useUser()
  const filter = metadata?.lastUsedFilter

  const { isArchived } = useProject()
  const { tasks } = useTasks()
  const { updateStatus } = useTaskActions()

  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState(data?.status)

  const isOverdue = taskIsOverdue(data)

  // taskRef is only used when the data ref doesn't exists that happens when the
  // task is a non-overdue sub task. Sub tasks doesn't get added a global ref so
  // we use this as a fallback to let the user drag the subtask
  const taskRef = useRef(null)

  // if the task is overdue we only get the non-overdue subtasks
  const containsSubtasks = isOverdue
    ? data?.subtasks?.filter(subtask => taskIsOverdue(subtask))
    : data?.subtasks

  const [contextMenu, handler] = useContextMenu({ isArchived, tasks })

  useEffect(() => {
    const element = data?.ref?.current || taskRef?.current

    // only allow overdue tasks to be dragged
    //
    // maybe later add a new dropTarget that allow the user to delete a task
    // by dropping the task inside that container...
    if (!isOverdue || (isOverdue && filter !== 'default') || isArchived) return

    if (element) {
      return draggable({
        element,
        canDrag: () => true,
        getInitialData: () => ({ id: data.id, isOverdue }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false)
      })
    }
  }, [data, isArchived, filter, isOverdue])

  // if a member updates a task status this synchronizes it
  useEffect(() => {
    if (data?.status && status !== data?.status) {
      setStatus(data.status)
    }
  }, [status, data?.status])

  if (!data) return null

  return (
    <Card
      className='flex flex-column'
      ref={data?.ref || taskRef}
      sx={[
        {
          opacity: isDragging ? 0.5 : data.status === 'cancelled' ? 0.75 : 1,
          width: '100%',
          maxWidth: '30rem',
          mx: 'auto'
        },
        // the user clicks the task link on a non-overdue subtask and sets the
        // focused dataset
        theme => ({
          '&[data-focused]': {
            boxShadow: `0 3px 3px -2px ${theme.palette.primary.main},
                        0 2px 4px 1px ${theme.palette.primary.main},
                        0 1px 8px 1px ${theme.palette.primary.main}`
          }
        })
      ]}
      data-task-id={data.id}
      data-is-subtask={data?.isSubtask || null}
      data-parent-id={data?.subtask || null}
      elevation={3}>
      <Box
        className='flex flex-column'
        onContextMenu={handler}
        sx={{ p: 2, py: 1.5 }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <CompleteButton id={data.id} setStatus={setStatus} status={status} />
          <Header data={data} menuHandler={handler} status={status} />
        </Box>
        <Content data={data} status={status} />
      </Box>

      {containsSubtasks?.length > 0 && (
        <Suspense fallback={null}>
          <Subtasks
            data={data?.subtasks?.filter(subtask =>
              // if the parent task is overdue only show the overdue sub-tasks
              // non-overdue sub-tasks are going to be rendered on the today
              // tasks container with a link to the parent task
              isOverdue ? taskIsOverdue(subtask) : subtask
            )}
            contextMenuHandler={handler}
          />
        </Suspense>
      )}

      {!!contextMenu && (
        <Suspense fallback={null}>
          <TaskContextMenu
            open={!!contextMenu}
            setOpen={handler}
            data={contextMenu}
          />
        </Suspense>
      )}
    </Card>
  )
})
