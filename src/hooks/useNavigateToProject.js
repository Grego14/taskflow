import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useNavigateToProject() {
  const navigate = useNavigate()

  const navigateFunc = useCallback(
    (id, owner) => {
      navigate(`/projects/${id}`, {
        state: {
          o: owner
        }
      })
    },
    [navigate]
  )

  return navigateFunc
}
