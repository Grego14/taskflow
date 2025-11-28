import useProject from '@hooks/useProject'
import { useEffect, useMemo, useState } from 'react'

import getProjectTasksForMetrics from '@querys/getProjectTasksForMetrics'
import { Outlet } from 'react-router-dom'
import ProjectMetricsContext from './context'

import getMembersMetrics from './getMembersMetrics'
import getMetrics from './getMetrics'

export default function ProjectMetricsProvider() {
  const { data, projectMembers } = useProject()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    getProjectTasksForMetrics({
      owner: data?.createdBy,
      project: data?.id,
      onError: err => setError(err),
      onUpdate: tasks => {
        setTasks(tasks)
        setLoading(false)
      }
    })
  }, [data?.createdBy, data?.id])

  const value = useMemo(
    () => ({
      loading,
      error,
      projectMetrics: getMetrics(tasks) || [],
      membersMetrics: getMembersMetrics(tasks, projectMembers) || []
    }),
    [error, loading, tasks, projectMembers]
  )

  return (
    <ProjectMetricsContext.Provider value={value}>
      <Outlet />
    </ProjectMetricsContext.Provider>
  )
}
