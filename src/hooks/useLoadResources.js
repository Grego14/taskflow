import { loadResources, resourceExists } from '@utils/resources.js'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function useLoadResources(resources) {
  const { i18n } = useTranslation()
  const [loading, setLoading] = useState(
    !resourceExists(i18n.language, resources)
  )

  useEffect(() => {
    ;(async () => {
      const resourcesAreLoaded = resourceExists(i18n.language, resources)

      if (!resourcesAreLoaded) {
        await loadResources(i18n.language, resources)
      }

      setLoading(!resourceExists(i18n.language, resources))
    })()
  }, [i18n.language, resources])

  return loading
}
