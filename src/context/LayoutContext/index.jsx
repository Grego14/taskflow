import { useState, useEffect, useMemo, useRef, useCallback } from 'preact/hooks'

import useUser from '@hooks/useUser'
import useDebounce from '@hooks/useDebounce'
import useApp from '@hooks/useApp'
import useDrawerAnimation from '@hooks/animations/useDrawerAnimation'

import LayoutContext from './context'
import { setItem } from '@utils/storage'
import { FILTERS } from '@/constants'
import { isDrawerOpen } from '@stores/ui'

export default function LayoutProvider({ children, isPreview, triggerUpsell }) {
  const { isMobile } = useApp()
  const { userLoaded, update, metadata } = useUser()
  const [filter, setFilter] = useState('default')

  const drawerOpen = isDrawerOpen.value

  const [opening, setOpening] = useState(null)
  const drawerRef = useRef(null)

  const debounceDelay = isPreview ? 0 : 1500
  const [debounceUpdater] = useDebounce(async data => {
    const { previewer, filter } = data

    const fieldsToUpdate = {}
    
    if(filter && !FILTERS.includes(filter)) return
    if(previewer && (previewer !== 'list' && previewer !== 'kanban')) return

    if (previewer) fieldsToUpdate.previewer = previewer
    if (filter) fieldsToUpdate.lastUsedFilter = filter

    if (Object.keys(fieldsToUpdate).length > 0) await update(fieldsToUpdate)
  }, debounceDelay)

  useEffect(() => {
    if (userLoaded) setFilter(metadata?.lastUsedFilter || 'default')
  }, [userLoaded, metadata?.lastUsedFilter])

  const drawerAnim = useDrawerAnimation(drawerRef, {
    onStart: () => setOpening(true),
    onComplete: () => setOpening(null)
  })

  const animateDrawer = useCallback((open, isTemporary) => {
    const newVal = typeof open === 'boolean' ? open : !drawerOpen

    // prevent transition errors as drawer sub-components depends of the
    // drawerOpen state to hide/show the text and align the icons
    if (typeof opening === 'boolean') return

    isDrawerOpen.value = newVal
    setItem('drawerOpen', newVal)

    // do not animate the exit if the drawer is temporary
    if (isTemporary && newVal === false) return

    drawerAnim(newVal)
  }, [drawerAnim, opening, drawerOpen])

  const value = useMemo(() => ({
    toggleDrawer: animateDrawer,
    filter,
    setFilter,
    updatePreviewer: previewer => debounceUpdater({ previewer, type: 'previewer' }),
    updateFilter: filter => debounceUpdater({ filter, type: 'filter' }),
    drawerRef,
    isPreview,
    triggerUpsell,
  }), [
      filter, 
      debounceUpdater, 
      isMobile, 
      isPreview
    ])

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}
