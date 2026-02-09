import { Suspense, lazy } from 'react'

import Box from '@mui/material/Box'
const ProjectActions = lazy(() => import('./ProjectActions'))
const DrawerAction = lazy(() => import('./DrawerAction'))
const ArticleIcon = lazy(() => import('@mui/icons-material/Article'))
const FolderOpen = lazy(() => import('@mui/icons-material/FolderOpen'))
const HouseIcon = lazy(() => import('@mui/icons-material/House'))

import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export default function DrawerActions({ open, toggleDrawer }) {
  const { t } = useTranslation('ui')
  const { projectId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const rutes = location.pathname?.split('/')
  const action = projectId ? null : rutes?.[rutes?.length - 1]

  return (
    <Suspense fallback={null}>
      {projectId ? (
        <ProjectActions open={open} />
      ) : (
        <>
          <DrawerAction
            text={t('drawer.home')}
            icon={<HouseIcon fontSize='small' />}
            open={open}
            onClick={() => {
              navigate('/home')
              toggleDrawer(false)
            }}
            active={action === 'home'}
            showText
          />

          <DrawerAction
            text={t('projects.text')}
            icon={<FolderOpen fontSize='small' />}
            open={open}
            onClick={() => {
              navigate('projects')
              toggleDrawer(false)
            }}
            active={action === 'projects'}
            showText
          />

          <DrawerAction
            text={t('drawer.templates')}
            icon={<ArticleIcon fontSize='small' />}
            open={open}
            onClick={() => {
              navigate('templates')
              toggleDrawer(false)
            }}
            active={action === 'templates'}
            showText
          />
        </>
      )}
    </Suspense>
  )
}
