import { lazy, Suspense, useEffect } from 'preact/compat'

import Box from '@mui/material/Box'
import AddButton from '@components/ui/tasks/buttons/AddButton'
import AddMembers from '@components/ui/tasks/buttons/AddMembers'
import FilterButton from '@components/ui/tasks/buttons/FilterButton'
import ArchiveButton from '@components/ui/tasks/buttons/ArchiveButton'
import PreviewSwitcher from '@components/ui/previewswitcher/PreviewSwitcher'
import List from '@mui/material/List'

const ToggleProjectDrawer = lazy(() =>
  import('@components/ui/projects/ToggleProjectDrawer'))

const ThemeUpdater = lazy(() => import('@components/ui/buttons/ThemeUpdater'))
const LangUpdater = lazy(() => import('@components/ui/buttons/LangUpdater'))

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useNavigate } from 'react-router-dom'
import useLayout from '@hooks/useLayout'

// custom appbar buttons styles
import '@styles/components/ui/projects/dashboard/projectActions.css'

export default function ProjectItems({ onMount }) {
  const { isMobile } = useApp()
  const { id } = useProject()
  const navigate = useNavigate()
  const { isPreview } = useLayout()

  useEffect(() => {
    // let the ToggleProjectDrawer trigger the animation
    if (!isMobile) onMount?.()
  }, [onMount, isMobile])

  const defaultItems = (
    <>
      <PreviewSwitcher />
      {isPreview && (
        <Suspense fallback={null}>
          <div 
            className='flex flex-center project-items-preferences' 
            // align perfectly with the other list items on mobile devices
            style={{ display: isMobile ? 'contents' : 'block' }}>
            <ThemeUpdater />
            <LangUpdater longText={!isMobile} />
          </div>
        </Suspense>
      )}
      {!isMobile && <ArchiveButton />}
      <FilterButton />
      <AddMembers />
      <AddButton />
    </>
  )

  return (
    <List disablePadding className='flex flex-center project-items-list'>
      {!isMobile ? defaultItems
        : (
          <>
            <Suspense fallback={null}>
              <ToggleProjectDrawer onMount={onMount} />
            </Suspense>

            {defaultItems}
          </>
        )}
    </List>
  )
}
