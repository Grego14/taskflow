import i18n from '@/i18n'
import useApp from '@hooks/useApp'
import setPageTitle from '@utils/setPageTitle'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useParams } from 'react-router-dom'

const PATH_TITLE_MAP = {
  '/': '/',
  '/login': 'login',
  '/signup': 'signup',
  '/profile': 'profile',
  '/projects': 'projects',
  '/templates': 'templates',
  '/projects/new': 'new',
  '/projects/': 'projects'
}

const getTitleKeyFromPath = pathname =>
  PATH_TITLE_MAP[pathname] ? PATH_TITLE_MAP[pathname] : '/'

export default function RoutesHandler() {
  const location = useLocation()
  const { projectId } = useParams()
  const { t } = useTranslation('common')
  const { setLastRute, lastRute } = useApp()

  useEffect(() => {
    const titleKey = getTitleKeyFromPath(
      location.state?.lastRute || location.pathname
    )
    const isHome = titleKey === '/'
    const isNewProject = titleKey === 'new'
    const fromProject = location.state?.fromProject || projectId

    // as we can't know the projectId here we check if the getTitleKeyFromPath
    // returns home and if there's a projectId
    const isProject = !!(isHome && projectId)

    // the project itself will update the title with the project name
    // on @pages/projects/components/IsMemberLayout
    if (!fromProject) {
      setPageTitle(t(`routes.${isHome ? 'home' : titleKey}`))
      const prefix = !isHome ? '/' : ''
      setLastRute(`${prefix}${titleKey}`)
    } else {
      setLastRute(`/projects/${fromProject}`)
    }
  }, [location, t, setLastRute, projectId])

  return <Outlet />
}
