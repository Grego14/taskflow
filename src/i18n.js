import { loadResources } from '@utils/resources.js'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// preload the RESOURCES before calling loadResources to avoid the lexical
// declaration error
import { RESOURCES } from './constants'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      defaultNS: ['common', 'ui'],
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      },
      lowerCaseLng: true,
      supportedLngs: ['en', 'es']
    },
    async (error, t) => {
      try {
        const lang = i18n.language
        await loadResources(lang)
      } catch (error) {
        console.error('Error when loading translations resources ->', error)
      }
    }
  )

export default i18n
