import Box from '@mui/material/Box'

export default function Section(props) {
  const { children, sx, className, ...other } = props
  return (
    <Box
      className={`flex flex-column flex-center ${className}`}
      sx={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        height: '100dvh',
        flexGrow: 1,
        ...sx
      }}
      {...other}>
      {children}
    </Box>
  )
}
