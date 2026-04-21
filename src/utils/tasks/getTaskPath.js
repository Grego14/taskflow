export default function getTaskPath (ownerId, projectId, parentId) {
  const base = `users/${ownerId}/projects/${projectId}/tasks`
  return parentId ? `${base}/${parentId}/subtasks` : base
}
