import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'

import useProject from '@hooks/useProject'

export default function ProjectMembersAvatars({ size }) {
  const { projectMembers } = useProject()

  return (
    Array.isArray(projectMembers) && (
      <AvatarGroup
        spacing='small'
        sx={{
          flexDirection: 'row',
          ml: 2,
          my: 1,
          '& .MuiAvatar-root:last-child': {
            ml: -2
          }
        }}>
        {projectMembers.map(member => (
          <Avatar
            key={member.id}
            src={member.avatar}
            sx={{
              ...(size ? { width: size, height: size } : {})
            }}
          />
        ))}
      </AvatarGroup>
    )
  )
}
