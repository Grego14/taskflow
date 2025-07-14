import { useUser } from '@/App.jsx'
import translations from '@/translations.js'

export default function useTranslations() {
  const { user } = useUser()

  return translations[user.preferences.lang]
}
