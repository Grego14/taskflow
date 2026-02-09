import MenuAction from '@components/reusable/MenuAction'
import useUser from '@hooks/useUser'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { Suspense, lazy, useState } from 'react'
import { useTranslation } from 'react-i18next'

const AssignMembersDialog = lazy(
  () => import('@components/reusable/dialogs/assignMembers/AssignMembersDialog')
)

export default function AssignMembers(props) {
  const { showMenu, ...other } = props
  const { t } = useTranslation('ui')
  const { preferences } = useUser()
  const theme = useTheme()
  const color = theme.palette.info[preferences.theme]
  const [open, setOpen] = useState(false)

  return (
    <>
      <MenuAction
        text={t('tasks.actions.assignMembers')}
        icon={<PersonAddIcon fontSize='small' sx={{ color }} />}
        styles={{ color }}
        handler={() => setOpen(true)}
      />

      {open && (
        <Suspense fallback={null}>
          <AssignMembersDialog
            open={open}
            closeMenus={() => {
              setOpen(false)

              // hides the contextMenu or the 3 dots menu of the task
              showMenu(false)
            }}
            {...other}
          />
        </Suspense>
      )}
    </>
  )
}
