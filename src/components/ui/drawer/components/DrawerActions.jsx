import { Suspense, lazy } from 'react'
import NavAction from '@components/reusable/NavAction'
const ProjectActions = lazy(() => import('./ProjectActions'))

import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { NAV_LINKS } from '@constants/navigation'

export default function DrawerActions({ open, toggleDrawer }) {
  const { t } = useTranslation('ui')
  const { projectId } = useParams()

  if (projectId) return (
    <Suspense fallback={null}>
      <ProjectActions open={open} />
    </Suspense>
  )

  const items = []
  for (const link of NAV_LINKS) {
    items.push(
      <li>
        <NavAction
          key={link.key}
          link={{ ...link, translation: t(link.translation) }}
          showText={open}
          onClick={() => toggleDrawer(false)}
        />
      </li>
    )
  }

  return items
}
