import { Suspense, lazy, memo, useMemo } from 'react'

import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'

import Box from '@mui/material/Box'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import ViewListIcon from '@mui/icons-material/ViewList'

// there is a different layout for mobile and desktop so we lazy 
// load all these components
const VisibilityIcon = lazy(() => import('@mui/icons-material/Visibility'))
const Tab = lazy(() => import('@mui/material/Tab'))
const Tabs = lazy(() => import('@mui/material/Tabs'))
const DropdownMenu = lazy(() => import('@components/reusable/DropdownMenu'))
const MenuAction = lazy(() => import('@components/reusable/MenuAction'))

import { useTheme } from '@mui/material/styles'
import getMenuLabel from '@utils/getMenuLabel'
import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'

const getMenuActionStyles = (normal, selected) => ({
  '& .MuiSvgIcon-root': { color: normal },
  '&.Mui-selected .MuiSvgIcon-root': { color: selected },
  '&.Mui-selected .MuiListItemText-root': {
    color: selected,
    fontWeight: 'bold'
  }
})

const OPTIONS = [
  {
    id: 'list',
    keyTitle: 'listPreview',
    icon: ViewListIcon,
    disabled: false
  },
  {
    id: 'kanban',
    keyTitle: 'kanbanPreview',
    icon: ViewKanbanIcon,
    disabled: true
  }
]

export default memo(function PreviewSwitcher() {
  const { t } = useTranslation('tasks')
  const { isMobile } = useApp()
  const { preferences } = useUser()
  const { updatePreviewer } = useLayout()

  const theme = useTheme()

  const selectedColor = theme.palette.primary.main
  const normalColor = theme.palette.grey[600]
  const preview = preferences.previewer

  const previewStyles = {
    minHeight: 0,
    ...theme.typography.caption,
    py: 0.6,
    px: 1.5,
    color: normalColor,
    '&.Mui-selected': {
      color: selectedColor,
      fontWeight: 700
    }
  }

  return (
    // there's a bug that makes the DropdownMenu re-render and makes a layout
    // shift... so we add a wrapper with a default width
    <Box
      minWidth={isMobile ? '40px' : '12rem'}
      height='min-content'
      mr={{ tablet: 'auto' }}
      component='li'>
      <Suspense fallback={null}>
        {isMobile ? (
          <DropdownMenu
            icon={<VisibilityIcon fontSize='medium' />}
            label={state => getMenuLabel(state, 'buttons.previewLabel', 'ui')}
            tooltipPosition='top'>
            <Suspense fallback={null}>
              {OPTIONS.map(opt => (
                <MenuAction
                  key={opt.id}
                  handler={() => updatePreviewer(opt.id)}
                  text={t(opt.keyTitle)}
                  icon={<opt.icon />}
                  styles={[previewStyles, getMenuActionStyles(normalColor, selectedColor)]}
                  selected={preview === opt.id}
                  disabled={opt.disabled}
                />
              ))}
            </Suspense>
          </DropdownMenu>
        ) : (
          <Tabs
            value={preview}
            onChange={(_, preview) => updatePreviewer(preview)}
            aria-label={t('previewSwitcher')}
            indicatorColor={'primary'}
            centered
            sx={{ minHeight: 0 }}>
            {OPTIONS.map(opt => (
              <Tab
                key={opt.id}
                label={t(opt.keyTitle)}
                value={opt.id}
                icon={<opt.icon />}
                iconPosition='start'
                sx={previewStyles}
                disabled={opt.disabled}
              />
            ))}
          </Tabs>
        )}
      </Suspense>
    </ Box>
  )
})
