import DropdownMenu from '@components/reusable/DropdownMenu'
import ProjectActions from '@components/ui/drawer/components/ProjectActions'
import MenuIcon from '@mui/icons-material/TableRows'

import getMenuLabel from '@utils/getMenuLabel'

export default function ProjectActionsMenu() {
  return (
    <DropdownMenu
      icon={<MenuIcon fontSize='medium' />}
      label={state => getMenuLabel(state, 'buttons.actionsTooltip', 'ui')}
      tooltipPosition='top'>
      <ProjectActions open />
    </DropdownMenu>
  )
}
