import Box from '@mui/material/Box'

export default function DropIndicator({ visible, maxWidth, isTop }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: isTop ? -12 : 'unset',
        bottom: !isTop ? -12 : 'unset',
        height: 2,
        width: '100%',
        backgroundColor: 'primary.main',
        borderRadius: 1,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease',
        pointerEvents: 'none',
        maxWidth
      }}
    />
  )
}
