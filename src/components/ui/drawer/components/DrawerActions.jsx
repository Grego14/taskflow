import NavAction from '@components/reusable/NavAction'

import { useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'

import { NAV_LINKS } from '@constants/navigation'

export default function DrawerActions() {
  const { t } = useTranslation('ui')
  const { projectId } = useParams()
  const { pathname } = useLocation()
  const { drawerOpen, toggleDrawer: animateDrawer, setDrawerOpen }
    = useLayout()

  const items = []
  for (const link of NAV_LINKS) {
    items.push(
      <li>
        <NavAction
          key={link.key}
          link={{ ...link, translation: t(link.translation) }}
          showText
          hideText={!drawerOpen}
          // run the drawer animation only if the user clicks and the drawer is
          // closed
          onClick={() => drawerOpen
            ? animateDrawer(false)
            : setDrawerOpen(false)}
          isActive={pathname === link.to}
          className='drawer-action'
          showTooltip
          tooltipPlacement='right'
          showBg
        />
      </li>
    )
  }

  return items
}
