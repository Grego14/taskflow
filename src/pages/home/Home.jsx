import { useUser } from '@/App.jsx'
import { useAuth } from '@/firebase/AuthContext'
import { db } from '@/firebase/firebase-config.js'
import LogOutButton from '@components/reusable/buttons/LogOutButton'
import LoginButton from '@components/reusable/buttons/LoginButton'
import SignUpButton from '@components/reusable/buttons/SignUpButton'
import useTranslations from '@hooks/useTranslations'
import Button from '@mui/material/Button'
import createProject from '@services/createProject'
import createTask from '@services/createTask'
import getProject from '@services/getProject'
import getFriendlyAuthError from '@utils/getFriendlyAuthError'
import { doc, onSnapshot, collection } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import createDueDate from '@utils/createDueDate'

export default function Home() {
  const { isOffline, currentUser, loading } = useAuth()
  const {
    user,
    loading: loadingUser,
    error,
    setUser,
    actualProject,
    updateActualProject
  } = useUser()

  // TODO - Improve this by using spinners/ui skeletons
  if (loading) return <div>Checking if the user is logged...</div>

  if (loadingUser) return <div>Fetching user document...</div>

  const homeContent = useRef(null)

  const t = useTranslations()
  const homeTexts = t.home
  const lang = user.preferences.lang

  const [projectData, setProjectData] = useState(null)
  const [projectTasks, setProjectTasks] = useState(null)

  async function getProjectData(projectId) {
    if (projectId === actualProject) return

    const data = await getProject(currentUser.uid, projectId)

    if (data) {
      updateActualProject(projectId)
      setProjectData(data)
    }
  }

  // listen to actual project changes and update the projectData
  useEffect(() => {
    const projectRef = doc(
      db,
      'users',
      currentUser.uid,
      'projects',
      actualProject
    )

    const unsubscribe = onSnapshot(
      projectRef,
      snap => {
        if (snap.exists()) {
          setProjectData(snap.data())
          console.log('Project updated:', snap.data())
        }
      },
      err => {
        console.error(getFriendlyAuthError(err.message).message)
      }
    )

    return () => unsubscribe()
  }, [actualProject, currentUser?.uid])

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

  // listen to actual project tasks changes and update the projectTasks
  useEffect(() => {
    const tasksRef = collection(
      db,
      'users',
      currentUser.uid,
      'projects',
      actualProject,
      'tasks'
    )

    const unsubscribe = onSnapshot(
      tasksRef,
      snap => {
        if (!snap.empty) {
          // convert the tasks to an array
          const data = snap.docs.map(task => ({ ...task.data(), id: task.id }))

          setProjectTasks(data)
          console.log('Project Tasks Updated:', data)
        }
      },
      err => {
        console.error(getFriendlyAuthError(err.message).message)
      }
    )

    return () => unsubscribe()
  }, [actualProject, currentUser?.uid])

  // TODO - Move the not logged content to it's own component and separate the
  // logged content into tiny components
  return currentUser ? (
    <div>
      LogOut: <LogOutButton />
      {loadingUser ? (
        <div>Getting user data from db...</div>
      ) : (
        <>
          <ul>
            <li>Username: {user.profile?.username}</li>
            <li>Email: {user.profile?.email}</li>
            <ul>
              Preferences:
              <li>Language: {user.preferences?.lang}</li>
              <li>Theme: {user.preferences?.theme}</li>
            </ul>
          </ul>
          <ul>
            {user.projects?.map(project => (
              <Button
                onClick={() => getProjectData(project.id)}
                key={project.id}>
                {project.name}
              </Button>
            ))}
            <li>
              <Button onClick={handleProjectCreation}>Create project</Button>
            </li>
            <li>
              <Button onClick={handleTaskCreation}>Create Task</Button>
            </li>
          </ul>
          <ul>
            {projectTasks?.map(task => (
              <Button key={task.id}>{task.title}</Button>
            ))}
          </ul>
        </>
      )}
    </div>
  ) : (
    <div className='home'>
      <div className='home__content' ref={homeContent}>
        <div className='content__start'>
          <h1 className='home__title'>TaskFlow your task manager.</h1>
          <p className='home__text'>
            {homeTexts.title[0]}
            <span className='home__text__taskflow'>TaskFlow</span>
            {homeTexts.title[1]}
            <span className='home__text__later'>{homeTexts.title[2]}</span>
          </p>
          <button
            type='button'
            onClick={() =>
              homeContent.current.scrollBy({
                top: document.documentElement.clientHeight * 2,
                behavior: 'smooth'
              })
            }>
            Continue
          </button>
        </div>
        <div className='content__preview'>
          <div>INSERT TASKS PREVIEW</div>
          <button
            type='button'
            onClick={() =>
              homeContent.current.scrollBy({
                top: document.documentElement.clientHeight * 3,
                behavior: 'smooth'
              })
            }>
            Continue
          </button>
        </div>
        <div className='content__login'>
          <p>{homeTexts.login}</p>
          <div className='home__auth-buttons'>
            <LoginButton />
            <span>or</span>
            <SignUpButton />
          </div>
        </div>
      </div>

      {isOffline && <div>You are using the app offline.</div>}
    </div>
  )
}
