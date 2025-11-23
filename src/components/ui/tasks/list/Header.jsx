// components
import DropdownMenu from '@components/reusable/DropdownMenu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import TaskCalendar from './TaskCalendar'
import UpdatableTaskTitle from './UpdatableTaskTitle'
import TaskActions from './menu_components/TaskActions'

// hooks
import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import useUser from '@hooks/useUser'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

// utils
import formatTimeAgo from '@utils/formatTimeAgo'
import formatTimestamp from '@utils/formatTimestamp'
import getMenuLabel from '@utils/getMenuLabel'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'

// the insideTask prop is only used when rendering a subtask
export default function Header({ data, insideTask = false, status }) {
  const { isMobile, isOnlyMobile } = useApp()
  const { t } = useTranslation('ui')
  const { isArchived } = useProject()

  const { preferences } = useUser()
  const locale = preferences?.locale
  const { tasks } = useTasks()
  const [showTitle, setShowTitle] = useState()

  const [open, setOpen] = useState(false)

  if (!data) return null

  // if the task is not overdue and is a sub task it should be outside the task
  // sub tasks (this is just used for styling purposes)
  const isSubtask = data?.isSubtask && taskIsOverdue(data)

  // check if the seconds field exists (if so it means the date is a firebase Timestamp)
  const createdAt = data.createdAt?.seconds
    ? formatTimestamp(data.createdAt, locale)?.raw
    : // fallback to show when the task is new (firebase needs to update the serverTimestamp)
      new Date()

  const createdDate = formatTimeAgo(createdAt, locale)

  const isDone = status === 'done'
  const isCancelled = status === 'cancelled'

  const subheader = (() => {
    const createdDateText = t('tasks.created_date', { date: createdDate })

    // wait till the cancelledDate or the completedDate Firebase serverTimestamp
    // is updated... otherwise the subheader will be something like
    // "completed/cancelled 50 years ago"
    if ((!data.cancelledDate && isCancelled) || (!data.completedDate && isDone))
      return createdDateText

    if (isDone || isCancelled) {
      const formattedTimestamp = formatTimeAgo(
        formatTimestamp(
          isCancelled ? data?.cancelledDate : data?.completedDate,
          locale
        )?.raw || new Date(), // current date as fallback
        locale
      )

      return t(`tasks.${isCancelled ? 'cancelled' : 'completed'}_date`, {
        date: formattedTimestamp
      })
    }

    return createdDateText
  })()

  return (
    <CardHeader
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        p: 0,
        width: '100%'
      }}
      action={
        !showTitle ? (
          <Box className='flex' gap={1}>
            {!isOnlyMobile && (
              <TaskCalendar
                rawDate={data?.rawDate}
                taskId={data.id}
                isSubtask={data.isSubtask}
                parentId={data.subtask}
              />
            )}
            <DropdownMenu
              icon={<MoreVertIcon />}
              // the menuHandler of the TaskActions component will set open to
              // false when the task is created it means the menu should be hiden
              forceClose={!open}
              tooltipPosition='top'
              disabled={isArchived}
              onClick={() => setOpen(true)}
              label={state =>
                getMenuLabel(state, 'tasks.taskActionsLabel', 'ui')
              }>
              <TaskActions
                id={data.id}
                isSubtask={data.isSubtask}
                subtask={data.subtask}
                members={data.assignedTo}
                menuHandler={setOpen}
                rawDate={data.rawDate}
              />
            </DropdownMenu>
          </Box>
        ) : null
      }
      disableTypography
      title={
        <UpdatableTaskTitle
          title={data.title}
          taskId={data.id}
          isChecked={isDone || isCancelled}
          isCancelled={isCancelled}
          subtask={insideTask}
          show={showTitle}
          setShow={setShowTitle}
        />
      }
      subheader={
        <Typography
          variant={!insideTask ? 'body2' : 'caption'}
          color='textSecondary'
          ml={1}>
          {subheader}
        </Typography>
      }
    />
  )
}
