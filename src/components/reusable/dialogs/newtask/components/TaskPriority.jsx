import DropdownMenu from '@components/reusable/DropdownMenu'
import PriorityButton from '@components/reusable/tasks/PriorityButton'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { priorityColors } from '@/constants'
import { getPriorityLabel, renderPriorityMenu } from '@utils/tasks/priorityUI'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter'
import { useTranslation } from 'react-i18next'

export default function TaskPriority({ priority, updatePriority }) {
  const { t, i18n } = useTranslation('tasks')
  const [fg, bg] = priorityColors[priority || 'none']

  return (
    <DropdownMenu
      disableTooltip
      label={t('changePriority')}
      text={getPriorityLabel(priority)}
      slots={{ root: PriorityButton }}
      slotProps={{ root: { priority, children: getPriorityLabel(priority) } }}>
      {(_, triggerExit) =>
        renderPriorityMenu(
          priority,
          val => {
            triggerExit()
            updatePriority(val)
          },
          t
        )
      }
    </DropdownMenu>
  )
}
