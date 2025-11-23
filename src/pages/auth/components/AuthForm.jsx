import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import RegisterComponent from '@components/reusable/RegisterComponent'
import AuthButtons from './AuthButtons'
import AuthInput from './AuthInput'
import AuthPasswordInput from './AuthPasswordInput'

import useUser from '@hooks/useUser'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import i18n from '@/i18n'
import lazyImport from '@utils/lazyImport'

const getRules = () => {
  const t = i18n.getFixedT(i18n.language, 'validations')

  return {
    username: {
      required: t('username.usernameRequired'),
      minLength: { value: 3, message: t('username.shortUsername') },
      maxLength: { value: 30, message: t('username.longUsername') }
    },
    email: { required: t('email.emailRequired') },
    password: {
      required: t('password.passwordRequired'),
      minLength: {
        value: 8,
        message: t('password.shortPassword')
      }
    }
  }
}

export default function AuthForm({ isSignup = false, type }) {
  const { preferences } = useUser()
  const { t } = useTranslation('validations')
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

  const fieldsError =
    errors.username ||
    errors.email ||
    errors.password ||
    errors.repeatedPassword

  const onSubmit = useCallback(
    (data, e) => {
      ;(async () => {
        e.preventDefault()
        const { username, email, password, repeatedPassword } = data

        const submit = await lazyImport('/src/pages/auth/submit')
        // if the submit was sucessfull the authState object should return the user
        // so if the user was creating an account then the user doc inside firebase
        // will be created
        const authState = await submit({ data, isSignup })

        // form error
        if (authState.error) {
          setFormError(t(authState.error, { ns: 'validations' }))
          return setDisableSubmitBtn(true)
        }

        // fields error
        if (Object.keys(authState.errors).length > 0) {
          for (const [key, error] of Object.entries(authState.errors)) {
            setError(key, { message: error, type: 'custom' })
          }

          return setDisableSubmitBtn(true)
        }

        if (isSignup) {
          const createUserDoc = await lazyImport('/src/services/createUserDoc')
          const { locale, ...otherPrefs } = preferences

          // Create the user document and make a project template
          const user = await createUserDoc(authState.user, otherPrefs)

          const sendWelcomeNotification = await lazyImport(
            '/src/services/notifications/sendWelcomeNotification'
          )
          await sendWelcomeNotification(authState.user.uid)
        }
      })()
    },
    [isSignup, preferences, t, setError]
  )

  const fields = useMemo(() => {
    const getFieldProps = (field, props) => ({
      name: field,
      handler: e => {
        setFormError('')
        clearErrors(field)
        setDisableSubmitBtn(false)
      },
      ...props
    })

    const rules = getRules()

    const passwordFieldProps = {
      type: 'password',
      rules: rules.password,
      autoComplete: isSignup ? 'new-password' : 'current-password'
    }

    return [
      isSignup
        ? getFieldProps('username', {
            rules: rules.username,
            autoComplete: 'username'
          })
        : null,
      getFieldProps('email', {
        type: 'email',
        rules: rules.email,
        autoComplete: 'email'
      }),
      getFieldProps('password', passwordFieldProps),
      isSignup ? getFieldProps('repeatedPassword', passwordFieldProps) : null
    ].filter(Boolean)
  }, [isSignup, clearErrors])

  return (
    <form
      className='flex flex-grow flex-column'
      onSubmit={handleSubmit(onSubmit)}
      id='authForm'>
      {formError && (
        <Typography
          aria-live='assertive'
          role='alert'
          color='error'
          variant='body2'
          mb={1.25}>
          {formError}
        </Typography>
      )}

      <Box
        className='flex flex-column flex-center flex-grow'
        gap={2}
        minWidth='18rem'
        maxWidth='25rem'>
        {fields.map(field => (
          <RegisterComponent
            control={control}
            {...field}
            key={field.name}
            component={
              field.type !== 'password' ? <AuthInput /> : <AuthPasswordInput />
            }
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
