import DropdownMenu from '@components/reusable/DropdownMenu'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'

import { useTranslation } from 'react-i18next'
import { priorityColors } from '@/constants'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter'
import {
  getPriorityStyles,
  renderPriorityMenu,
  getPriorityLabel
} from '@utils/tasks/priorityUI'

export default function TaskPriority({ priority, updatePriority }) {
  const { t, i18n } = useTranslation('tasks')
  const [fg, bg] = priorityColors[priority || 'none']

  return (
    <DropdownMenu
      disableTooltip
      label={t('changePriority')}
      text={getPriorityLabel(priority)}
      buttonStyles={(theme) => ({ ...getPriorityStyles(theme, { fg, bg }) })}>
      {(_, triggerExit) =>
        renderPriorityMenu(priority, (val) => {
          triggerExit()
          updatePriority(val)
        }, t)
      }
    </DropdownMenu>
  )
}
