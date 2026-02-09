import CircleLoader from '@components/reusable/loaders/CircleLoader'
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

import db from '@/db'
// utils
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
  const [projects, setProjects] = useState({ user: [], external: [] })
  const [loading, setLoading] = useState(true)

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

            setProjects(projects => {
              const newProjects = { user: [], external: projects.external }

              for (const project of userProjects) {
                newProjects.user.push(project)
              }

              return newProjects
            })

            setLoading(false)
          },
          e => console.error(e)
        )

        const externalProjectsSnapshot = onSnapshot(
          externalProjectsQuery,
          snap => {
            const externalProjects = snap.docs.map(doc => doc.data())

            setProjects(projects => {
              const newProjects = { user: projects.user, external: [] }

              for (const project of externalProjects) {
                newProjects.external.push(project)
              }

              return newProjects
            })

            setLoading(false)
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

  const projectsQuantity = projects.user.length + projects.external.length

  if (loading)
    return <CircleLoader text={t('projects.loading')} height='100dvh' />

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
          <ProjectsCards data={[...projects.user, ...projects.external]} />
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
