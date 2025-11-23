import i18n from '@/i18n.js'
import validateUsername from '@utils/validateUsername.js'
import { updateProfile } from 'firebase/auth'

export default async function validateProfileFields(data) {
  const { username, theme, lang } = data.current
  const {
    username: initialUsername,
    theme: initialTheme,
    lang: initialLang
  } = data.initial

  const t = i18n.getFixedT(i18n.language, 'validations')

  const validThemes = ['light', 'dark']
  const validLangs = ['en', 'es']

  const langIsValid = validLangs.includes(lang)
  const themeIsValid = validThemes.includes(theme)

  // object to send will contain errors or success status for each field
  const status = {
    username: { error: false, message: '' },
    theme: { error: false, message: '' },
    lang: { error: false, message: '' }
  }

  function setError(field, message) {
    status[field].error = !!message // same as Boolean(message)
    status[field].message = message
  }

  if (username !== initialUsername) {
    const usernameValidation = validateUsername(username)

    // get the username error
    if (usernameValidation.invalid) {
      const chars = usernameValidation.chars
        ? ` ${usernameValidation.chars}`
        : ''
      const error = t(`username.${usernameValidation.key}`, {
        ns: 'validations'
      })

      status.username.error = true
      status.username.message = `${error}${chars}`
    }
  }

  if (lang !== initialLang) {
    if (!langIsValid) {
      setError('lang', t('lang.invalid', { ns: 'validations' }))
    }
  }

  if (theme !== initialTheme) {
    if (!themeIsValid) {
      setError('theme', t('theme.invalid', { ns: 'validations' }))
    }
  }

  return status
}
