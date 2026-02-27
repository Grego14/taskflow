import i18n from '@/i18n.js'

export default function internetNotification(isOffline, sender) {
  const lang = i18n.language || 'en'

  const internetTranslations = {
    en: {
      lost: 'Internet connection has been lost',
      restored: 'Internet connection has been restored'
    },
    es: {
      lost: 'La conexión a internet se ha perdido',
      restored: 'La conexión a internet se ha restablecido'
    }
  }

  const status = isOffline ? 'error' : 'success'
  const msg = isOffline ? 'lost' : 'restored'

  sender({ message: internetTranslations[lang][msg], status })
}
