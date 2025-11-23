export default function getProjectData(projects, target) {
  let projectData = {}

  for (const project of Object.values(projects)) {
    if (project.id === target) {
      projectData = project
    }
  }

  return projectData
}
