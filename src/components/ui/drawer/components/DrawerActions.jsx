import { Suspense, lazy } from 'react'

import Box from '@mui/material/Box'
const ProjectActions = lazy(() => import('./ProjectActions'))
const ArticleIcon = lazy(() => import('@mui/icons-material/Article'))
const FolderOpen = lazy(() => import('@mui/icons-material/FolderOpen'))
const HouseIcon = lazy(() => import('@mui/icons-material/House'))

import DrawerAction from './DrawerAction'
import NotificationsAction from './NotificationsAction'

import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const actions = [
  { component: DrawerAction, icon: HouseIcon, link: 'home' },
  { component: DrawerAction, icon: FolderOpen, link: 'projects', keyTranslation: 'projects.text' },
  { component: DrawerAction, icon: ArticleIcon, link: 'templates' },
  { component: NotificationsAction, link: 'notifications' },
]

export default function DrawerActions({ open, toggleDrawer }) {
  const { t } = useTranslation('ui')
  const { projectId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const rutes = location.pathname?.split('/')
  const currentAction = projectId ? null : rutes?.[rutes?.length - 1]

  const actionsHandler =
    !projectId ?
      (to) => {
        navigate(`/${to}`)
        toggleDrawer(false)
      } : null

  return (
    <Suspense fallback={null}>
      {projectId ? (
        <ProjectActions open={open} />
      ) : actions.map(action => (
        <action.component
          key={action.link}
          icon={action.icon && <action.icon fontSize='small' />}
          onClick={() => actionsHandler(action.link)}
          open={open}
          text={action.keyTranslation
            ? t(action.keyTranslation)
            : t(`drawer.${action.link}`)}
          showText
          active={currentAction === action.link}
        />
      ))}
    </Suspense>
  )
}
