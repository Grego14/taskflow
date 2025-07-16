import { useAppState } from '@/context/AppContext'
import { useAuth } from '@/firebase/AuthContext'
import useProject from '@hooks/useProject'
import Button from '@mui/material/Button'
import { lazy, useEffect } from 'react'
import Nav from '@components/ui/Nav'

const HomeNoLoggedLayout = lazy(() => import('./HomeNoLoggedLayout'))
const LogOutButton = lazy(
  () => import('@components/reusable/buttons/LogOutButton')
)

// This modules will be removed when the dialogs are ready to use
const createProject = lazy(() => import('@services/createProject'))
const createTask = lazy(() => import('@services/createTask'))
const createDueDate = lazy(() => import('@utils/createDueDate'))

export default function Home() {
  const { currentUser, loading } = useAuth()

  const {
    user,
    loading: loadingUser,
    error,
    actualProject,
    updateActualProject
  } = useAppState()

  const {
    project,
    tasks,
    loading: loadingProjectAndTasks,
    error: projectError
  } = useProject(actualProject)

  useEffect(() => {
    if (actualProject && project)
      updateActualProject({ id: actualProject, data: project })
  }, [actualProject, updateActualProject, project])

  // TODO - Show the user a dialog with the project creation fields
  // Note - This function should be on its own file with the dialog.
  async function handleProjectCreation() {
    // testing data
    const projectData = {
      name: 'My Project',
      description: 'Project test...'
    }

    const project = await createProject(currentUser.uid, projectData)

    if (project) {
      console.log(project)
    }
  }

  // TODO - Show the user a dialog with the task creation fields
  // Note - This function should be on its own file with the dialog.
  async function handleTaskCreation() {
    const taskData = {
      title: 'Learn new skill',
      status: 'todo',
      priority: 'medium',
      dueDate: createDueDate(3),
      labels: ['learning', 'development']
    }

    await createTask(currentUser.uid, actualProject, taskData)
  }

  // TODO - Improve this by using spinners/ui skeletons
  if (loading) return <div>Checking if the user is logged...</div>

  return currentUser?.uid ? (
    <div>
      <Nav />
      LogOut: <LogOutButton />
      {loadingUser ? (
        <div>Getting user data from db...</div>
      ) : (
        <>
          {project && (
            <ul>
              <li>Actual Project: {project.name}</li>
              <li>
                <Button onClick={handleProjectCreation}>Create project</Button>
              </li>
              <li>
                <Button onClick={handleTaskCreation}>Create Task</Button>
              </li>
            </ul>
          )}
          {tasks && (
            <ul>
              {tasks.map(task => (
                <li key={`${task.id}-li`}>
                  <Button key={task.id}>{task.title}</Button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  ) : (
    <HomeNoLoggedLayout />
  )
}
