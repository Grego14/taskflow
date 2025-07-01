import { useUser } from '@/App.jsx'
import translations from '@/translations.js'

export default function useTranslations() {
  const { lang } = useUser()

  return translations[lang]
}
