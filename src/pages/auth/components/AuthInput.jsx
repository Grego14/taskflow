import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'

export default function AuthInput(props) {
  const { inputRef, onChange, value, name, ...other } = props
  const { t } = useTranslation('auth')

  return (
    <TextField
      {...other}
      id={`${name}-label`}
      fullWidth
      name={name}
      value={value ?? ''}
      label={t(`inputs.labels.${name}`, { ns: 'auth' })}
      placeholder={t(`inputs.placeholders.${name}`, { ns: 'auth' })}
      onChange={onChange}
      inputRef={inputRef}
    />
  )
}
