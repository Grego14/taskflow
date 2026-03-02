export default function getTaskMetadata(element) {
  const taskDataset = (() => {
    if (element.dataset?.taskId) return element.dataset

    const selector = '[data-task-id]'

    const closest = element.closest(selector)?.dataset
    if (closest?.taskId) return closest

    const qS = element.querySelector(selector)?.dataset
    if (qS?.taskId)
      return qS

    return {}
  })()

  const { taskId, isSubtask, parentId } = taskDataset

  return { taskId, isSubtask: isSubtask === 'true', parentId }
}
