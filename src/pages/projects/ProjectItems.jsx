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

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useNavigate } from 'react-router-dom'

export default function ProjectItems({ onMount }) {
  const { isMobile } = useApp()
  const { id } = useProject()
  const navigate = useNavigate()

  const defaultItems =
    <>
      <PreviewSwitcher />
      {!isMobile && <ArchiveButton />}
      <FilterButton />
      <AddMembers />
      <AddButton />
    </>

  useEffect(() => {
    // let the ToggleProjectDrawer trigger the animation
    if (isMobile) return

    const timer = requestAnimationFrame(() => onMount?.())
    return () => cancelAnimationFrame(timer)
  }, [])

  return (
    <List
      disablePadding
      className='flex flex-center'
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1,
        flexGrow: 1
      }}>
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
