import { Suspense, lazy, memo, useMemo, useEffect } from 'preact/compat'

import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'

import Box from '@mui/material/Box'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import ViewListIcon from '@mui/icons-material/ViewList'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DropdownMenu from '@components/reusable/DropdownMenu'
import Skeleton from '@mui/material/Skeleton'

const MenuAction = lazy(() => import('@components/reusable/MenuAction'))

import getMenuLabel from '@utils/getMenuLabel'
import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'

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

const PreviewSwitcherMenuSkeleton = () => {
  return (
    <Box className='flex flex-column'>
      <Skeleton height={40} width={110} variant='rounded' />
      <Skeleton height={40} width={110} variant='rounded' />
    </Box>
  )
}

export default memo(function PreviewSwitcher() {
  const { t } = useTranslation('tasks')
  const { isMobile } = useApp()
  const { preferences } = useUser()
  const preview = preferences.previewer
  const { updatePreviewer } = useLayout()

  return (
    // there's a bug that makes the DropdownMenu re-render and makes a layout
    // shift... so we add a wrapper with a default width
    <Box className='preview-switcher-wrapper' component='li'>
      {isMobile ? (
        <DropdownMenu
          icon={<VisibilityIcon fontSize='medium' />}
          label={state => getMenuLabel(state, 'buttons.previewLabel', 'ui')}
          tooltipPosition='top'
          slotProps={{ root: { className: 'project-action-btn hide-element' } }}>
          <Suspense fallback={<PreviewSwitcherMenuSkeleton />}>
            {OPTIONS.map(opt => (
              <MenuAction
                key={opt.id}
                handler={() => updatePreviewer(opt.id)}
                text={t(opt.keyTitle)}
                icon={<opt.icon />}
                className='preview-option-item'
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
          indicatorColor='primary'
          centered
          className='preview-tabs-container'>
          {OPTIONS.map(opt => (
            <Tab
              key={opt.id}
              label={t(opt.keyTitle)}
              value={opt.id}
              icon={<opt.icon />}
              className='preview-option-item hide-element'
              iconPosition='start'
              disabled={opt.disabled}
            />
          ))}
        </Tabs>
      )}
    </Box>
  )
})
