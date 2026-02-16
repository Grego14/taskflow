import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import RegisterComponent from '@components/reusable/RegisterComponent'
import AuthButtons from './AuthButtons'
import AuthInput from './AuthInput'
import PasswordInput from '@components/reusable/inputs/PasswordInput'

import useUser from '@hooks/useUser'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import lazyImport from '@utils/lazyImport'

const RULES_CONFIG = {
  username: {
    required: { value: true, message: 'username.usernameRequired' },
    minLength: { value: 3, message: 'username.shortUsername' },
    maxLength: { value: 30, message: 'username.too-big' }
  },
  email: {
    required: { value: true, message: 'email.emailRequired' }
  },
  password: {
    required: { value: true, message: 'password.passwordRequired' },
    minLength: { value: 8, message: 'password.shortPassword' }
  }
}

const getTranslatedRules = (name, t) => {
  const rule = RULES_CONFIG[name]
  if (!rule) return null

  const translated = {}
  for (const key of Object.keys(rule)) {
    const val = rule[key]
    translated[key] =
      { ...val, message: t(val.message, { ns: 'validations' }) }
  }
  return translated
}

export default function AuthForm({ isSignup = false, type }) {
  const { preferences } = useUser()
  const { t } = useTranslation(['auth', 'validations'])
  const [formError, setFormError] = useState('')
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false)

  const {
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    control
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      repeatedPassword: ''
    }
  })

  const fieldsError = Object.keys(errors).length > 0

  const onSubmit = useCallback(
    async (data, e) => {
      e.preventDefault()
      const submit = await lazyImport('/src/pages/auth/submit')
      const authState = await submit({ data, isSignup })

      // form error
      if (authState.error) {
        setFormError(t(authState.error))
        return setDisableSubmitBtn(true)
      }

      // fields errors
      if (Object.keys(authState.errors).length > 0) {
        for (const [key, error] of Object.entries(authState.errors)) {
          setError(key, { message: error, type: 'custom' })
        }
        return setDisableSubmitBtn(true)
      }

      if (isSignup) {
        const createUserDoc = await lazyImport('/src/services/createUserDoc')
        const { locale, ...otherPrefs } = preferences
        await createUserDoc(authState.user, otherPrefs)

        const sendWelcomeNotification = await lazyImport(
          '/src/services/notifications/sendWelcomeNotification'
        )
        await sendWelcomeNotification(authState.user.uid)
      }
    },
    [isSignup, preferences, t, setError]
  )

  const fields = useMemo(() => {
    const createField = (name, component, extraProps = {}) => {
      const isPassword = name === 'repeatedPassword' || name === 'password'

      return {
        name,
        component,
        rules: getTranslatedRules(name === 'repeatedPassword' ? 'password' : name, t),
        handler: () => {
          setFormError('')

          if (!errors[name]) clearErrors(name)

          setDisableSubmitBtn(false)
        },
        ...extraProps,
        ...(isPassword && {
          placeholder: t('inputs.placeholders.password', { ns: 'auth' }),
          label: t(`inputs.labels.${name}`, { ns: 'auth' })
        })
      }
    }

    const passwordProps = {
      type: 'password',
      autoComplete: isSignup ? 'new-password' : 'current-password',
    }

    const items = []

    if (isSignup) {
      items.push(createField('username', AuthInput, { autoComplete: 'username' }))
    }

    items.push(createField('email', AuthInput, { type: 'email', autoComplete: 'email' }))
    items.push(createField('password', PasswordInput, passwordProps))

    if (isSignup) {
      items.push(createField('repeatedPassword', PasswordInput, passwordProps))
    }

    return items
  }, [isSignup, clearErrors, t, errors])

  return (
    <form
      className='flex flex-grow flex-column'
      onSubmit={handleSubmit(onSubmit)}
      id='authForm'
    >
      {formError && (
        <Typography
          aria-live='assertive'
          role='alert'
          color='error'
          variant='body2'
          mb={1.25}
        >
          {formError}
        </Typography>
      )}

      <Box
        className='flex flex-column flex-center flex-grow'
        gap={2}
        minWidth='18rem'
        maxWidth='25rem'
      >
        {fields.map(field => (
          <RegisterComponent
            key={field.name}
            control={control}
            {...field}
          />
        ))}
      </Box>

      <AuthButtons
        type={type}
        disabledBtn={!!(disableSubmitBtn || fieldsError)}
      />
    </form>
  )
}
