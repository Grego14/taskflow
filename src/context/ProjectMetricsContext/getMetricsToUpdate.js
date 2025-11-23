/**
 * Determines all higher-level metric fields that must be updated
 * based on the most specific field returned by getMetricPeriod.
 *
 * @param {string} specificPeriod - The most specific field returned (e.g., 'today', 'thisWeek').
 * @returns {string[]} An array with all fields that should be incremented.
 */
export default function getMetricsToUpdate(specificPeriod) {
  const accumulativeContainers = ['thisMonth', 'thisQuarterly', 'thisYear']

  if (specificPeriod === 'yesterday') {
    // if it is 'yesterday', it should only propagate to the upper containers (month, quarter, year)
    // it does NOT propagate to lastWeek or thisWeek, as yesterday is a metric itself
    // this solves the problem of counting yesterday in lastWeek/thisWeek incorrectly
    return ['yesterday', ...accumulativeContainers]
  }

  let fieldsToUpdate = [specificPeriod]

  // acummulates thisWeek and the superior containers
  if (specificPeriod === 'today') {
    fieldsToUpdate.push('thisWeek')
    fieldsToUpdate.push(...accumulativeContainers)
  } else if (specificPeriod === 'thisWeek' || specificPeriod === 'lastWeek') {
    fieldsToUpdate.push(...accumulativeContainers)
  } else if (accumulativeContainers.includes(specificPeriod)) {
    const specificIndex = accumulativeContainers.indexOf(specificPeriod)
    fieldsToUpdate = accumulativeContainers.slice(specificIndex)
  }

  return (
    fieldsToUpdate.filter(field => {
      // a today task should not get the lastWeek period
      if (specificPeriod === 'today' && field === 'lastWeek') return false

      // a lastWeek task should not get the thisWeek period
      if (specificPeriod === 'lastWeek' && field === 'thisWeek') return false

      // a this week task should not get the lastWeek period
      if (specificPeriod === 'thisWeek' && field === 'lastWeek') return false

      return true
    }) || []
  )
}
