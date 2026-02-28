import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import RegisterComponent from '@components/reusable/RegisterComponent'
import AuthButtons from './AuthButtons'
import AuthInput from './AuthInput'
import PasswordInput from '@components/reusable/inputs/PasswordInput'

import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useUser from '@hooks/useUser'

import * as authService from '@services/auth'

const RULES = {
  username: {
    required: 'username.usernameRequired',
    minLength: { value: 3, message: 'username.shortUsername' }
  },
  email: {
    required: 'email.emailRequired',
    pattern: { value: /^\S+@\S+$/i, message: 'email.invalid' }
  },
  password: {
    required: 'password.passwordRequired',
    minLength: { value: 8, message: 'password.shortPassword' }
  }
}

export default function AuthForm({ isSignup = false, type }) {
  const { preferences } = useUser()
  const { t } = useTranslation(['auth', 'validations'])
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
    clearErrors,
    control,
    watch,
    reset
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      repeatedPassword: ''
    },
    mode: 'onTouched'
  })

  // reset when the type changes
  useEffect(() => {
    reset()
  }, [isSignup, reset])

  const onSubmit = async (data) => {
    setLoading(true)
    setFormError('')

    try {
      if (!isSignup) {
        const user = await authService.login(data)

        navigate(user.emailVerified ? '/home' : '/verify', { replace: true })
        return
      }

      if (data.password !== data.repeatedPassword) {
        setLoading(false)
        return setError('repeatedPassword', {
          message: t('password.passwordMismatch', {
            ns: 'validations'
          })
        })
      }

      const user = await authService.signup({ ...data, preferences })

      // after signup the user is always unverified
      navigate('/verify', { replace: true })
    } catch (err) {
      if (err.code === 'auth/email-already-in-use' && isSignup) {
        // simulate success to protect user privacy.
        navigate('/verify')
      } else {
        setFormError(t('form.submit', { ns: 'validations' }))
      }
    } finally {
      setLoading(false)
    }
  }

  const fields = useMemo(() => {
    const items = []

    if (isSignup) {
      items.push({
        name: 'username',
        component: AuthInput,
        rules: { required: t(RULES.username.required, { ns: 'validations' }) }
      })
    }

    items.push({
      name: 'email',
      component: AuthInput,
      rules: { required: t(RULES.email.required, { ns: 'validations' }) }
    })

    items.push({
      name: 'password',
      component: PasswordInput,
      label: t('inputs.labels.password', { ns: 'auth' }),
      rules: { required: t(RULES.password.required, { ns: 'validations' }) }
    })

    if (isSignup) {
      items.push({
        name: 'repeatedPassword',
        component: PasswordInput,
        label: t('inputs.labels.repeatedPassword', { ns: 'auth' }),
        rules: { required: t(RULES.password.required, { ns: 'validations' }) }
      })
    }

    return items
  }, [isSignup, t])

  return (
    <form
      className='flex flex-grow flex-column'
      onSubmit={handleSubmit(onSubmit)}
      id='authForm'>
      {formError && (
        <Typography color='error' variant='body2' mb={1.25}>
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
            key={field.name}
            control={control}
            {...field}
            handler={() => {
              setFormError('')
              if (errors[field.name]) clearErrors(field.name)
            }}
          />)
        )}
      </Box>

      <AuthButtons
        type={type}
        disabledBtn={loading || Object.keys(errors).length > 0}
      />
    </form>
  )
}
