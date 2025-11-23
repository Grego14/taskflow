import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'

import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import useUser from '@hooks/useUser'
import { useEffect, useState } from 'react'

import { db } from '@/firebase/firebase-config'
import i18n from '@/i18n'
import useNavigateToProject from '@hooks/useNavigateToProject'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError'
import {
  collection,
  collectionGroup,
  documentId,
  getDocs,
  onSnapshot,
  query,
  where
} from 'firebase/firestore'

export default function ToolbarSelect({ open, toggleDrawer }) {
  const { uid, metadata } = useUser()
  const { projectId } = useParams()
  const [projects, setProjects] = useState([])

  const { t } = useTranslation('ui')
  const navigate = useNavigateToProject()

  function handleProjectChange(e) {
    const projectId = e.target.value
    const projectData = projects?.find(p => p.id === projectId)

    if (!projectData?.owner) return

    navigate(projectId, projectData.owner)
  }

  // get the projects data for the drawer (projectId_drawer on the db)
  useEffect(() => {
    let unsubscribe
    ;(async () => {
      try {
        const userProjectsRef = query(
          collection(db, 'users', uid, 'projects'),
          where('drawerData', '==', true)
        )

        const externalProjectsRef = query(
          collectionGroup(db, 'projects'),
          where('members', 'array-contains', uid),
          where('drawerData', '==', true)
        )

        const userProjectsSnapshot = onSnapshot(
          userProjectsRef,
          snap => {
            if (!snap.empty) {
              const userProjects = snap.docs.map(doc => {
                const { id, name, owner } = doc.data()
                return { id, name, owner }
              })

              setProjects(prev => {
                const map = new Map()

                for (const project of [...prev, ...userProjects]) {
                  map.set(project.id, project)
                }

                return [...map.values()]
              })
            }
          },
          e => console.error('userProjects:', e)
        )

        const externalProjectSnapshot = onSnapshot(
          externalProjectsRef,
          snap => {
            if (!snap.empty) {
              const externalProjects = snap.docs.map(doc => {
                const { id, name, owner } = doc.data()
                return { id, name, owner }
              })

              setProjects(prev => {
                const map = new Map()

                for (const project of [...prev, ...externalProjects]) {
                  map.set(project.id, project)
                }

                return [...map.values()]
              })
            }
          },
          e => console.error('externalProjects:', e)
        )

        unsubscribe = () => {
          userProjectsSnapshot()
          externalProjectSnapshot()
        }
      } catch (err) {
        // console.error(err)
        throw getFriendlyAuthError(err.message, i18n.language)
      }
    })()

    return () => unsubscribe?.()
  }, [uid])

  const actualProject = (() => {
    const { name, id } =
      projects?.find(
        project => project.id === (projectId || metadata?.lastEditedProject)
      ) || {}

    if (!name || !id) return null

    return { id, name, isLast: !projectId }
  })()

  const showSelector = open && !!actualProject

  // we show differents select element labels if the project is the last edited
  // (retrieved from metadata.lastEditedProject) or if the project is the actual
  // being edited
  const isLastProject = actualProject?.isLast

  return (
    <>
      <FormControl
        sx={{
          minWidth: '10rem',
          display: showSelector ? 'inline-flex' : 'none'
        }}>
        <InputLabel id='select-label'>
          {t(
            `drawer.toolbar.${isLastProject ? 'lastProject' : 'actualProject'}`
          )}
        </InputLabel>
        <Select
          labelId='select-label'
          value={actualProject?.id || ''}
          label={actualProject?.name}
          onChange={handleProjectChange}
          sx={[
            theme => ({
              '& .MuiSelect-select': {
                ...theme.typography.subtitle2,
                fontSize: '0.825rem',
                py: 1
              }
            })
          ]}>
          {isLastProject && (
            <Typography
              textAlign='center'
              variant='body2'
              py={1}
              color='textSecondary'>
              {t('projects.myProjects')}
            </Typography>
          )}
          {projects.map(project =>
            project?.name && project?.owner && project?.id ? (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ) : null
          )}
        </Select>
      </FormControl>

      {open && !actualProject && (
        <Button
          onClick={() => {
            navigate('/projects/new')
            toggleDrawer(false)
          }}>
          {t('drawer.toolbar.newProject')}
        </Button>
      )}
    </>
  )
}
