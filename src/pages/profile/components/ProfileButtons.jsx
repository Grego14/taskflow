import LogoutButton from '@components/reusable/buttons/LogoutButton'
import Box from '@mui/material/Box'
import DeleteAccountButton from './buttons/DeleteAccountButton'
import SaveProfileButton from './buttons/SaveProfileButton'

export default function ProfileButtons({ saveBtnDisabled }) {
  return (
    <Box className='flex flex-column flex-center' gap={4}>
      <SaveProfileButton disabled={saveBtnDisabled} />
      <LogoutButton />
      <DeleteAccountButton />
    </Box>
  )
}
