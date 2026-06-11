import Box from '@mui/material/Box'

export default function DropIndicator({ maxWidth, isTop, isSubtask }) {
  const offset = isSubtask ? 0 : -8

  return (
    <Box
      sx={{
        position: 'absolute',
        top: isTop ? offset : 'unset',
        bottom: !isTop ? offset : 'unset',
        height: 2,
        width: '100%',
        backgroundColor: 'primary.main',
        borderRadius: 1,
        pointerEvents: 'none',
        maxWidth: !isSubtask 
          ? `calc(var(--mui-ui-taskCardMaxWidth) - 5rem)` 
          : '100%'
      }}
      role='none'
    />
  )
}
