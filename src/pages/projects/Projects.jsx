// components
import CreateProject from '@components/ui/buttons/CreateProject'
import ProjectsCards from '@components/ui/projectcard/ProjectsCards'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// hooks
import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// utils
import { db } from '@/firebase/firebase-config'
import i18n from '@/i18n'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError.js'
import {
  collection,
  collectionGroup,
  onSnapshot,
  query,
  where
} from 'firebase/firestore'

export default function Projects() {
  const { uid } = useUser()
  const { isMobile } = useApp()
  const { t } = useTranslation('ui')
  const [projects, setProjects] = useState([])

  useEffect(() => {
    let unsubscribe
    ;(async () => {
      try {
        const userProjectsQuery = query(
          collectionGroup(db, 'projects'),
          where('createdBy', '==', uid),
          where('drawerData', '==', false)
        )
        const externalProjectsQuery = query(
          collectionGroup(db, 'projects'),
          where('members', 'array-contains', uid),
          where('createdBy', '!=', uid),
          where('drawerData', '==', false)
        )

        const userProjectsSnapshot = onSnapshot(
          userProjectsQuery,
          snap => {
            const userProjects = snap.docs.map(doc => doc.data())
            setProjects(prev => [...(prev || []), ...userProjects])
          },
          e => console.error(e)
        )

        const externalProjectsSnapshot = onSnapshot(
          externalProjectsQuery,
          snap => {
            const externalProjects = snap.docs.map(doc => doc.data())
            setProjects(prev => [...(prev || []), ...externalProjects])
          },
          e => console.error(e)
        )

        unsubscribe = () => {
          userProjectsSnapshot()
          externalProjectsSnapshot()
        }
      } catch (error) {
        // console.error('getProjects:', error)
        throw getFriendlyAuthError(error.message, i18n.language)
      }
    })()

    return () => unsubscribe?.()
  }, [uid])

  const projectsQuantity = projects?.length

  return (
    <Box
      className={`flex flex-column${!projectsQuantity ? ' flex-center' : ''}`}
      gap={2}
      pt={2}
      pb={10} // enough padding
      px={isMobile ? 2 : 3}
      my={!projectsQuantity ? 'auto' : 0}
      width='100%'>
      {projectsQuantity ? (
        <>
          <Typography
            className={isMobile ? 'text-center' : ''}
            variant='h1'
            sx={[theme => ({ ...theme.typography.h4 })]}>
            {t('projects.title_quantity', { quantity: projectsQuantity })}
          </Typography>
          <ProjectsCards data={projects} />
          <CreateProject sx={{ alignSelf: isMobile ? 'center' : 'start' }} />
        </>
      ) : (
        <>
          <Typography variant='h5' textAlign='center'>
            {t('projects.errors.empty')}
          </Typography>
          <CreateProject />
        </>
      )}
    </Box>
  )
}
