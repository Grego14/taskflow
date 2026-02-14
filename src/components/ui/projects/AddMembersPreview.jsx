import ClearIcon from '@mui/icons-material/Clear'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

export default function AddMembersPreview({ members = [], setMembers }) {
  const handleDeletion = e => {
    const toDelete = e.currentTarget?.dataset?.email

    if (!toDelete) return

    const newMembers = []

    for (const member of members) {
      if (member.email === toDelete) continue
      newMembers.push(member)
    }

    setMembers(newMembers)
  }

  return (
    <Box className='flex' mt={members?.length > 0 ? 2 : 0} gap={1.25}>
      {members?.map(member =>
        member?.email && member?.username ? (
          <Chip
            key={member.email}
            label={member.username}
            onDelete={handleDeletion}
            avatar={<Avatar src={member?.avatar} />}
            deleteIcon={
              <ClearIcon fontSize='small' data-email={member.email} />
            }
          />
        ) : null
      )}
    </Box>
  )
}
