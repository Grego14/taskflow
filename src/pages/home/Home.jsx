import { useUser } from '@/App.jsx'
import { useAuth } from '@/firebase/AuthContext'
import useProject from '@hooks/useProject'
import Button from '@mui/material/Button'
import { lazy } from 'react'

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
    setUser,
    actualProject,
    updateActualProject
  } = useUser()

  const {
    project,
    tasks,
    loading: loadingProjectAndTasks,
    error: projectError
  } = useProject(actualProject)

  // TODO - Improve this by using spinners/ui skeletons
  if (loading) return <div>Checking if the user is logged...</div>

  if (!currentUser?.uid) return <HomeNoLoggedLayout />

  if (loadingUser) return <div>Fetching user document...</div>

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

  return (
    <div>
      LogOut: <LogOutButton />
      {loadingUser ? (
        <div>Getting user data from db...</div>
      ) : (
        <>
          {user.profile && user.preferences && (
            <ul>
              <li>Username: {user.profile?.username}</li>
              <li>Email: {user.profile?.email}</li>
              <ul>
                Preferences:
                <li>Language: {user.preferences?.lang}</li>
                <li>Theme: {user.preferences?.theme}</li>
              </ul>
            </ul>
          )}
          {project && (
            <ul>
              <li>Actual Project: {project.data.name}</li>
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
  )
}
