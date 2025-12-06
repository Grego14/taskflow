import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import useAuth from '@hooks/useAuth'

export default function RestrictedRute({ isAuthenticated, restrictedPaths }) {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const currentPath = useLocation().pathname

  useEffect(() => {
    if (isAuthenticated && restrictedPaths.includes(currentPath))
      navigate(currentUser ? '/home' : '/')
  }, [restrictedPaths, navigate, isAuthenticated, currentPath, currentUser])

  return <Outlet />
}
