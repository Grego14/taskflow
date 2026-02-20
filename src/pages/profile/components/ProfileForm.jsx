import ProfileFields from './ProfileFields'

import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import useUser from '@hooks/useUser'
import { useColorScheme } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import lazyImport from '@utils/lazyImport'
import { auth } from '@/firebase/firebase-config'

const defaultValues = values => ({
  defaultValues: {
    username: values.username || '',
    avatar: values.avatar || '',
    theme: values.theme || '',
    lang: values.lang || ''
  }
})

export default function ProfileForm({ setSaveBtnDisabled, fields }) {
  const { preferences, profile, setUser, update, uid } = useUser()
  const { currentUser } = useAuth()
  const { appNotification } = useApp()
  const { t, i18n } = useTranslation('ui')
  const { setMode } = useColorScheme()

  const [initialValues, setInitialValues] = useState({
    theme: preferences?.theme || 'light',
    lang: preferences?.lang || i18n.language,
    username: profile?.username || currentUser?.username,
    avatar: profile?.avatar
  })

  const {
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    control,
    setValue
  } = useForm(defaultValues(initialValues))

  // if the user created his account using email and password instead of a
  // provider, photoURL will be empty and as the initialValues doesn't change when
  // the user data loads, we use this function to update the avatar
  const updateAvatar = useCallback(
    newAvatar => {
      setInitialValues(prev => ({
        ...prev,
        avatar: newAvatar
      }))

      setValue('avatar', newAvatar)
    },
    [setValue]
  )

  useEffect(() => {
    if (profile?.avatar) updateAvatar(profile.avatar)
  }, [profile?.avatar, updateAvatar])

  const onSubmit = useCallback(
    async (data, e) => {
      e.preventDefault()
      const { theme, lang, username, avatar } = data

      // load the function only when is going to be used
      const validateProfileFields = await lazyImport(
        '/src/pages/profile/validateProfileFields'
      )

      const status = await validateProfileFields({
        initial: initialValues,
        current: data
      })

      let invalidFields = false

      // show errors to the user if any
      for (const [field, state] of Object.entries(status)) {
        if (state.error) {
          invalidFields = true
          setError(field, { type: 'custom', message: state.message })
          setSaveBtnDisabled(true)
        }
      }

      // special case (avatar isn't validated like the other fields)
      if (errors.avatar) {
        invalidFields = true
      }

      if (invalidFields) return

      setUser((prev) => ({
        ...prev, preferences: {
          ...prev.preferences,
          theme,
          lang
        }
      }))

      try {
        // update user firebase document
        const docStatus = await update(data)

        if (!docStatus.error) {
          // update firebase auth user
          const { updateProfile } = await import('firebase/auth')
          const { auth } = await import('@/firebase/firebase-config')
          await updateProfile(auth.currentUser, { displayName: data.username })

          // updates the initialValue of the avatar and AvatarUploader component value
          updateAvatar(avatar)

          appNotification({ message: t('profileUpdated', { ns: 'profile' }) })
          setSaveBtnDisabled(true)
        }
      } catch (err) {
        appNotification({ message: err.message, status: 'error' })
      }
    },
    [
      appNotification,
      currentUser,
      errors?.avatar,
      i18n.changeLanguage,
      initialValues,
      setError,
      t,
      setMode,
      updateAvatar,
      setSaveBtnDisabled
    ]
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} id='profileForm'>
      <ProfileFields
        control={control}
        clearErrors={clearErrors}
        setError={setError}
        setValue={setValue}
        initialAvatar={initialValues?.avatar}
        setSaveBtnDisabled={setSaveBtnDisabled}
      />
    </form>
  )
}
