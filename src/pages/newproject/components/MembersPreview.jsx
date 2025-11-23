import ClearIcon from '@mui/icons-material/Clear'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

export default function MembersPreview({ members = [], setMembers }) {
  const handleDeletion = e => {
    const toDelete = e.currentTarget?.dataset?.email

    if (!toDelete) return

    setMembers(prev => {
      const newMembers = []

      for (const member of members) {
        if (member.email === toDelete) continue
        newMembers.push(member)
      }
    })
  }

  return (
    <Box mt={members?.length > 0 ? 2 : 0}>
      {members?.map(member =>
        member?.email && member?.username ? (
          <Box key={member.email}>
            <Chip
              label={member.username}
              onDelete={handleDeletion}
              avatar={<Avatar src={member?.avatar} />}
              deleteIcon={
                <ClearIcon fontSize='small' data-email={member.email} />
              }
            />
          </Box>
        ) : null
      )}
    </Box>
  )
}
