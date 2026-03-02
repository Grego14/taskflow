import DropdownMenu from '@components/reusable/DropdownMenu'

import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'
import useTasks from '@hooks/useTasks'

import { priorityColors } from '@/constants'
import {
  getPriorityStyles,
  renderPriorityMenu,
  getPriorityLabel
} from '@utils/tasks/priorityUI'

export default function UpdatePriority({ priority, id, subtask }) {
  const { t } = useTranslation('tasks')
  const { isArchived } = useProject()
  const { actions } = useTasks()
  const [fg, bg] = priorityColors[priority || 'none']

  const handleUpdatePriority = async (priority, triggerExit) => {
    triggerExit()
    await actions.updateTask({ id, subtask, data: { priority } })
  }

  return (
    <DropdownMenu
      disableTooltip
      label={t('changePriority')}
      text={getPriorityLabel(priority)}
      buttonStyles={(theme) => getPriorityStyles(theme, { fg, bg, isArchived })}
      disabled={isArchived}>
      {(triggerExit) =>
        renderPriorityMenu(priority, (val) => handleUpdatePriority(val, triggerExit), t)
      }
    </DropdownMenu>
  )
}
