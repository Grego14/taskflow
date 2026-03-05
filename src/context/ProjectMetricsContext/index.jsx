import { useState, useMemo, useCallback, startTransition } from 'preact/compat'
import { Outlet } from 'react-router-dom'
import ProjectMetricsContext from './context'

import useProject from '@hooks/useProject'

import getMetrics from './getMetrics'
import getMembersMetrics from './getMembersMetrics'

import metricsService from '@services/metrics'

export default function ProjectMetricsProvider() {
  const { data, projectMembers } = useProject()
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])

  const [dateRange, setDateRange] = useState({ start: null, end: null })
  const [selectedMembers, setSelectedMembers] = useState([])

  const fetchMetrics = useCallback(async (start = null, end = null) => {
    setLoading(true)
    setDateRange({ start, end })

    try {
      await metricsService.getProjectTasksForMetrics({
        owner: data?.createdBy,
        project: data?.id,
        startDate: start,
        endDate: end,
        onUpdate: (fetchedTasks) => {
          startTransition(() => {
            setTasks(fetchedTasks)
            setLoading(false)
          })
        }
      })
    } catch (err) {
      setLoading(false)
      console.error(err)
    }
  }, [data?.createdBy, data?.id])

  useMemo(() => {
    if (data?.id) fetchMetrics()
  }, [data?.id, fetchMetrics])

  const value = useMemo(() => {
    const rawMembersMetrics = getMembersMetrics(tasks, projectMembers) || []

    const filteredMembersMetrics = selectedMembers.length > 0
      ? rawMembersMetrics.filter(m => selectedMembers.includes(m.id))
      : rawMembersMetrics

    return {
      loading,
      projectMetrics: getMetrics(tasks) || {},
      membersMetrics: filteredMembersMetrics,
      dateRange,
      selectedMembers,
      setSelectedMembers,
      updateRange: fetchMetrics
    }
  }, [loading, tasks, projectMembers, selectedMembers, dateRange, fetchMetrics])

  return (
    <ProjectMetricsContext.Provider value={value}>
      <Outlet />
    </ProjectMetricsContext.Provider>
  )
}
