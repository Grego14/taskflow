import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function CircleLoader({ text, height = '100%' }) {
  const { t } = useTranslation('common')
  const [animatedText, setAnimatedText] = useState(text)
  const [dots, setDots] = useState('')
  const interval = useRef(null)

  useEffect(() => {
    interval.current = setInterval(() => {
      const _dots = dots.length === 3 ? '' : '.'.repeat(dots.length + 1)

      setDots(_dots)
      setAnimatedText(`${text}${_dots}`)
    }, 500)

    return () => clearInterval(interval.current)
  }, [dots, text])

  return (
    <Box
      sx={{
        width: '100%',
        height,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <CircularProgress
        color='secondary'
        {...(text ? { 'aria-hidden': true } : { 'aria-label': t('loading') })}
      />
      {text && <Typography>{animatedText}</Typography>}
    </Box>
  )
}
