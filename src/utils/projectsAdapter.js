export default function projectsAdapter(projects) {
  const projectsAdapted = {}

  for (const project of projects) {
    projectsAdapted[project.id] = project
  }

  return projectsAdapted
}
