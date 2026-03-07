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
import { useGSAP } from '@gsap/react'

import useContextMenu from './hooks/useContextMenu'
import useTaskDropTarget from './hooks/useTaskDropTarget'
import useTaskDraggable from './hooks/useTaskDraggable'

import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import formatTimestamp from '@utils/formatTimestamp'
import { priorityColors } from '@/constants'
import sortTasks from '@utils/tasks/sortTasks'
import taskIsPending from '@utils/tasks/taskIsPending'
import gsap from 'gsap'

const taskStyles = (t, priority) => ({
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
  const [fg, bg] = priorityColors[data.priority || 'none']
  const status = data?.status

  // memoize subtasks to avoid re-filtering on every render
  const filteredSubtasks = useMemo(() => {
    if (!data?.subtasks?.length) return []

    return sortTasks(data.subtasks.filter(s =>
      isOverdue
        ? taskIsOverdue(s)
        : true))
  }, [data?.subtasks, isOverdue])

  const taskDate = data.createdAt?.seconds
    ? formatTimestamp(data.createdAt).raw
    : new Date()
  const diff = new Date() - taskDate
  const isNewTask = diff < 10000

  useGSAP(() => {
    const element = data?.ref || internalRef

    if (!element?.current || !isNewTask) return

    gsap.fromTo(element.current, {
      autoAlpha: 0,
      y: -25,
      ease: 'power3.out'
    }, {
      autoAlpha: 1,
      y: 0
    })
  })

  if (!data) return null

  const isOverdueLabelVisible = filter !== 'default' &&
    taskIsPending(status) &&
    taskIsOverdue(data)

  const taskOpacity = isNewTask ? 0
    : isDragging || isOverdueLabelVisible ? 0.5
      : data.status === 'cancelled' ? 0.75 : 1

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
          opacity: taskOpacity
        })]}>
        <Box
          className='flex flex-column'
          onContextMenu={(e) => handler(e, data.id)}
          sx={{ p: 2, py: 1.5 }}>
          <Box className='flex' sx={{ width: '100%', alignItems: 'center', gap: 1 }}>
            <CompleteButton id={data.id} status={status} />
            <Header data={data} status={status} />
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
