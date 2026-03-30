import { useState, useEffect, useMemo, useRef, useCallback } from 'preact/hooks'

import useUser from '@hooks/useUser'
import useDebounce from '@hooks/useDebounce'
import useApp from '@hooks/useApp'
import useDrawerAnimation from '@hooks/animations/useDrawerAnimation'

import LayoutContext from './context'
import { getItem, setItem } from '@utils/storage'

export default function LayoutProvider({ children, isPreview, triggerUpsell }) {
  const { isMobile } = useApp()
  const { userLoaded, update, metadata } = useUser()
  const [drawerOpen, setDrawerOpen] = useState(getItem('drawerOpen'))
  const [filter, setFilter] = useState('default')

  const [opening, setOpening] = useState(null)
  const [drawerReady, setDrawerReady] = useState(false)

  const drawerRef = useRef(null)

  const [debounceUpdater] = useDebounce(async data => {
    const { previewer, filter, type } = data
    if (type === 'filter') setFilter(filter)

    await update(
      previewer
        ? { previewer }
        : filter
          ? { lastUsedFilter: filter }
          : null
    )
  }, 1500)

  useEffect(() => {
    if (userLoaded) setFilter(metadata?.lastUsedFilter || 'default')
  }, [userLoaded, metadata?.lastUsedFilter])

  const drawerAnim = useDrawerAnimation(drawerRef, {
    onStart: () => setOpening(true),
    onComplete: () => setOpening(null),
    animate: drawerReady
  })

  useEffect(() => {
    if (drawerReady) drawerAnim(drawerOpen)
  }, [drawerReady])

  const animateDrawer = useCallback((open, isTemporary) => {
    const newVal = typeof open === 'boolean' ? open : !drawerOpen

    // prevent transition errors as drawer sub-components depends of the
    // drawerOpen state to hide/show the text and align the icons
    if (typeof opening === 'boolean') return

    setDrawerOpen(newVal)
    setItem('drawerOpen', newVal)

    // do not animate the exit if the drawer is temporary
    if (isTemporary && newVal === false) return

    drawerAnim(newVal)
  }, [drawerAnim, opening])

  const value = useMemo(() => ({
    drawerOpen,
    setDrawerOpen,
    toggleDrawer: animateDrawer,
    filter,
    setFilter,
    updatePreviewer: previewer => debounceUpdater({ previewer, type: 'previewer' }),
    updateFilter: filter => debounceUpdater({ filter, type: 'filter' }),
    drawerRef,
    isPreview,
    triggerUpsell,
    setDrawerReady
  }), [drawerOpen, filter, debounceUpdater, isMobile, animateDrawer])

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}
