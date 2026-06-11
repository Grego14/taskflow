import DropdownMenu from '@components/reusable/DropdownMenu'
import PriorityButton from '@components/reusable/tasks/PriorityButton'

import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'
import useTasks from '@hooks/useTasks'

import { priorityColors } from '@/constants'
import { renderPriorityMenu, getPriorityLabel } from '@utils/tasks/priorityUI'

export default function UpdatePriority({ priority, id, parentId, showMenu }) {
  const { t } = useTranslation('tasks')
  const { isArchived } = useProject()
  const { actions } = useTasks()
  const [fg, bg] = priorityColors[priority || 'none']

  const handleUpdatePriority = async (priority, triggerExit) => {
    triggerExit()
    showMenu(false)
    await actions.updateTask({ id, parentId, data: { priority } })
  }

  return (
    <DropdownMenu
      disableTooltip
      label={t('changePriority')}
      disabled={isArchived}
      slots={{ root: PriorityButton }}
      slotProps={{
        root: {
          priority,
          isArchived,
          children: getPriorityLabel(priority)
        },
      }}>
      {(_, triggerExit) => renderPriorityMenu(priority, 
          (val) => handleUpdatePriority(val, triggerExit), t)}
    </DropdownMenu>
  )
}
