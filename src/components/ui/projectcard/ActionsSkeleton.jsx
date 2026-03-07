import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

export default function ActionsSkeleton() {
  return <Box className='flex flex-column' width='9rem' gap={1.25} py={1.25}>
    <Skeleton height={40} variant='rounded' />
    <Skeleton height={40} variant='rounded' />
  </Box>
}
