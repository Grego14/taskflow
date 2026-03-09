import { memo } from 'preact/compat'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useTitleAnimation from '@hooks/animations/useTitleAnimation'

export default memo(function AnimatedTitle({
  children,
  id,
  loading,
  sx,
  onComplete,
  ...otherProps
}) {

  useTitleAnimation(id, {
    loading: typeof loading === 'boolean' ? loading : false,
    onComplete
  })

  if (loading) return null

  return (
    <Box overflow='hidden'>
      <Typography
        id={id}
        variant='h1'
        sx={theme => ({ ...theme.typography.h4, fontWeight: 700, ...sx })}
        {...otherProps}>
        {children}
      </Typography>
    </Box>
  )
})
