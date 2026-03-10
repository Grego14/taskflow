import { useState, useEffect, useMemo, useRef, useCallback } from 'preact/hooks'

import useUser from '@hooks/useUser'
import useDebounce from '@hooks/useDebounce'
import useApp from '@hooks/useApp'
import useDrawerAnimation from '@hooks/animations/useDrawerAnimation'

import LayoutContext from './context'
import { getItem } from '@utils/storage'

export default function LayoutProvider({ children }) {
  const { isMobile } = useApp()
  const { userLoaded, update, metadata } = useUser()
  const [drawerOpen, setDrawerOpen] = useState(getItem('drawerOpen'))
  const [filter, setFilter] = useState('default')

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

  const drawerAnim = useDrawerAnimation(drawerRef)

  const animateDrawer = useCallback((open) => {
    const newVal = typeof open === 'boolean' ? open : !drawerOpen
    setDrawerOpen(newVal)
    drawerAnim(newVal)
  }, [drawerAnim])

  const value = useMemo(() => ({
    drawerOpen,
    setDrawerOpen,
    toggleDrawer: animateDrawer,
    filter,
    setFilter,
    updatePreviewer: previewer => debounceUpdater({ previewer, type: 'previewer' }),
    updateFilter: filter => debounceUpdater({ filter, type: 'filter' }),
    drawerRef
  }), [drawerOpen, filter, debounceUpdater, isMobile, animateDrawer])

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}
