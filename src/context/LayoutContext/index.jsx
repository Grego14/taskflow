import { useState, useEffect, useMemo } from 'react'
import { getItem } from '@utils/storage'
import useUser from '@hooks/useUser'
import useDebounce from '@hooks/useDebounce'
import LayoutContext from './context'

export default function LayoutProvider({ children }) {
  const { userLoaded, update, metadata } = useUser()
  const [drawerOpen, setDrawerOpen] = useState(getItem('drawerOpen'))
  const [filter, setFilter] = useState('default')

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

  const value = useMemo(() => ({
    drawerOpen,
    setDrawerOpen,
    filter,
    setFilter,
    updatePreviewer: previewer => debounceUpdater({ previewer, type: 'previewer' }),
    updateFilter: filter => debounceUpdater({ filter, type: 'filter' })
  }), [drawerOpen, filter, debounceUpdater])

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}
