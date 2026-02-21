import IconButton from '@mui/material/IconButton'
import GridViewIcon from '@mui/icons-material/GridView'
import Tooltip from '@mui/material/Tooltip'

import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'

export default function ToggleProjectDrawer() {
  const { t } = useTranslation(['projects', 'common'])
  const { setDrawerOpen, drawerOpen } = useLayout()

  const sidebarName = t('sidebar', { ns: 'projects' })
  const label = t(drawerOpen ? 'close_x' : 'open_x', {
    x: sidebarName,
    ns: 'common'
  })

  return (
    <Tooltip title={label}>
      <IconButton
        edge='start'
        color='inherit'
        aria-label={label}
        onClick={() => setDrawerOpen(prev => !prev)}
        sx={{ ml: 0, display: { xs: 'flex', tablet: 'none' } }}>
        <GridViewIcon fontSize='medium' />
      </IconButton>
    </Tooltip>
  )
}
