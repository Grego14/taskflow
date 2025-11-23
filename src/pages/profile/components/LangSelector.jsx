import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

const languages = {
  en: 'English',
  es: 'Español'
}

export default function LangSelector({ error, field }) {
  const { t } = useTranslation('profile')

  return (
    <FormControl>
      <InputLabel id='select-lang'>{t('labels.lang')}</InputLabel>
      <Select
        labelId='select-lang'
        value={field.value}
        label={t('labels.lang')}
        onChange={field.onChange}>
        {Object.entries(languages).map(lang => (
          <MenuItem key={lang[0]} value={lang[0]}>
            {lang[1]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
