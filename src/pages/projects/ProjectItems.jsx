import ProfileButton from '@components/reusable/buttons/ProfileButton'
import AddButton from '@components/ui/buttons/AddButton'
import AddMembers from '@components/ui/buttons/AddMembers'
import FilterButton from '@components/ui/buttons/FilterButton'
import PreviewSwitcher from '@components/ui/previewswitcher/PreviewSwitcher'
import List from '@mui/material/List'
import ProjectActionsMenu from '@pages/projects/components/ProjectActionsMenu'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useNavigate } from 'react-router-dom'

export default function ProjectItems() {
  const { isMobile } = useApp()
  const { id } = useProject()
  const navigate = useNavigate()

  return (
    <>
      <PreviewSwitcher />

      {!isMobile ? (
        <List
          disablePadding
          sx={{ display: 'flex', justifyContent: 'right', gap: 2 }}>
          <AddButton />
          <FilterButton />
          <AddMembers />
        </List>
      ) : (
        <>
          <ProjectActionsMenu />
          <AddButton />
          <FilterButton />
          <AddMembers />
          <ProfileButton
            open
            onlyIcon
            projectId={id}
            onClick={() => navigate('/profile')}
          />
        </>
      )}
    </>
  )
}
