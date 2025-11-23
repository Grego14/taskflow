import OptionalSelector from '@components/reusable/selectors/OptionalSelector'
// components
import MenuItem from '@mui/material/MenuItem'

// hooks
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

// utils
import { priorities, priorityColors, statusesColors } from '@/constants'
import { alpha, darken, lighten } from '@mui/material/styles'
import upperCaseInitialLetter from '@utils/upperCaseInitialLetter.js'

const convertColor = (color, theme = 'light') => {
  return lighten(color, theme === 'light' ? 0 : 0.5)
}

export default function TaskPriority({ priority, updatePriority }) {
  const { t } = useTranslation(['dialogs', 'ui'])
  const { preferences } = useUser()
  const userTheme = preferences.theme
  const priorityColor = priorityColors[priority]

  const selectedFg = convertColor(priorityColor[0], userTheme)
  const selectedBg = convertColor(priorityColor[1], userTheme)

  return (
    <OptionalSelector
      defaultOption='none'
      handler={e => updatePriority(e.target.value)}
      label={upperCaseInitialLetter(priority)}
      labelId={'priority'}
      title={t('newtask.taskPriority', { ns: 'dialogs' })}
      value={priority}
      sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: selectedFg
        },
        color: selectedFg,
        borderColor: selectedBg
      }}>
      {priorities?.map(priority => {
        const [_fg, _bg] = priorityColors[priority]
        const fg = convertColor(_fg, userTheme)
        const bg = userTheme === 'light' ? _bg : darken(_bg, 0.75)

        return (
          <MenuItem
            key={priority}
            value={priority}
            sx={[
              {
                fontSize: 'var(--fs-small)',
                color: fg,
                '&.Mui-selected': {
                  backgroundColor: bg
                }
              }
            ]}>
            {upperCaseInitialLetter(
              t(`tasks.priorities.${priority}`, { ns: 'ui' })
            )}
          </MenuItem>
        )
      })}
    </OptionalSelector>
  )
}
