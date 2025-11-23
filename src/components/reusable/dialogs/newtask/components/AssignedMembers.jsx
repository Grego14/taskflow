import useApp from '@hooks/useApp'
import RemoveIcon from '@mui/icons-material/Clear'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

const getMemberInfoById = (members, memberId) =>
  members?.find(member => member.id === memberId)

export default function AssignedMembers({
  actualMembers = [],
  projectMembers = [],
  removeMember
}) {
  const { isMobile } = useApp()
  const { t } = useTranslation('dialogs')

  return (
    <Box
      display='flex'
      gap={1}
      justifyContent={isMobile ? 'start' : 'space-between'}
      alignItems={isMobile ? 'start' : 'center'}
      sx={{ flexWrap: 'wrap' }}>
      {actualMembers?.length ? (
        actualMembers.map(member => {
          const memberInfo = getMemberInfoById(projectMembers, member)
          const username = memberInfo?.username

          return (
            <Button
              variant='outlined'
              className='assigned__member flex'
              endIcon={<RemoveIcon fontSize='small' color='action' />}
              key={`avatar-button__${member}`}
              onClick={removeMember}
              id={`task-member__${member}`}
              aria-label={`Remove member ${username} from the task`}>
              <Avatar
                alt={username}
                src={memberInfo?.avatar}
                key={`avatar-${member}`}
                sx={{ width: '1.2rem', height: '1.2rem' }}
              />
              <Typography
                variant='caption'
                sx={[
                  { fontWeight: 'bold' },
                  theme => ({
                    color: theme.palette.common.black,
                    ...theme.applyStyles('dark', {
                      color: theme.palette.common.white
                    })
                  })
                ]}>
                {username}
              </Typography>
            </Button>
          )
        })
      ) : (
        <Typography variant='body2' color='textSecondary'>
          {t('newtask.noMembers')}
        </Typography>
      )}
    </Box>
  )
}
