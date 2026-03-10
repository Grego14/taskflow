import { lazy, Suspense } from 'preact/compat'

import Box from '@mui/material/Box'
import AddButton from '@components/ui/buttons/AddButton'
import AddMembers from '@components/ui/buttons/AddMembers'
import FilterButton from '@components/ui/buttons/FilterButton'
import ArchiveButton from '@components/ui/buttons/ArchiveButton'
import PreviewSwitcher from '@components/ui/previewswitcher/PreviewSwitcher'
import List from '@mui/material/List'

const ToggleProjectDrawer = lazy(() =>
  import('@components/ui/projects/ToggleProjectDrawer'))

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useNavigate } from 'react-router-dom'

export default function ProjectItems() {
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

  return (
    <List
      disablePadding
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1,
        flexGrow: 1
      }}>
      {!isMobile ? (
        <Box className='flex flex-grow flex-center' justifyContent='end' gap={2}>
          {defaultItems}
        </Box>
      ) : (
        <>
          <Suspense fallback={null}>
            <ToggleProjectDrawer />
          </Suspense>

          {defaultItems}
        </>
      )}
    </List>
  )
}
