import { useState, useMemo, useCallback, useEffect } from 'preact/hooks'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import useUser from '@hooks/useUser'

import RouteContext from './context'
import { getItem, setItem } from '@utils/storage'

export default function RouteProvider() {
  const { uid } = useUser()
  const [lastRute, setLastRute] = useState(getItem('lastRute', '/'))
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleNavigation = useCallback(rute => {
    setLastRute(pathname)
    setItem('lastRute', pathname)

    navigate(rute)
  }, [navigate, pathname])

  useEffect(() => {
    const defaultRute = uid ? '/home' : '/'

    // reset the lastRute if the users moves to that rute
    // ex: the user was on the profile, gets out and moves again to the profile
    // without triggering the handleNavigation function
    if (pathname?.match(lastRute)?.[0] && lastRute !== defaultRute)
      setLastRute(defaultRute)
  }, [lastRute, pathname])

  const value = useMemo(() => (
    {
      navigateTo: handleNavigation,
      lastRute
    }),
    [lastRute, handleNavigation])

  return (
    <RouteContext.Provider value={value}>
      <Outlet />
    </RouteContext.Provider>
  )
}
