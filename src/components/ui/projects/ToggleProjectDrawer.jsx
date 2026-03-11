import IconButton from '@mui/material/IconButton'
import GridViewIcon from '@mui/icons-material/GridView'
import Tooltip from '@mui/material/Tooltip'
import ButtonListItem from '@components/reusable/buttons/ButtonListItem'

import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'

export default function ToggleProjectDrawer() {
  const { t } = useTranslation(['projects', 'common'])
  const { toggleDrawer, drawerOpen } = useLayout()

  const sidebarName = t('sidebar', { ns: 'projects' })
  const label = t(drawerOpen ? 'close_x' : 'open_x', {
    x: sidebarName,
    ns: 'common'
  })

  return (
    <Tooltip title={label}>
      <ButtonListItem component={IconButton} btnProps={{
        edge: 'start',
        color: 'inherit',
        onClick: toggleDrawer,
        sx: {
          ml: 0,
          alignSelf: 'center',
          display: { xs: 'flex', tablet: 'none' }
        }
      }}>
        <GridViewIcon fontSize='medium' />
      </ButtonListItem>
    </Tooltip>
  )
}
