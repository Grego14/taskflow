// components
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import CreateProject from '@components/ui/buttons/CreateProject'
import ProjectsCards from '@components/ui/projectcard/ProjectsCards'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// hooks
import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

// utils
import db from '@/db'
import i18n from '@/i18n'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError.js'
import {
  collection,
  collectionGroup,
  onSnapshot,
  query,
  where
} from 'firebase/firestore'

const boxStyles = { display: 'flex', flexDirection: 'column', gap: 2 }

export default function Projects() {
  const { uid } = useUser()
  const { isMobile } = useApp()
  const { t } = useTranslation('ui')
  const [projects, setProjects] = useState({ user: [], external: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return

    const qUser = query(
      collectionGroup(db, 'projects'),
      where('createdBy', '==', uid),
      where('drawerData', '==', false))
    const qExt = query(
      collectionGroup(db, 'projects'),
      where('members', 'array-contains', uid),
      where('createdBy', '!=', uid),
      where('drawerData', '==', false))

    const unsubUser = onSnapshot(qUser, snap => {
      const docs = snap.docs.map(doc => doc.data())
      setProjects(prev => ({ ...prev, user: docs }))
    })

    const unsubExt = onSnapshot(qExt, snap => {
      const docs = snap.docs.map(doc => doc.data())
      setProjects(prev => ({ ...prev, external: docs }))
      setLoading(false)
    })

    return () => {
      unsubUser()
      unsubExt()
    }
  }, [uid])

  const projectsQuantity = projects.user.length + projects.external.length

  const allProjects = useMemo(() => ([...projects.user, ...projects.external]), [projects])
  const hasProjects = allProjects.length > 0

  const createProjectBtnStyles = { alignSelf: isMobile ? 'center' : 'start' }

  if (loading) return <CircleLoader text={t('projects.loading')} height='100dvh' />

  return (
    <Box
      className={`${!projectsQuantity ? ' flex-center' : ''}`}
      pt={2}
      pb={10} // enough padding
      px={isMobile ? 2 : 3}
      my={!projectsQuantity ? 'auto' : 0}
      width='100%'>
      {projectsQuantity ? (
        <Box sx={boxStyles}>
          <Typography
            className={isMobile ? 'text-center' : ''}
            variant='h1'
            sx={[theme => ({ ...theme.typography.h4 })]}>
            {t('projects.title_quantity', { quantity: allProjects.length })}
          </Typography>
          <ProjectsCards data={allProjects} />
          <CreateProject sx={createProjectBtnStyles} />
        </Box>
      ) : (
        <Box sx={boxStyles}>
          <Typography variant='h5' textAlign='center'>
            {t('projects.errors.empty')}
          </Typography>
          <CreateProject sx={createProjectBtnStyles} />
        </Box>
      )}
    </Box>
  )
}
