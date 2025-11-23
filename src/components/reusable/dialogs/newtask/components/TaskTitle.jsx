import useDebounce from '@hooks/useDebounce'
import useUser from '@hooks/useUser'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function TaskTitle({ updateTitle, updateError, error = false }) {
  const { t } = useTranslation('dialogs')
  const theme = useTheme()
  const [localTitle, setLocalTitle] = useState('')
  const { preferences } = useUser()

  const errorColor = theme.palette.error[preferences.theme]

  // avoid doing too much renders on the NewTaskDialog by only updating the
  // dialog title when the user stops typing
  const [debounceTitle] = useDebounce(value => {
    updateTitle(value)
  }, 300)

  const handleChange = useCallback(
    e => {
      const value = e.target.value

      setLocalTitle(value)
      debounceTitle(value)
      updateError('')
    },
    [updateError, debounceTitle]
  )

  return (
    <div className='task-title flex'>
      <TextField
        id='task-title'
        defaultValue={localTitle}
        size='small'
        aria-label='hola'
        hiddenLabel
        placeholder={t('newtask.taskTitlePlaceholder')}
        onChange={handleChange}
        aria-errormessage='task-title-error'
        aria-invalid={!!error}
        error={!!error}
        fullWidth
      />

      {error && (
        <Typography
          sx={{ color: errorColor, mt: 1 }}
          id='task-title-error'
          variant='body2'>
          {error}
        </Typography>
      )}
    </div>
  )
}
