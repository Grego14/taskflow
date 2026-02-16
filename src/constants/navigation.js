import HouseIcon from '@mui/icons-material/House'
import ArticleIcon from '@mui/icons-material/Article'
import FolderOpen from '@mui/icons-material/FolderOpen'
import NotificationsIcon from '@mui/icons-material/Notifications'

export const NAV_LINKS = [
  {
    key: 'home',
    icon: HouseIcon,
    to: '/home',
    translation: 'drawer.home'
  },
  {
    key: 'projects',
    icon: FolderOpen,
    to: '/projects',
    translation: 'projects.text'
  },
  {
    key: 'templates',
    icon: ArticleIcon,
    to: '/templates',
    translation: 'drawer.templates'
  },
  {
    id: 'notifications',
    icon: NotificationsIcon,
    to: '/notifications',
    translation: 'drawer.notifications',
    isNotifications: true
  }
]
