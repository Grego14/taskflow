export default function getTaskMetadata(element) {
  const taskDataset = (() => {
    if (element.dataset?.taskId) return element.dataset

    const selector = '[data-task-id]'

    if (element.closest(selector)?.dataset?.taskId)
      return element.closest(selector)?.dataset

    if (element.querySelector(selector)?.dataset?.taskId)
      return element.querySelector(selector)?.dataset

    return {}
  })()

  const { taskId, isSubtask, parentId } = taskDataset

  return { taskId, isSubtask: isSubtask === 'true', parentId }
}
