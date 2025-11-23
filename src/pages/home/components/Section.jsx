import Box from '@mui/material/Box'

const Section = function Section(props, ref) {
  const { children, id, scrollTo, sx, ...other } = props
  const sectionId = `section-${id}`

  return (
    <Box
      id={sectionId}
      ref={ref}
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

export default Section
