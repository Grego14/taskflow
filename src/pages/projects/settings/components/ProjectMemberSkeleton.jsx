import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

export default function ProjectMemberSkeleton() {
  return (
    <Paper
      className='flex flex-center'
      sx={{ justifyContent: 'space-between', p: 2, my: 2 }}>
      <Box className='flex flex-center' gap={2}>
        <Avatar src='' />

        <Box className='flex flex-column' gap={1}>
          <Skeleton width='10rem' />
          <Skeleton width='12.5rem' />
        </Box>
      </Box>

      <Skeleton variant='circular' width='2rem' height='2rem' />
    </Paper>
  )
}
