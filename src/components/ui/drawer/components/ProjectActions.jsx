import BarChartIcon from '@mui/icons-material/BarChart'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsIcon from '@mui/icons-material/Settings'

import List from '@mui/material/List'
import DrawerAction from './DrawerAction'

import useLayout from '@hooks/useLayout'
import useUser from '@hooks/useUser'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export default function ProjectActions({
  open,
  column = true,
  noTexts = false
}) {
  const { t } = useTranslation('ui')
  const navigate = useNavigate()
  const { projectId } = useParams()
  const location = useLocation()
  const { preferences } = useUser()
  const { setDrawerOpen } = useLayout()

  const rute = location.pathname?.split(projectId)?.[1]
  const action = rute === '' ? 'dashboard' : rute
  const iconSize = noTexts ? 'medium' : 'small'

  const rows = useMemo(
    () => [
      {
        text: t('projectActions.dashboard'),
        icon: <DashboardIcon fontSize={iconSize} />,
        // ProjectDashboard component is visible on /projects/:projectId
        to: '',
        active: action === 'dashboard'
      },
      {
        text: t('projectActions.metrics'),
        icon: <BarChartIcon fontSize={iconSize} />,
        to: '/metrics',
        active: action === '/metrics'
      },
      {
        text: t('projectActions.settings'),
        icon: <SettingsIcon fontSize={iconSize} />,
        to: '/settings',
        active: action === '/settings'
      }
    ],
    [t, action, iconSize]
  )

  return (
    <List
      className={`flex ${column ? 'flex-column flex-grow' : ''}`}
      sx={{ gap: '.5rem', p: 0 }}>
      {rows.map(row => (
        <DrawerAction
          onClick={() => {
            navigate(`/projects/${projectId}${row.to}`, {
              // the RouteHandler and the LayoutAppBar will use this state
              state: {
                fromProject: projectId,
                projectAction: row.to.replace('/', ''),
                fromAction: action
              }
            })

            setDrawerOpen(false)
          }}
          key={`projectRow-${row.text}`}
          text={row.text}
          icon={row.icon}
          disabled={row.disabled}
          active={row.active}
          open={open}
          showText={!noTexts}
        />
      ))}
    </List>
  )
}
