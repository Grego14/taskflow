import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

export default function TaskActionsSkeleton() {
  return <Box className='flex flex-column' width='10rem' gap={0.25} py={1.25}>
    <Skeleton height={40} variant='rounded' />
    <Skeleton height={40} variant='rounded' />
    <Skeleton height={40} variant='rounded' />
    <Skeleton height={35} variant='rounded' />
    <Skeleton height={40} variant='rounded' />
  </Box>
}
