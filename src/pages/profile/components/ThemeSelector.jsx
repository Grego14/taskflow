import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

const themes = ['dark', 'light']

export default function ThemeSelector(props) {
  const { t } = useTranslation(['profile', 'ui'])

  return (
    <FormControl>
      <InputLabel id='select-theme'>
        {t('labels.theme', { ns: 'profile' })}
      </InputLabel>
      <Select
        labelId='select-theme'
        label={t('labels.theme', { ns: 'profile' })}
        {...props}>
        {themes.map(theme => (
          <MenuItem key={theme} value={theme}>
            {upperCaseInitialLetter(
              t(`selectors.themes.${theme}`, { ns: 'ui' })
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
