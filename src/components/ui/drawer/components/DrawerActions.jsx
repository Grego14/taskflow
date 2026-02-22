import NavAction from '@components/reusable/NavAction'

import { useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { NAV_LINKS } from '@constants/navigation'

export default function DrawerActions({ open, toggleDrawer }) {
  const { t } = useTranslation('ui')
  const { projectId } = useParams()
  const { pathname } = useLocation()

  const items = []
  for (const link of NAV_LINKS) {
    items.push(
      <li>
        <NavAction
          key={link.key}
          link={{ ...link, translation: t(link.translation) }}
          showText={open}
          onClick={() => toggleDrawer(false)}
          isActive={pathname === link.to}
          className='drawer-action'
        />
      </li>
    )
  }

  return items
}
