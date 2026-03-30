import { useCallback } from 'react'
import useRoute from './useRoute'

export default function useNavigateToProject() {
  const { navigateTo } = useRoute()

  const navigateFunc = useCallback(
    (id, owner) =>
      navigateTo(`/projects/${owner}/${id}`),
    [navigateTo]
  )

  return navigateFunc
}
