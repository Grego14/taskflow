import { Suspense, lazy, memo, useEffect, useRef, useMemo } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CompleteButton from './CompleteButton'
import Header from './Header'
import DropIndicator from './DropIndicator'

const Subtasks = lazy(() => import('./Subtasks'))
const TaskContextMenu = lazy(() => import('./TaskContextMenu'))
const OverdueContent = lazy(() => import('./OverdueContent'))

import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import useLayout from '@hooks/useLayout'

import useContextMenu from './hooks/useContextMenu'
import useTaskDropTarget from './hooks/useTaskDropTarget'
import useTaskDraggable from './hooks/useTaskDraggable'

import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import { priorityColors } from '@/constants'
import sortTasks from '@utils/tasks/sortTasks'
import taskIsPending from '@utils/tasks/taskIsPending'

const taskStyles = (t, priority) => ({
  backgroundColor: t.alpha(t.palette.background.paper, 0.5),
  backgroundImage:
    `linear-gradient(90deg, ${priorityColors[priority][0]}40 60%, ${t.alpha(t.palette.background.paper, 0.5)})`,
  borderRadius: '12px',
  border: '1px solid',
  borderColor: 'divider',
  '&:hover': {
    borderColor: 'primary.main',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
  },
  width: '100%',
  maxWidth: '30rem',
  mx: 'auto',
  borderLeftWidth: 4,
  transitionProperty: 'opacity, background-color, border-color, box-shadow',
  cursor: 'grab',
  // the user clicks the task link on a non-overdue subtask and sets the
  // focused dataset
  '&[data-focused]': { boxShadow: `0 0 0 2px ${t.palette.primary.main}` }
})

export default memo(function ListTask({ data }) {
  const { isArchived } = useProject()
  const { tasks, actions } = useTasks()
  const { filter } = useLayout()

  const internalRef = useRef(null)
  const element = data?.ref || internalRef
  const isOverdue = taskIsOverdue(data)

  const { isDragging } = useTaskDraggable({
    data: { ...data, ref: element },
    isArchived,
    type: 'task',
    extraData: { isOverdue }
  })

  const { isTopVisible, isBottomVisible } = useTaskDropTarget({
    data: { ...data, ref: element },
    list: tasks,
    type: 'task',
    onDrop: (source, target, edge) =>
      actions.handleReorder(source, target.id, edge)
  })

  const [contextMenu, handler] = useContextMenu({ isArchived, tasks })
  const [fg] = priorityColors[data.priority || 'none']
  const status = data?.status

  // memoize subtasks to avoid re-filtering on every render
  const filteredSubtasks = useMemo(() => {
    if (!data?.subtasks?.length) return []

    return sortTasks(data.subtasks.filter(s =>
      isOverdue
        ? taskIsOverdue(s)
        : true))
  }, [data?.subtasks, isOverdue])

  if (!data) return null

  const isOverdueLabelVisible = filter !== 'default' &&
    taskIsPending(status) &&
    taskIsOverdue(data)

  return (
    <Box className='relative flex flex-center flex-column'>
      <DropIndicator visible={isTopVisible} maxWidth='25rem' isTop />

      <Card
        className='flex flex-column'
        ref={data?.ref || internalRef}
        elevation={3}
        sx={[theme => ({
          ...taskStyles(theme, data.priority),
          borderLeftColor: fg,
          opacity: isDragging || isOverdueLabelVisible
            ? 0.5 : data.status === 'cancelled' ? 0.75 : 1
        })]}>
        <Box
          className='flex flex-column'
          onContextMenu={handler}
          sx={{ p: 2, py: 1.5 }}>
          <Box className='flex' sx={{ width: '100%', alignItems: 'center', gap: 1 }}>
            <CompleteButton id={data.id} status={status} />
            <Header data={data} menuHandler={handler} status={status} />
          </Box>

          <Suspense fallback={null}>
            {isOverdue && <OverdueContent
              data={data}
              status={status}
              isOverdueLabelVisible={isOverdueLabelVisible} />
            }
          </Suspense>
        </Box>

        {filteredSubtasks.length > 0 && (
          <Suspense fallback={null}>
            <Subtasks
              data={filteredSubtasks}
              contextMenuHandler={handler}
              isParentOverdue={isOverdue}
            />
          </Suspense>
        )}
      </Card>

      <DropIndicator visible={isBottomVisible} maxWidth='25rem' />

      {!!contextMenu && (
        <Suspense fallback={null}>
          <TaskContextMenu
            open={!!contextMenu}
            setOpen={handler}
            data={contextMenu}
          />
        </Suspense>
      )}
    </Box>
  )
})
