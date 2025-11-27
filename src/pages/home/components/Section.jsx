import Box from '@mui/material/Box'

export default function Section(props) {
  const { children, sx, ...other } = props
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        height: '100dvh',
        ...sx
      }}
      {...other}>
      {children}
    </Box>
  )
}
