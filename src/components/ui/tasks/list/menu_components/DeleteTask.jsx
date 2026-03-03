import MenuAction from '@components/reusable/MenuAction'
import DeleteIcon from '@mui/icons-material/Delete'

import useTaskActions from '@hooks/useTaskActions'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

const getColor = (theme) => ({
  color: theme.palette.error.light,
  ...theme.applyStyles('dark', { color: theme.palette.error.dark })
})

export default function DeleteTask({ id, subtask, showMenu }) {
  const { deleteTask } = useTaskActions()
  const { t } = useTranslation('common')
  const { preferences } = useUser()

  const handleDelete = async (e) => {
    showMenu(false)
    await deleteTask({ id, subtask })
  }

  return (
    <MenuAction
      text={t('delete_x', { ns: 'common', x: t('task', { ns: 'common' }) })}
      icon={<DeleteIcon fontSize='small' sx={getColor} />}
      styles={getColor}
      handler={handleDelete}
    />
  )
}
