import ChevronLeft from '@mui/icons-material/ChevronLeft'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

export default function GoBackButton(props) {
  const { t } = useTranslation('common')
  const { handler, text, sx, noText, ...other } = props

  return (
    <Button
      onClick={handler}
      startIcon={<ChevronLeft />}
      sx={{
        alignSelf: 'center',
        ...sx,
        '& .MuiButton-startIcon': {
          mr: noText ? 0 : 1
        }
      }}
      aria-label={noText ? text || t('goBack') : null}
      {...other}>
      {!noText ? text || t('goBack') : null}
    </Button>
  )
}
