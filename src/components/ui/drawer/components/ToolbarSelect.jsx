import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useUser from '@hooks/useUser'
import useLayout from '@hooks/useLayout'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FolderOpen from '@mui/icons-material/FolderOpen'
import Box from '@mui/material/Box'

const selectStyles = {
  '& .MuiSelect-select': {
    fontWeight: 500,
    fontSize: '0.825rem',
    py: 1,
    maxWidth: '12ch'
  }
}

const labelStyles = {
  transform: 'translate(38px, 8px) scale(1)',
  '&.MuiInputLabel-shrink': {
    transform: 'translate(0px, 4px) scale(0.75)'
  }
}

const iconStyles = {
  fontSize: '1rem',
  mx: 0.75,
  color: 'action.active'
}

const formControlStyles = {
  minWidth: '10rem',
  '& .MuiInputBase-root': { mt: 2 }
}

export default function ToolbarSelect() {
  const { uid, metadata } = useUser()
  const { projectId } = useParams()
  const { t } = useTranslation(['ui', 'projects'])
  const navigate = useNavigate()
  const { drawerOpen, toggleDrawer, isPreview, triggerUpsell } = useLayout()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFocused, setIsFocused] = useState(false)

  // get the projects data for the drawer (projectId_drawer on the db)
  useEffect(() => {
    if (!uid || isPreview) return

    let unsubUser
    let unsubExternal

    const getProjectsDrawerData = async () => {
      const { default: projectService } = await import('@services/project')
      const { userProjects, externalProjects } = projectService.getDrawerQueries(uid)
      const projectMap = new Map()

      const updateProjects = (snap) => {
        for (const change of snap.docChanges()) {
          const { id } = change.doc

          if (change.type === 'removed') {
            projectMap.delete(id)
          } else {
            // added or modified
            projectMap.set(id, projectService.formatDrawerProject(change.doc))
          }
        }

        setProjects([...projectMap.values()])
        setLoading(false)
      }

      const { dbAdapter } = await import('@services/dbAdapter')

      unsubUser = dbAdapter.listen(userProjects, updateProjects)
      unsubExternal = dbAdapter.listen(externalProjects, updateProjects)
    }

    getProjectsDrawerData()

    return () => {
      unsubUser?.()
      unsubExternal?.()
    }
  }, [uid])

  const actualProject = useMemo(() => {
    // Intentamos buscar por el ID de la URL o por el último editado
    const targetId = projectId || metadata?.lastEditedProject
    const found = projects.find(p => p.id === `${targetId}_drawer`)

    if (!found) return null

    return { ...found, isLast: !projectId }
  }, [projects, projectId, metadata?.lastEditedProject])

  const handleProjectChange = (e) => {
    const project = projects.find(p => p.id === e.target.value)

    if (project) {
      const cleanId = project.id.replace('_drawer', '')
      navigate(`/projects/${project.owner}/${cleanId}`)
    }
  }

  const hasProjects = projects.length > 0
  const toolbarKey = actualProject?.isLast ? 'lastProject' : 'actualProject'

  // to show when the user has recently edited a project or is in a project
  const projectLabel = t(`ui:drawer.toolbar.${toolbarKey}`)

  // to show when the user has no lastEditedProject and he isn't inside a
  // project
  const defaultLabel = t('projects:myProjects')
  const label = actualProject ? projectLabel : defaultLabel

  const shouldShrink = !!actualProject?.id || isFocused

  const handleNewProject = () => {
    if (!isPreview) {
      navigate('/projects/new')
      toggleDrawer(false)
      return

    }

    triggerUpsell('new-project')
  }

  return (
    <Box className='hide-element toolbar-select'>
      {(actualProject || hasProjects) ? (
        <FormControl sx={formControlStyles}>
          <InputLabel
            id='select-project'
            shrink={shouldShrink}
            sx={labelStyles}>
            {label}
          </InputLabel>
          <Select
            variant='standard'
            labelId='select-project'
            value={actualProject?.id || ''}
            label={shouldShrink ? label : ''}
            onChange={handleProjectChange}
            sx={selectStyles}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            startAdornment={ <FolderOpen sx={iconStyles} /> }>
            {projects.map(p => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Button onClick={handleNewProject}>
          {t('ui:drawer.toolbar.newProject')}
        </Button>
      )}
    </Box>
  )
}
