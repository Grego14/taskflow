import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import useAuth from '@hooks/useAuth'

export default function RestrictedRute({ isAuthenticated, restrictedPaths }) {
  const { currentUser, initAuth, initialized } = useAuth()
  const navigate = useNavigate()
  const currentPath = useLocation().pathname

  useEffect(() => {
    initAuth()
  }, [])

  useEffect(() => {
    if (!initialized) return

    if (isAuthenticated && restrictedPaths.includes(currentPath))
      navigate(currentUser ? '/home' : '/')
  }, [restrictedPaths, navigate, isAuthenticated, currentPath, currentUser, initialized])

  return <Outlet />
}
