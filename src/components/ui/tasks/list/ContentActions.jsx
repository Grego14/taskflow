import DropdownMenu from '@components/reusable/DropdownMenu'
import DeleteIcon from '@mui/icons-material/Delete'
import ArchiveIcon from '@mui/icons-material/Inventory'
import Box from '@mui/material/Box'
import ContentAction from './ContentAction'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import useTaskActions from '@hooks/useTaskActions'
import useTasks from '@hooks/useTasks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// utils
import { priorities, priorityColors } from '@/constants'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter'
import { getButtonStyles, renderMenu } from './contentUtilities.jsx'

export default function ContentActions(props) {
  const { isOnlyMobile } = useApp()
  const { insideTask, status, taskPriority, id, isSubtask, subtask } = props
  const {
    deleteTask,
    updatePriority: updatePriorityAction,
    archiveTask
  } = useTaskActions()
  const { isArchived } = useProject()
  const { t } = useTranslation(['ui', 'common'])

  const canDelete = status === 'done' || status === 'cancelled'
  const isNone = taskPriority === 'none'
  const [showPriorityMenu, setShowPriorityMenu] = useState(false)

  const [priorityFg, priorityBg] = priorityColors[taskPriority]

  const updatePriority = async e => {
    updatePriorityAction(e)
    setShowPriorityMenu(false)
  }

  const priorityText = t(
    `tasks.priorities.${isNone ? 'noPriority' : taskPriority}`,
    { ns: 'ui' }
  )
  const formattedPriorityText = t('tasks.priorities.priority_p', {
    p: upperCaseInitialLetter(priorityText),
    ns: 'ui'
  })

  const actionIconSize = isOnlyMobile ? 'medium' : 'small'

  return canDelete ? (
    <Box className='flex' gap={isOnlyMobile ? 3 : 1.25}>
      <ContentAction
        insideTask={insideTask}
        icon={<DeleteIcon color='error' fontSize={actionIconSize} />}
        text={t('delete_x', { ns: 'common', x: t('task', { ns: 'common' }) })}
        color='error'
        onClick={deleteTask}
        disabled={isArchived}
      />
      <ContentAction
        insideTask={insideTask}
        icon={<ArchiveIcon fontSize={actionIconSize} color='warning' />}
        text={t('tasks.archiveTask', { ns: 'ui' })}
        color='warning'
        onClick={archiveTask}
        disabled={isArchived}
      />
    </Box>
  ) : (
    <DropdownMenu
      label={t('tasks.changePriority')}
      onClick={() => setShowPriorityMenu(true)}
      forceClose={!showPriorityMenu}
      data-task-id={id}
      data-is-subtask={isSubtask || null}
      data-parent-id={subtask || null}
      text={upperCaseInitialLetter(
        isNone ? priorityText : formattedPriorityText
      )}
      tooltipPosition='bottom'
      buttonStyles={getButtonStyles({
        fg: priorityFg,
        bg: priorityBg,
        subtask: insideTask,
        isArchived
      })}
      disabled={isArchived}>
      {renderMenu(
        priorities,
        taskPriority,
        priorityColors,
        updatePriority,
        insideTask
      )}
    </DropdownMenu>
  )
}
