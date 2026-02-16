import RegisterComponent from '@components/reusable/RegisterComponent'
import Box from '@mui/material/Box'
import AvatarUploader from './AvatarUploader'
import LangSelector from './LangSelector'
import ThemeSelector from './ThemeSelector'
import UsernameInput from './UsernameInput'

import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import lazyImport from '@utils/lazyImport'

const FIELDS_CONFIG = [
  { name: 'avatar', component: AvatarUploader },
  {
    name: 'username',
    component: UsernameInput,
    rules: {
      minLength: { value: 3, message: 'username.shortUsername' },
      required: { value: true, message: 'username.usernameRequired' }
    }
  },
  { name: 'theme', component: ThemeSelector },
  { name: 'lang', component: LangSelector }
]

const getTranslatedRules = (rules, t) => {
  if (!rules) return null

  const translatedRules = {}
  for (const key of Object.keys(rules)) {
    translatedRules[key] = { ...rules[key], message: t(rules[key].message) }
  }
  return translatedRules
}

export default function ProfileFields({
  control,
  clearErrors,
  setError,
  setValue,
  initialAvatar,
  setSaveBtnDisabled
}) {
  const { t } = useTranslation('validations')

  const handleAvatarChange = async e => {
    const file = e.target.files[0]

    if (!file) return

    clearErrors('avatar')

    const validateAvatarFile = await lazyImport('/src/pages/profile/validateAvatar')
    const validation = await validateAvatarFile(file)

    if (validation?.error) {
      const message = t(`avatar.${validation.message}`)
      setError('avatar', { type: 'custom', message })

      // reset the value if theres an error with the user provided avatar
      setValue('avatar', initialAvatar)
    } else {
      // if the validation was successfull we should get the compressed avatar
      setValue('avatar', validation)
      setSaveBtnDisabled(false)
    }
  }

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
      {FIELDS_CONFIG.map(field => {
        const isAvatar = field.name === 'avatar'
        const defaultProps = { key: field.name, control, ...field }

        console.log(getTranslatedRules(field.rules, t))

        return (
          <RegisterComponent
            {...defaultProps}
            rules={getTranslatedRules(field.rules, t)}
            handler={isAvatar
              ? handleAvatarChange
              : () => {
                clearErrors(field.name)
                setSaveBtnDisabled(false)
              }}
          />
        )
      })}
    </Box>
  )
}
