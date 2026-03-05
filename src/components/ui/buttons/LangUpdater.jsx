import Button from '@mui/material/Button'

import useUser from '@hooks/useUser'
import { useColorScheme } from '@mui/material/styles'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const langs = {
  en: 'English',
  es: 'Español'
}

export default function LangUpdater({ longText = true }) {
  const { t, i18n } = useTranslation('ui')
  const { mode, systemMode, setMode } = useColorScheme()
  const { update, uid, preferences, setUser } = useUser()

  const lang = i18n.language

  const updateLang = useCallback(() => {
    const newLang = lang === 'en' ? 'es' : 'en'
    i18n.changeLanguage(newLang)

      ; (async () => {
        setUser(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            lang: newLang
          }
        }))

        if (uid) await update(uid, { lang: newLang })

      })()
  }, [update, uid, i18n, lang])

  return (
    <Button
      onClick={updateLang}
      aria-label={t('selectors.langs.update_lang', { lang: langs[lang] })}
      color='inherit'>
      {(longText ? langs[lang] : lang).toUpperCase()}
    </Button>
  )
}
