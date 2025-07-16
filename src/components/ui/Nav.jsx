import ProfileIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import { Button, Box, Menu, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DropdownMenu from '@components/reusable/DropdownMenu'
import { useMemo, useState } from 'react'
import ProjectSettingsDialog from '@components/reusable/dialogs/ProjectSettingsDialog'

export default function Nav({ project }) {
  const navigate = useNavigate()
  const [projectConfigVisible, setProjectConfigVisible] = useState(false)

  function showProjectConfig() {
    setProjectConfigVisible(prev => {
      console.log('Project config visibility:', !prev)
      return !prev
    })
  }

  return (
    <nav>
      <ul>
        <li>
          <NavItem
            label='My Profile'
            icon={<ProfileIcon fontSize='large' />}
            action={() => navigate('/profile')}
          />
        </li>
        <li>
          <NavItem
            label='Project Config'
            icon={<SettingsIcon fontSize='large' />}
            action={showProjectConfig}
          />
          <ProjectSettingsDialog open={projectConfigVisible} setOpen={setProjectConfigVisible} />
        </li>
      </ul>
    </nav>
  )
}

function NavItem({ label, icon, action }) {
  return (
    <Button
      onClick={action}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '.2rem',
        maxWidth: '5rem',
        fontSize: '.65rem'
      }}>
      {icon}
      {label}
    </Button>
  )
}
