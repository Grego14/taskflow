import {
  Suspense,
  lazy,
  memo,
  useMemo,
  useLayoutEffect,
  forwardRef
} from 'preact/compat'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

import CompleteButton from './CompleteButton'
import Header from './Header'
import Subtasks from './Subtasks'
const Content = lazy(() => import('./Content'))
const DropIndicator = lazy(() => import('./DropIndicator'))

import useLayout from '@hooks/useLayout'
import useTaskAnimations from '@hooks/tasks/useTaskAnimations'
import useTask from '@hooks/tasks/useTask'

import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import { priorityColors } from '@/constants'
import sortTasks from '@utils/tasks/sortTasks'

import { taskRegistry, activeDropIndicator } from '@stores/task'

import '@styles/components/ui/tasks/taskElements.css'

const getTaskData = (id, type, isOverdue) => ({ id, type, isOverdue })

const getCardOpacity = (showIndicator, isOverdue, status, isDefaultFilter) =>
  // show the items with opacity only if the filter is the default
  (showIndicator || isOverdue || status === 'cancelled') && isDefaultFilter
    ? 0.75
    : 1

const ListTask = forwardRef(({ id, isPromoted = false }, ref) => {
  const { filter } = useLayout()
  const { animateItemEntrance } = useTaskAnimations()

  const data = useTask(id)
  const hasData = !!data?.id

  if (!data) return null

  const { status, priority = 'none', subtasks = [], parentId } = data

  const parentSignal = taskRegistry.peek().get(parentId)
  const parentData = parentSignal?.value // subscribe to the parent
  
  const isParentChecked = parentData?.status === 'done' || 
    parentData?.status === 'cancelled'

  const isOverdue = taskIsOverdue(data)
  const isChecked = status === 'done' || status === 'cancelled'

  const { sourceId, targetId, edge } = activeDropIndicator.value || {}
  const showIndicator = targetId === id && sourceId !== id
  const indicatorEdge = showIndicator ? edge : null

  const filteredSubtaskIds = useMemo(() => {
    if (!subtasks.length) return []

    const registry = taskRegistry.peek()
    const validSubtasks = []

    for (const id of subtasks) {
      const subtaskData = registry.get(id)?.peek()
      if (!subtaskData) continue

      // if parent is overdue, show only overdue subtasks if not, show all
      if (!isOverdue || taskIsOverdue(subtaskData)) 
        validSubtasks.push(subtaskData)
    }

    return sortTasks(validSubtasks).map(t => t.id)
  }, [subtasks, isOverdue])

  useLayoutEffect(() => {
    if (!hasData || !data.createdAt) return

    const createdTime = typeof data.createdAt === 'number' 
      ? data.createdAt 
      : data.createdAt.seconds * 1000

    const isNew = Math.abs(Date.now() - createdTime) < 5000

    if (isNew) animateItemEntrance(id)
  }, [hasData])

  const [priorityColor] = priorityColors[priority]
  const opacity = getCardOpacity(
    showIndicator, 
    isOverdue, 
    status, 
    filter === 'default'
  )

  const dynamicVars = {
    '--task-priority-color': priorityColor,
    '--task-opacity': opacity,
    '--task-bg-color': 
      'color-mix(in srgb, var(--mui-palette-grey-50), transparent 92.5%)'
  }

  if (!data) return null

  const containerClass = 
    `task-wrapper relative flex flex-center flex-column hide-element
    ${isOverdue ? 'is-overdue' : ''}`

  return (
    <div
      className={containerClass}
      data-task-id={id}
      data-type='task'
      data-parent-id={parentId}
      data-is-overdue={isOverdue}>
      <Suspense fallback={null}>
        {showIndicator && (<DropIndicator isTop={indicatorEdge === 'top'} />)}
      </Suspense>

      <Card
        className='task-card task-main flex flex-column'
        ref={ref}
        elevation={3}
        style={dynamicVars}>
        <div className='task-content-padding flex flex-column'>
          <div className='flex task-header-row'>
            <CompleteButton id={id} />
            <Header id={id} />
          </div>

          <Suspense fallback={null}>
            {(isOverdue || isParentChecked || isPromoted) && <Content id={id} />}
          </Suspense>
        </div>

        {filteredSubtaskIds.length > 0 && (
          <Subtasks
            subtaskIds={filteredSubtaskIds}
            isParentChecked={isParentChecked}
            isParentOverdue={isOverdue}
          />
        )}
      </Card>
    </div>
  )
})

export default memo(ListTask)
