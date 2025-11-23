export default function checkProjectAccess({ uid, projects, projectId }) {
  // avoid ui jumps
  if (!uid || !projects || !projectId) return

  const project = projects?.[projectId]

  if (!project || !project?.members) return false

  return !!project.members.find(member => member === uid)
}
