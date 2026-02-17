import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useNavigateToProject() {
  const navigate = useNavigate()

  const navigateFunc = useCallback(
    (id, owner) =>
      navigate(`/projects/${owner}/${id}`),
    [navigate]
  )

  return navigateFunc
}
