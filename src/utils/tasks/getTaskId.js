export default function getTaskId(element) {
  return (
    element.dataset?.taskid ||
    element.closest?.('[data-taskid]')?.dataset?.taskid ||
    element.querySelector?.('[data-taskid]')?.dataset?.taskid
  )
}
