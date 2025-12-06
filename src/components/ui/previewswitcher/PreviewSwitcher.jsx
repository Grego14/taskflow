import { Suspense, lazy, memo, useMemo } from 'react'

import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'

import Box from '@mui/material/Box'
// there is a different layout for mobile and desktop so we lazy load all the
// components
const VisibilityIcon = lazy(() => import('@mui/icons-material/Visibility'))
const ViewKanbanIcon = lazy(() => import('@mui/icons-material/ViewKanban'))
const ViewListIcon = lazy(() => import('@mui/icons-material/ViewList'))
const Tab = lazy(() => import('@mui/material/Tab'))
const Tabs = lazy(() => import('@mui/material/Tabs'))
const DropdownMenu = lazy(() => import('@components/reusable/DropdownMenu'))
const MenuAction = lazy(() => import('@components/reusable/MenuAction'))

import { useTheme } from '@mui/material/styles'
import getMenuLabel from '@utils/getMenuLabel'
import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'

const menuActionStyles = (normal, selected) => ({
  '& .MuiSvgIcon-root': { color: normal },
  '&.Mui-selected .MuiSvgIcon-root': { color: selected },
  '&.Mui-selected .MuiListItemText-root': {
    color: selected,
    fontWeight: 'bold'
  }
})

export default memo(function PreviewSwitcher() {
  const { t } = useTranslation('ui')
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

  const previewProps = useMemo(
    () => ({
      list: {
        title: t('tasks.listPreview'),
        icon: <ViewListIcon />
      },
      kanban: {
        title: t('tasks.kanbanPreview'),
        icon: <ViewKanbanIcon />
      }
    }),
    [t]
  )

  return (
    // there's a bug that makes the DropdownMenu re-render and makes a layout
    // shift... so we add a wrapper with a default width
    <Box minWidth='40px'>
      <Suspense>
        {isMobile ? (
          <DropdownMenu
            icon={<VisibilityIcon fontSize='medium' />}
            label={state => getMenuLabel(state, 'buttons.previewLabel', 'ui')}
            tooltipPosition='top'>
            <MenuAction
              handler={() => updatePreviewer('list')}
              text={previewProps.list.title}
              icon={previewProps.list.icon}
              styles={[
                previewStyles,
                menuActionStyles(normalColor, selectedColor)
              ]}
              selected={preview === 'list'}
            />
            <MenuAction
              handler={() => updatePreviewer('kanban')}
              text={previewProps.kanban.title}
              icon={previewProps.kanban.icon}
              styles={[
                previewStyles,
                menuActionStyles(normalColor, selectedColor)
              ]}
              selected={preview === 'kanban'}
              disabled
            />
          </DropdownMenu>
        ) : (
          <Tabs
            value={preview}
            onChange={(_, preview) => updatePreviewer(preview)}
            aria-label={t('tasks.previewSwitcher')}
            indicatorColor={'primary'}
            centered
            sx={{ minHeight: 0 }}>
            <Tab
              label={previewProps.list.title}
              value='list'
              icon={previewProps.list.icon}
              iconPosition='start'
              sx={previewStyles}
            />
            <Tab
              label={previewProps.kanban.title}
              value='kanban'
              icon={previewProps.kanban.icon}
              iconPosition='start'
              sx={previewStyles}
              disabled
            />
          </Tabs>
        )}
      </Suspense>
    </Box>
  )
})
