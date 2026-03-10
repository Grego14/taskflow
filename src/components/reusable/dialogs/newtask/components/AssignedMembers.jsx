import RemoveIcon from '@mui/icons-material/Clear'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { useTranslation } from 'react-i18next'
import useProject from '@hooks/useProject'
import { useGSAP } from '@gsap/react'
import { useRef } from 'preact/hooks'

import gsap from 'gsap'

const getMemberInfoById = (members, memberId) =>
  members?.find(member => member.id === memberId)

const AssignedMember = ({ id, removeMember }) => {
  const { t } = useTranslation('tasks')
  const { projectMembers } = useProject()
  const memberInfo = getMemberInfoById(projectMembers, id)
  const memberRef = useRef(null)

  const { contextSafe } = useGSAP({ scope: memberRef })

  useGSAP(() => {
    gsap.from(memberRef.current, {
      autoAlpha: 0,
      y: 25,
      x: -25,
      ease: 'back.out(1.5)'
    })
  }, { scope: memberRef })

  const handleDeletion = (id) => {
    gsap.to(memberRef.current, {
      autoAlpha: 0,
      y: 25,
      x: -25,
      ease: 'back.out(2)',
      onComplete: () => removeMember(id)
    })
  }

  if (!memberInfo) return

  const { username, email, avatar } = memberInfo

  return (
    <Button
      sx={{
        perspective: '1000px',
        transformOrigin: '0 50% -50',
        gap: '.5rem',
        pl: '.5rem'
      }}
      ref={memberRef}
      key={`avatar-button__${id}`}
      variant='outlined'
      className='flex'
      endIcon={
        <Box
          className='flex flex-center'
          sx={theme => ({
            p: 0.5,
            transition: 'background-color 0.3s ease-in-out',
            borderRadius: 50,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            }
          })}>
          <RemoveIcon fontSize='small' color='action' />
        </Box>}
      onClick={() => handleDeletion(id)}
      aria-label={t('tasks:buttons.removeMember_member', {
        member: username
      })}>
      <Avatar
        alt={username}
        src={avatar}
        sx={{ width: '2rem', height: '2rem' }}
        aria-hidden='true'>
        {username?.[0]}
      </Avatar>
      <Box className='flex flex-column' alignItems='start'>
        <Typography
          variant='subtitle2'
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
        <Typography variant='caption'>
          {email}
        </Typography>
      </Box>
    </Button>
  )
}

export default function AssignedMembers({ actualMembers = [], removeMember }) {
  const { t } = useTranslation('dialogs')

  if (actualMembers.length < 1) return (
    <Typography variant='body2' color='textSecondary'>
      {t('newtask.noMembers')}
    </Typography>
  )

  return (
    <Box
      className='flex flex-wrap'
      gap='.75rem'
      justifyContent={{ xs: 'start', tablet: 'space-between' }}
      alignItems={{ xs: 'start', tablet: 'center' }}
      sx={{ maxWidth: 'max-content' }}>
      {actualMembers.map(member =>
        (<AssignedMember id={member} removeMember={removeMember} />)
      )}
    </Box>
  )
}
