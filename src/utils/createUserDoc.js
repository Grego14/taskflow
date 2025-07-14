import {
  doc,
  collection,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/firebase/firebase-config.js'
import createDueDate from '@utils/createDueDate'

export default async function createUserDoc(user, preferences) {
  const batch = writeBatch(db)

  function createTask(data) {
    return {
      ...data,
      createdBy: user.uid,
      assignedTo: [user.uid]
    }
  }

  const tasks = [
    createTask({
      title: 'Morning routine',
      status: 'todo',
      priority: 'high',
      dueDate: createDueDate(1),
      labels: ['health', 'routine']
    }),
    createTask({
      title: 'Learn new skill',
      status: 'todo',
      priority: 'medium',
      dueDate: createDueDate(3),
      labels: ['learning', 'development']
    }),
    createTask({
      title: 'Project research',
      status: 'doing',
      priority: 'urgent',
      dueDate: createDueDate(1),
      labels: ['research', 'planning']
    }),
    createTask({
      title: 'Setup workspace',
      status: 'done',
      priority: 'medium',
      dueDate: createDueDate(-1),
      labels: ['organization']
    }),
    createTask({
      title: 'Project meeting',
      status: 'cancelled',
      priority: 'high',
      dueDate: createDueDate(-1),
      labels: ['organization']
    })
  ]

  try {
    // Create user profile
    const userRef = doc(db, 'users', user.uid)

    batch.set(userRef, {
      profile: {
        username: user.displayName,
        email: user.email,
        avatar: user.photoURL
      },
      preferences,
      metadata: {
        createdAt: serverTimestamp(),
        lastSession: serverTimestamp()
      }
    })

    const projectCol = collection(db, 'users', user.uid, 'projects')
    const projectRef = doc(projectCol)

    batch.set(projectRef, {
      name: 'Personal Productivity System',
      description:
        'My complete productivity workflow with daily tasks, goals and progress tracking',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: user.uid,
      members: [user.uid],
      isTemplate: true,
      id: projectRef.id
    })

    const tasksCol = collection(
      db,
      'users',
      user.uid,
      'projects',
      projectRef.id,
      'tasks'
    )

    for (const task of tasks) {
      const taskRef = doc(tasksCol)

      batch.set(taskRef, {
        ...task,
        projectId: projectRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      if (task.status === 'cancelled') {
        const commentRef = doc(
          collection(
            db,
            'users',
            user.uid,
            'projects',
            projectRef.id,
            'tasks',
            taskRef.id,
            'comments'
          )
        )

        // Simple comment for testing
        batch.set(commentRef, {
          text: "I'm broke... I can't continue with the project.",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: user.uid,
          attachments: null
        })
      }
    }

    // Add the project template id as if it were the last edited project
    batch.update(userRef, { 'metadata.lastEditedProject': projectRef.id })

    await batch.commit()

    return projectRef.id
  } catch (error) {
    console.error(error)
    throw error
  }
}
