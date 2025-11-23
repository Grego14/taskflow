import i18n from '@/i18n.js'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError.js'
import lazyImport from '@utils/lazyImport.js'
import validateEmail from '@utils/validateEmail.js'
import validateUsername from '@utils/validateUsername.js'

export default async function submit({ data, isSignup }) {
  const t = i18n.getFixedT(i18n.language, 'validations')

  const { username, email, password, repeatedPassword } = data

  function getValidationError(field, errorKey) {
    return t(`${field}.${errorKey}`)
  }

  const errors = {}

  // if the user is creating an account validate the username
  if (isSignup) {
    const usernameValidation = validateUsername(username)

    // get the username error
    if (usernameValidation.invalid) {
      const chars = usernameValidation.chars
        ? ` ${usernameValidation.chars}`
        : ''
      const errorMsg = getValidationError('username', usernameValidation.key)

      errors.username = `${errorMsg}${chars}`
    }
  }

  const emailValidation = validateEmail(email)

  if (emailValidation.error) {
    errors.email = getValidationError('email', emailValidation.key)
  }

  if (isSignup && password !== repeatedPassword) {
    errors.repeatedPassword = t('password.passwordMismatch')
  }

  try {
    if (Object.keys(errors).length > 0) return { errors, success: false }

    const authHandlers = await lazyImport('/src/pages/auth/authHandlers')

    const authHandler = isSignup ? authHandlers.signup : authHandlers.login
    const credentials = isSignup
      ? { username, email, password }
      : { email, password }

    const user = await authHandler(credentials)

    if (user) return { success: true, errors, user }
  } catch (err) {
    // console.error(err)
    return {
      errors,
      success: false,
      // if the fields are valid but the authHandler throws we send a submit
      // error
      error: Object.keys(errors).length > 0 ? null : 'form.submit'
    }
  }
}
