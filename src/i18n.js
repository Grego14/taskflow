import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { loadResources } from '@utils/resources.js'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      defaultNS: ['common', 'ui'],
      resources: {},
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      },
      supportedLngs: ['en', 'es'],
      nonExplicitSupportedLngs: true
    },
    async (error, t) => {
      try {
        const lang = i18n.language
        await loadResources(lang) // load common translations
      } catch (error) {
        console.log('Error when loading translations resources ->', error)
      }
    }
  )

export default i18n
