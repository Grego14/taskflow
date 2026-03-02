import Box from '@mui/material/Box'
import AddButton from '@components/ui/buttons/AddButton'
import AddMembers from '@components/ui/buttons/AddMembers'
import FilterButton from '@components/ui/buttons/FilterButton'
import ArchiveButton from '@components/ui/buttons/ArchiveButton'
import PreviewSwitcher from '@components/ui/previewswitcher/PreviewSwitcher'
import List from '@mui/material/List'
import ToggleProjectDrawer from '@components/ui/projects/ToggleProjectDrawer'

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
      <ArchiveButton />
      <AddButton />
      <FilterButton />
      <AddMembers />
    </>

  return (
    <>
      {!isMobile ? (
        <List
          disablePadding
          sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexGrow: 1 }}>
          <ToggleProjectDrawer />

          <Box className='flex flex-grow flex-center' justifyContent='end' gap={2}>
            {defaultItems}
          </Box>
        </List>
      ) : (
        <>
          <ToggleProjectDrawer />
          {defaultItems}
        </>
      )}
    </>
  )
}
