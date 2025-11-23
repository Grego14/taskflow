import Button from '@mui/material/Button'

import useUser from '@hooks/useUser'
import { useColorScheme } from '@mui/material/styles'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const langs = {
  en: 'English',
  es: 'Español'
}

export default function LangUpdater({
  reloadOnChange = false,
  longText = true
}) {
  const { t, i18n } = useTranslation('selectors')
  const { mode, systemMode, setMode } = useColorScheme()
  const { update, uid } = useUser()

  const lang = i18n.language

  const updateLang = useCallback(() => {
    ;(async () => {
      const newLang = lang === 'en' ? 'es' : 'en'

      i18n.changeLanguage(newLang)

      if (uid) await update(uid, { lang: newLang })

      if (reloadOnChange) window.location.reload()
    })()
  }, [update, uid, i18n, reloadOnChange, lang])

  return (
    <Button onClick={updateLang} aria-label={t('langs.menuLabel')}>
      {(longText ? langs[lang] : lang).toUpperCase()}
    </Button>
  )
}
