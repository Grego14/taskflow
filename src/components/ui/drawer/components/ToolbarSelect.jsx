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
  const { t } = useTranslation('ui')
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // get the projects data for the drawer (projectId_drawer on the db)
  useEffect(() => {
    if (!uid) return

    const { userProjects, externalProjects } = projectService.getDrawerQueries(uid)
    const projectMap = new Map()

    const updateProjects = (snap) => {
      for (const doc of snap.docs) {
        projectMap.set(doc.id, projectService.formatDrawerProject(doc))
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
    const targetId = projectId || metadata?.lastEditedProject

    const found = projects.find(p => p.id === `${targetId}_drawer`)

    return found ? { ...found, isLast: !projectId } : null
  }, [projects, projectId, metadata?.lastEditedProject])

  const handleProjectChange = (e) => {
    const project = projects.find(p => p.id === e.target.value)

    if (project) navigate(`/projects/${project.owner}/${project.id}`)
  }

  if (!open || loading) return

  return actualProject || projects.length > 0 ? (
    <FormControl sx={{ minWidth: '10rem' }}>
      <InputLabel id='select-project'>
        {t(`drawer.toolbar.${actualProject.isLast ? 'lastProject' : 'actualProject'}`)}
      </InputLabel>
      <Select
        labelId='select-project'
        value={actualProject.id}
        label={actualProject.name}
        onChange={handleProjectChange}
        sx={selectStyles}
      >
        {actualProject.isLast && (
          <Typography textAlign='center' variant='body2' py={1} color='textSecondary'>
            {t('projects.myProjects')}
          </Typography>
        )}
        {projects.map(p => (
          <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <Button onClick={() => { navigate('/projects/new'); toggleDrawer(false) }}>
      {t('drawer.toolbar.newProject')}
    </Button>
  )
}
