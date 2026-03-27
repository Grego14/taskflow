import Skeleton from '@mui/material/Skeleton'
import List from '@mui/material/List'

import useApp from '@hooks/useApp'

export default function ProjectItemsSkeleton() {
  const { isMobile } = useApp()

  return (
    <List
      disablePadding
      className='flex flex-center'
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1,
        flexGrow: 1,
        height: '48px'
      }}>

      {!isMobile ? (
        <Skeleton
          variant='rectangular'
          width={200}
          height={36}
          sx={{ borderRadius: 2, mr: 'auto' }}
        />
      ) : (
        <Skeleton variant='circular' width={40} height={40} />
      )}

      <Skeleton variant='circular' width={40} height={40} />
      <Skeleton variant='circular' width={40} height={40} />
      <Skeleton variant='circular' width={40} height={40} />
      <Skeleton variant='circular' width={40} height={40} />
    </List>
  )
}
