import { 
  Suspense, 
  lazy, 
  memo, 
  useMemo, 
  useRef
} from 'preact/compat'
import TasksWrapper from '@components/ui/previews/list/components/TasksWrapper'
import Box from '@mui/material/Box'

const NoTodayTasks = lazy(() => import('./NoTodayTasks'))
const TaskContextMenu = lazy(() => 
  import('@components/ui/tasks/TaskContextMenu')
)

import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'
import useTasksDnDManager from '@hooks/tasks/useTasksDnDManager'
import useTasksContextMenu from '@hooks/tasks/useTasksContextMenu'

const TASKS_DROP_ID = 'todayTasks'

export default memo(function TasksContainer(props) {
  const { 
    taskIds = [], 
    overdueIds = [], 
    toArchiveIds = [],
    error
  } = props

  const { t } = useTranslation('tasks')
  const { filter } = useLayout()

  const isDefaultFilter = filter === 'default'
  const hasTodayTasks = taskIds.length > 0
  const hasOverdueTasks = overdueIds.length > 0
  const showOverdueTasks = hasOverdueTasks && isDefaultFilter
  const hasArchiveTasks = toArchiveIds.length > 0

  const containerRef = useRef(null)

  useTasksDnDManager(containerRef, TASKS_DROP_ID)
  const [contextMenu, onContextMenu] = useTasksContextMenu()

  const titleKey = useMemo(() => {
    if (!isDefaultFilter && !hasTodayTasks) return 'noTasksWithFilter_filter'
    if (isDefaultFilter && !hasTodayTasks) return 'todayTasks'

    const titleKeys = {
      assignedToMe: 'filterTasks_assignedToMe',
      default: 'todayTasks'
    }

    return titleKeys[filter] || 'filterTasks_filter'
  }, [filter, isDefaultFilter, hasTodayTasks])

  const todayTitle = t(titleKey, { count: taskIds.length, filter })

  const containerStyles = useMemo(() => (
    !hasTodayTasks ? {
      mt: showOverdueTasks ? 8 : 'auto',
      mb: showOverdueTasks ? 6 : 'auto'
    } : null
  ), [hasTodayTasks, showOverdueTasks])

  if(error) return null

  return (
    <Box ref={containerRef} onContextMenu={onContextMenu}>
      <TasksWrapper
        taskIds={taskIds}
        title={todayTitle}
        variant='h5'
        show={true}
        expand={true}
        divider={showOverdueTasks}
        containerStyles={containerStyles}>
        {(!hasTodayTasks && isDefaultFilter) ? (
          <Suspense fallback={null}>
            <NoTodayTasks />
          </Suspense>
        ) : null}
      </TasksWrapper>

      {showOverdueTasks ? (
        <TasksWrapper
          taskIds={overdueIds}
          title={t('overdueTasks_quantity', { quantity: overdueIds.length })}
          type='overdue'
        />
      ) : null}

      {hasArchiveTasks ? (
        <TasksWrapper
          taskIds={toArchiveIds}
          title={t('toArchiveTasks', { quantity: toArchiveIds.length })}
          expand={false}
        />
      ) : null}

      {!!contextMenu && (
        <Suspense fallback={null}>
          <TaskContextMenu
            open={!!contextMenu}
            setOpen={onContextMenu}
            data={contextMenu}
          />
        </Suspense>
      )}
    </Box>
  )
})
