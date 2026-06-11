import Skeleton from '@mui/material/Skeleton'
import List from '@mui/material/List'

import useApp from '@hooks/useApp'

export default function ProjectItemsSkeleton() {
  const { isMobile } = useApp()

  return (
    <List disablePadding className='flex project-items-list'>
      {!isMobile ? (
        <Skeleton
          variant='rectangular'
          width={200}
          height={36}
          className='project-skeleton-rect'
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
