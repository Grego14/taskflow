import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

export default function RestrictedRute({ isAuthenticated, restrictedPaths }) {
  const navigate = useNavigate()
  const currentPath = useLocation().pathname

  useEffect(() => {
    if (isAuthenticated && restrictedPaths.includes(currentPath)) navigate('/')
  }, [restrictedPaths, navigate, isAuthenticated, currentPath])

  return <Outlet />
}
