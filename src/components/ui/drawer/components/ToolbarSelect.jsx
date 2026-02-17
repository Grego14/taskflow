import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { dbAdapter } from '@services/dbAdapter'
import projectService from '@services/project'
import useUser from '@hooks/useUser'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FolderOpen from '@mui/icons-material/FolderOpen'

const selectStyles = theme => ({
  '& .MuiSelect-select': {
    ...theme.typography.subtitle2,
    fontSize: '0.825rem',
    py: 1
  }
})

export default function ToolbarSelect({ open, toggleDrawer }) {
  const { uid, metadata } = useUser()
  const { projectId } = useParams()
  const { t } = useTranslation(['ui', 'projects'])
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFocused, setIsFocused] = useState(false)

  // get the projects data for the drawer (projectId_drawer on the db)
  useEffect(() => {
    if (!uid) return

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

    const unsubUser = dbAdapter.listen(userProjects, updateProjects)
    const unsubExternal = dbAdapter.listen(externalProjects, updateProjects)

    return () => {
      unsubUser()
      unsubExternal()
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

  if (!open || loading) return

  const hasProjects = projects.length > 0

  // to show when the user has recently edited a project or is in a project
  const projectLabel = t(`drawer.toolbar.${actualProject?.isLast
    ? 'lastProject'
    : 'actualProject'}`,
    { ns: 'ui' })

  // to show when the user has no lastEditedProject and he isn't inside a
  // project
  const defaultLabel = t('myProjects', { ns: 'projects' })
  const label = actualProject ? projectLabel : defaultLabel

  const shouldShrink = !!actualProject?.id || isFocused

  return (actualProject || hasProjects) ? (
    <FormControl sx={{ minWidth: '10rem' }}>
      <InputLabel
        id='select-project'
        shrink={shouldShrink}
        sx={{
          transform: 'translate(38px, 8px) scale(1)',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -8px) scale(0.75)'
          }
        }}>
        {label}
      </InputLabel>
      <Select
        labelId='select-project'
        value={actualProject?.id || ''}
        label={shouldShrink ? label : ''}
        onChange={handleProjectChange}
        sx={selectStyles}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        startAdornment={
          <FolderOpen
            sx={{
              fontSize: '1rem',
              ml: 0.5,
              color: 'action.active'
            }}
          />
        }
      >
        {projects.map(p => (
          <MenuItem key={p.id} value={p.id}>
            {p.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <Button onClick={() => { navigate('/projects/new'); toggleDrawer(false) }}>
      {t('drawer.toolbar.newProject', { ns: 'ui' })}
    </Button>
  )
}
