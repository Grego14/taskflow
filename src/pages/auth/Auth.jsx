import { useAppState } from '@/context/AppContext'
import IconButton from '@components/reusable/buttons/IconButton'
import useTranslations from '@hooks/useTranslations'
import GithubIcon from '@mui/icons-material/GitHub'
import GoogleIcon from '@mui/icons-material/Google'
import Button from '@mui/material/Button'
import createUserDoc from '@utils/createUserDoc'
import { getDoc } from 'firebase/firestore'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { authHandlers } from './authHandlers.js'

// TODO - Split all this code to differents files. And refactorize

export default function Auth({ type = 'login' }) {
  const { user, updateActualProject } = useAppState()
  const navigate = useNavigate()
  const t = useTranslations()
  const typeTranslations = t.auth[type]
  const errorsTranslations = t.auth.errors

  const [isSignup, setIsSignup] = useState(type === 'signup')
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm()

  // navigate to login/signup rute and update the isSignup
  function navigateToRute(rute) {
    navigate(rute)
    setIsSignup(rute === '/signup')
  }

  function clearFormAndInputError(input) {
    setFormError('')
    clearErrors(input)
  }

  const onSubmit = handleSubmit(async data => {
    const { username, email, password } = data
    let usernameError = ''

    if (isSignup) {
      const usernameRegex = /^[\p{L}\s\.'0-9-]+$/iu
      const usernameInvalidCharsRegex =
        /[<>\*\(\)\[\]\{\};:,\?_\+\\=¿¡!@#$%&\|~`"^]/g

      const error = (() => {
        if (usernameInvalidCharsRegex.test(username)) {
          const chars = username.match(usernameInvalidCharsRegex)

          // show the invalid characters inside the message
          return `${errorsTranslations.usernameInvalidChars} ${Array.from(new Set(chars)).join(', ')}`
        }

        // verify if the username starts or ends with . or -
        if (/^[.-]|[.-]$/.test(username))
          return errorsTranslations.usernameStartsOrEnds

        // verify if the username has multiple . or -
        if (/[.-]{2,}/.test(username))
          return errorsTranslations.usernameMultipleChars

        if (!usernameRegex.test(username))
          return errorsTranslations.invalidUsername

        return ''
      })()

      if (error) setError('username', { message: error })
      usernameError = error
    }

    function validateEmail() {
      // splittedEmail[0] = email username
      // splittedEmail[1] = email domain
      // splittedEmail[2] = email TLD
      const splittedEmail = email.split(/[@.]/)
      const atSigns = Array.from(email.matchAll(/@/g))

      const error = (() => {
        // verify username is at least 6 chars
        if (splittedEmail[0].length < 6) return errorsTranslations.shortEmail

        if (!atSigns.length || splittedEmail.length < 3)
          return errorsTranslations.emailStructure

        if (atSigns.length > 1) return errorsTranslations.atSigns

        if (splittedEmail[2].length < 2) return errorsTranslations.shortTLD

        return ''
      })()

      if (error) setError('email', { message: error })
      return error
    }

    function validatePassword() {
      const error = (() => {
        if (!password) return errorsTranslations.emptyPassword

        if (password.length < 8) return errorsTranslations.shortPassword

        return ''
      })()

      if (error) setError('password', { message: error })
      return error
    }

    const emailError = validatePassword()
    const passwordError = validatePassword()

    if (emailError || passwordError || (isSignup && usernameError)) return

    const authHandler = isSignup ? authHandlers.signup : authHandlers.login
    const credentials = isSignup
      ? { username, email, password }
      : { email, password }

    authHandler(credentials)
      .then(async userData => {
        if (!isSignup || !userData) return

        // Create the user profile and make a project template
        const projectTemplateId = await createUserDoc(userData, {
          ...user.preferences
        })

        updateActualProject(projectTemplateId)
      })
      .catch(err => {
        console.log(err)
        setFormError(err.message)
      })
  })

  const usernameInputProps = {
    type: 'text',
    placeholder: 'Username',
    name: 'username',
    register,
    registerProps: {
      required: errorsTranslations.emptyUsername,
      minLength: {
        value: 3,
        message: errorsTranslations.shortUsername
      },
      maxLength: {
        value: 30,
        message: errorsTranslations.longUsername
      },
      onChange: () => clearFormAndInputError('username')
    },
    isInvalid: Boolean(errors.username),
    describedById: 'username-help username-error'
  }

  const emailInputProps = {
    type: 'email',
    placeholder: 'Email',
    name: 'email',
    register,
    registerProps: {
      required: errorsTranslations.emptyEmail,
      onChange: () => clearFormAndInputError('email')
    },
    isInvalid: Boolean(errors.email),
    describedById: 'email-help email-error'
  }

  const passwordInputProps = {
    type: 'password',
    placeholder: 'Password',
    name: 'password',
    register,
    registerProps: {
      required: errorsTranslations.emptyPassword,
      minLength: {
        value: 8,
        message: errorsTranslations.shortPassword
      },
      onChange: () => clearFormAndInputError('password')
    },
    isInvalid: Boolean(errors.password),
    describedById: 'password-help password-error'
  }

  return (
    <div className='auth'>
      <form className='auth' noValidate onSubmit={onSubmit}>
        <h2 className='auth__title-first'>{typeTranslations.title?.[0]}</h2>
        <h2 className='auth__title-last'>{typeTranslations.title?.[1]}</h2>

        <h3 className='auth__text'>
          {Array.isArray(typeTranslations.text) ? (
            <>
              {typeTranslations.text[0]}{' '}
              <span className='auth__text__special'>
                {typeTranslations.text[1]}
              </span>
            </>
          ) : (
            typeTranslations.text
          )}
        </h3>

        <div className='auth__fields'>
          {isSignup && (
            <div className='auth__field__group' aria-live='polite'>
              <AuthInput {...usernameInputProps} />
              {errors.username && (
                <span className='auth__error' id='username-error' role='alert'>
                  {errors.username.message}
                </span>
              )}
            </div>
          )}

          <div className='auth__field__group' aria-live='polite'>
            <AuthInput {...emailInputProps} />
            {errors.email && (
              <span className='auth__error' id='email-error' role='alert'>
                {errors.email.message}
              </span>
            )}
          </div>

          <div className='auth__field__group' aria-live='polite'>
            <AuthInput {...passwordInputProps} />
            {errors.password && (
              <span className='auth__error' id='password-error' role='alert'>
                {errors.password.message}
              </span>
            )}
          </div>

          {formError && (
            <span className='auth__error' aria-live='assertive' role='alert'>
              {formError}
            </span>
          )}

          {!isSignup && (
            <div className='auth__fields__actions'>
              <div className='auth__field__group'>
                <input type='checkbox' defaultChecked name='remember-me' />
                <label htmlFor='remember-me'>{t.auth.login.remember}</label>
              </div>

              <Link to='/recover-password'>{t.auth.login.recoverPassword}</Link>
            </div>
          )}
        </div>

        <div className='auth__buttons'>
          <Button
            type='submit'
            disabled={Boolean(
              errors.email || errors.username || errors.password
            )}>
            {typeTranslations.authButton}
          </Button>

          <div>{t.auth.or}</div>

          <div className='auth__buttons__providers'>
            <IconButton icon={<GithubIcon />} text={t.auth.githubButton} />
            <IconButton icon={<GoogleIcon />} text={t.auth.googleButton} />
          </div>
        </div>

        <div className='auth__account-text'>
          {typeTranslations.accountText}
          {isSignup ? (
            <Button onClick={() => navigateToRute('/login')}>
              {t.common.login}
            </Button>
          ) : (
            <Button onClick={() => navigateToRute('/signup')}>
              {t.common.signup}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

function AuthInput(props) {
  const {
    type,
    placeholder,
    register,
    name,
    registerProps,
    isInvalid,
    describedById
  } = props

  return (
    <input
      type={type}
      placeholder={placeholder}
      {...register(name, registerProps)}
      aria-invalid={isInvalid ? 'true' : 'false'}
      aria-describedby={describedById}
    />
  )
}
