import IconButton from '@mui/material/IconButton'
import GridViewIcon from '@mui/icons-material/GridView'
import AppTooltip from '@components/reusable/AppTooltip'
import ButtonListItem from '@components/reusable/buttons/ButtonListItem'

import { useEffect } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'

import { isDrawerOpen } from '@stores/ui'

export default function ToggleProjectDrawer({ onMount, onList = true }) {
  const { t } = useTranslation(['projects', 'common'])
  const { toggleDrawer } = useLayout()
  const drawerOpen = isDrawerOpen.value

  const sidebarName = t('sidebar', { ns: 'projects' })
  const label = t(drawerOpen ? 'close_x' : 'open_x', {
    x: sidebarName,
    ns: 'common'
  })

  useEffect(() => {
    const timer = requestAnimationFrame(() => onMount?.())
    return () => cancelAnimationFrame(timer)
  }, [onMount])

  const btnProps = {
    edge: 'start',
    color: 'inherit',
    onClick: toggleDrawer,
    sx: {
      ml: 0,
      alignSelf: 'center',
      display: { xs: 'flex', tablet: 'none' }
    }
  }

  if (!onList) return (
    <IconButton {...btnProps}>
      <GridViewIcon fontSize='medium' />
    </IconButton>
  )

  return (
    <AppTooltip title={label}>
      <ButtonListItem component={IconButton} btnProps={btnProps}>
        <GridViewIcon fontSize='medium' />
      </ButtonListItem>
    </AppTooltip>
  )
}
