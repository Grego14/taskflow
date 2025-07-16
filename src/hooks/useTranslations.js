import { useAppState } from '@/context/AppContext'
import translations from '@/translations.js'

export default function useTranslations() {
  const { user } = useAppState()

  return translations[user.preferences.lang]
}
