import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import AddMembersPreview from './AddMembersPreview'
import ProjectInput from '@components/reusable/projects/Input'

import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import useLoadResources from '@hooks/useLoadResources'
import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import getInteraction from '@utils/getInteraction'
import validateEmail from '@utils/validateEmail.js'
import userService from '@services/user'

export default memo(function AddMembers({ members, setMembers, isOwner }) {
  const { t } = useTranslation(['projects', 'validations'])
  const { isMobile } = useApp()
  const { currentUser } = useAuth()
  const loadingResources = useLoadResources('validations')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  const userEmail = currentUser?.email || currentUser?.providerData?.[0]?.email

  const [open, setOpen] = useState(false)
  const [disableSearchBtn, setDisableSearchBtn] = useState(true)

  const handleSearch = useCallback(async (targetEmail) => {
    const value = targetEmail?.trim()

    if (!value) return

    const emailValidation = validateEmail(value, { username: true })

    if (emailValidation.error)
      return setError(t(`email.${emailValidation.key}`, { ns: 'validations' }))

    if (value === userEmail)
      return setError(t('projects:addMembers.sameUser'))

    try {
      setLoading(true)
      setError('')

      const newMember = await userService.getByEmail(value)

      if (!newMember?.username) {
        setError(t('projects:addMembers.userNotFound'))
        return
      } else {

        // check for duplicates
        if (members?.some(m => m.email === value)) {
          setError(t('projects:addMembers.alreadyAdded'))
          return
        }

        setMembers([...(members || []), newMember])
        setEmail('')
      }
    } catch (err) {
      setError(t('projects:addMembers.couldNotGetTheUser'))
    } finally {
      setLoading(false)
    }
  }, [members, userEmail, t, setMembers])

  const handleKeyDown = (e) => {
    const { isEnter } = getInteraction(e)
    if (isEnter) handleSearch(email)
  }

  if (loadingResources) return (
    <Box>
      <Skeleton width='25%' />
      <Skeleton width='55%' height='4rem' />
    </Box>
  )

  return (
    <Box>
      <Box
        className={`flex${isMobile ? ' flex-column' : ''}`}
        alignItems={isMobile ? 'initial' : 'flex-end'}
        gap={2}>
        <ProjectInput
          id='member-search'
          label={t('projects:addMembers.label')}
          placeholder={t('projects:addMembers.placeholder')}
          disabled={!isOwner || loading}
          value={email}
          setValue={setEmail}
          // the validations are made when the user clicks the search button so
          // we just send true and remove the error
          onChange={() => {
            if (error) setError('')
            return true
          }}
          onKeyDown={handleKeyDown}
          error={error}
          slotProps={{
            input: {
              startAdornment: <SearchIcon fontSize='small' sx={{ mr: 1 }} />,
              endAdornment: loading && <CircularProgress color='inherit' size={20} />
            }
          }}
          sx={{ mt: 1 }}
        />

        <Button
          sx={{ height: '2.5rem', mb: error && 3 }} // align with the input height
          startIcon={<SearchIcon fontSize='small' />}
          variant='contained'
          onClick={() => handleSearch(email)}
          disabled={!isOwner || loading || !email}>
          {t('projects:addMembers.search')}
        </Button>
      </Box>

      <AddMembersPreview members={members} setMembers={setMembers} />
    </Box>
  )
})
