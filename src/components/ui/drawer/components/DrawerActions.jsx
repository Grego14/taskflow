import NavAction from '@components/reusable/NavAction'

import { useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useLayout from '@hooks/useLayout'

import { NAV_LINKS } from '@constants/navigation'
import { isDrawerOpen } from '@stores/ui'

export default function DrawerActions() {
  const { t } = useTranslation('ui')
  const { projectId } = useParams()
  const { pathname } = useLocation()
  const { toggleDrawer: animateDrawer } = useLayout()

  const drawerOpen = isDrawerOpen.value

  const items = []
  for (const link of NAV_LINKS) {
    items.push(
      <li>
        <NavAction
          key={link.key}
          link={{ ...link, translation: t(link.translation) }}
          showText
          hideText={!drawerOpen}
          className='on--drawer'
          // run the drawer animation only if the user clicks and the drawer is
          // closed
          onClick={() => drawerOpen
            ? animateDrawer(false)
            : isDrawerOpen.value = false}
          isActive={pathname === link.to}
          tooltipPlacement='right'
          showBg
        />
      </li>
    )
  }

  return items
}
