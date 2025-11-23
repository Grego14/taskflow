import ProjectMetricsContext from '@context/ProjectMetricsContext/context'
import { useContext } from 'react'

export default function useProjectMetrics() {
  return useContext(ProjectMetricsContext)
}
