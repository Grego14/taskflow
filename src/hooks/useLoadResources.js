import { loadResources, resourceExists } from '@utils/resources.js'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function useLoadResources(resources) {
  const { i18n } = useTranslation()
  const [loading, setLoading] = useState(
    !resourceExists(i18n.language, resources)
  )

  useEffect(() => {
    const handleLanguageChange = async (lng) => {
      const resourcesAreLoaded = resourceExists(i18n.language, resources)

      if (!resourcesAreLoaded) {
        setLoading(!resourcesAreLoaded)
        await loadResources(i18n.language, resources)
      }

      setLoading(!resourceExists(i18n.language, resources))
    }

    handleLanguageChange()

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  return loading
}
