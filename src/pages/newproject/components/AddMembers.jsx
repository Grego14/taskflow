import SearchIcon from '@mui/icons-material/Search'
import AutoComplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import MembersPreview from './MembersPreview'

import useDebounce from '@hooks/useDebounce'
import useLoadResources from '@hooks/useLoadResources'
import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import getUserByEmail from '@services/getUserByEmail'
import getInteraction from '@utils/getInteraction'
import validateEmail from '@utils/validateEmail.js'

export default memo(function AddMembers({ members, setMembers }) {
  const { t } = useTranslation(['ui', 'validations'])

  const loadingResources = useLoadResources('validations')

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [disableSearchBtn, setDisableSearchBtn] = useState(true)
  const [email, setEmail] = useState('')

  const [handleGetUsers] = useDebounce(value => {
    ;(async () => {
      try {
        setLoading(true)

        const newMember = await getUserByEmail(value)

        if (newMember?.username) {
          setMembers(prev => {
            // avoid duplicated objects
            if (prev?.find(member => member.email === value)) {
              return prev
            }

            return [...(prev || []), newMember]
          })
        } else {
          setError(t('projects.new.userNotFound'))
        }

        setLoading(false)
        setEmail('')
        setDisableSearchBtn(true)
      } catch (err) {
        // console.error(err)
        setLoading(false)
      }
    })()
  }, 500)

  const handleOnChange = useCallback(
    e => {
      const value = e.target.value.trim()

      setEmail(value)

      const emailValidation = validateEmail(value, { username: true })

      if (!value) {
        setError(t('email.emailRequired', { ns: 'validations' }))
        setDisableSearchBtn(true)
        return
      }

      if (emailValidation.error) {
        setError(t(`email.${emailValidation.key}`, { ns: 'validations' }))
        setDisableSearchBtn(true)
        return
      }

      setDisableSearchBtn(false)
      setError('')
    },
    [t]
  )

  const handleKeyDown = useCallback(e => {
    const { isEnter } = getInteraction(e)

    if (!isEnter || error) return

    handleGetUsers(e.target.value.trim())
  })

  if (loadingResources)
    return (
      <Box>
        <Skeleton width='25%' />
        <Skeleton width='55%' height='4rem' />
      </Box>
    )

  return (
    <Box>
      <Typography variant='subtitle1' fontWeight={600} mb={1.5}>
        {t('projects.new.addMembersLabel')}
      </Typography>

      <Box className='flex' alignItems='center' gap={2}>
        <TextField
          label={t('projects.new.addMemberPlaceholder')}
          error={!!error}
          aria-errormessage='emailError'
          onKeyDown={handleKeyDown}
          value={email}
          onChange={handleOnChange}
          onBlur={() => setError('')}
          slotProps={{
            input: {
              endAdornment: loading ? (
                <CircularProgress color='inherit' size={20} />
              ) : null,
              startAdornment: <SearchIcon fontSize='small' />,
              sx: {
                '& .MuiInputBase-input': {
                  pl: 1
                }
              }
            }
          }}
        />

        <Button
          startIcon={<SearchIcon fontSize='small' />}
          variant='contained'
          onClick={() => handleGetUsers(email)}
          disabled={disableSearchBtn || !!error}>
          {t('projects.new.searchMember')}
        </Button>
      </Box>

      {error && (
        <Typography variant='body2' color='error' id='emailError' mt={1}>
          {error}
        </Typography>
      )}

      <MembersPreview members={members} setMembers={setMembers} />
    </Box>
  )
})
