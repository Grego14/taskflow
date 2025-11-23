import RegisterComponent from '@components/reusable/RegisterComponent'
import Box from '@mui/material/Box'
import AvatarUploader from './AvatarUploader'
import LangSelector from './LangSelector'
import ThemeSelector from './ThemeSelector'
import UsernameInput from './UsernameInput'

import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import lazyImport from '@utils/lazyImport'

export default function ProfileFields({
  control,
  clearErrors,
  setError,
  setValue,
  initialAvatar,
  setSaveBtnDisabled
}) {
  const { t } = useTranslation('validations')

  const handleAvatarChange = useCallback(
    async e => {
      const file = e.target.files[0]

      if (!file) return

      clearErrors('avatar')

      const validateAvatarFile = await lazyImport(
        '/src/pages/profile/validateAvatar'
      )
      const validation = await validateAvatarFile(file)

      if (validation?.error) {
        const message = t(`avatar.${validation.message}`, { ns: 'validations' })
        setError('avatar', { type: 'custom', message })

        // reset the value if theres an error with the user provided avatar
        setValue('avatar', initialAvatar)
      } else {
        // if the validation was successfull we should get the compressed avatar
        setValue('avatar', validation)
        setSaveBtnDisabled(false)
      }
    },
    [clearErrors, setError, initialAvatar, t, setValue, setSaveBtnDisabled]
  )

  const fields = useMemo(
    () =>
      [
        {
          name: 'avatar',
          component: <AvatarUploader />,
          props: {
            handler: handleAvatarChange
          }
        },
        {
          name: 'username',
          component: <UsernameInput />,
          rules: {
            minLength: {
              value: 3,
              message: t('username.shortUsername', { ns: 'validations' })
            },
            required: {
              value: true,
              message: t('username.usernameRequired', { ns: 'validations' })
            }
          }
        },
        { name: 'theme', component: <ThemeSelector /> },
        { name: 'lang', component: <LangSelector /> }
      ].map(field => ({
        name: field?.name,
        component: field?.component,
        handler: () => {
          clearErrors(field?.name)
          setSaveBtnDisabled(false)
        },
        ...field?.props
      })),
    [t, handleAvatarChange, clearErrors, setSaveBtnDisabled]
  )

  return (
    <Box
      className='flex flex-column flex-center'
      gap={2.5}
      width='100%'
      sx={{
        '& .MuiFormControl-root': {
          // UsernameInput, ThemeSelector and LangSelector widths
          width: 'clamp(260px, 260px + 7.5vw, 350px)'
        }
      }}>
      {fields.map(field => (
        <RegisterComponent key={field.name} {...field} control={control} />
      ))}
    </Box>
  )
}
