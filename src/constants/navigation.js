import HouseIcon from '@mui/icons-material/House'
import ArticleIcon from '@mui/icons-material/Article'
import FolderOpen from '@mui/icons-material/FolderOpen'
import NotificationsIcon from '@mui/icons-material/Notifications'

import BarChartIcon from '@mui/icons-material/BarChart'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsIcon from '@mui/icons-material/Settings'

export const NAV_LINKS = [
  { key: 'home', icon: HouseIcon, to: '/home', translation: 'drawer.home' },
  { key: 'projects', icon: FolderOpen, to: '/projects', translation: 'projects.text' },
  { key: 'templates', icon: ArticleIcon, to: '/templates', translation: 'drawer.templates' },
  {
    id: 'notifications', icon: NotificationsIcon, to: '/notifications',
    translation: 'drawer.notifications', isNotifications: true
  }
]

export const RAW_PROJECT_LINKS = [
  { key: 'dashboard', translation: 'projectActions.dashboard', icon: DashboardIcon, to: '' },
  { key: 'metrics', translation: 'projectActions.metrics', icon: BarChartIcon, to: 'metrics' },
  { key: 'settings', translation: 'projectActions.settings', icon: SettingsIcon, to: 'settings' }
]

export const getProjectNavigation = (owner, id) => {
  const base = `/projects/${owner}/${id}`
  const links = []

  for (const link of RAW_PROJECT_LINKS) {
    const href = link.to === '' ? `${base}/` : `${base}/${link.to}`
    links.push({ ...link, href })
  }

  return links
}
