import db from '@/db'
import i18n from '@/i18n.js'
import createDueDate from '@utils/createDueDate'
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'

export default async function createUserDoc(user, preferences = []) {
  if (!user || !user.uid || preferences?.length < 1) return

  const batch = writeBatch(db)
  const uid = user.uid
  const lang = i18n.language || 'en'

  const todayDateISOString = new Date(Date.now()).toISOString()

  function createTask(data) {
    return {
      dueDate: null,
      rawDate: null,
      completedDate: null,
      completedBy: null,
      cancelledDate: null,
      cancelledBy: null,
      ...data,
      createdBy: uid,
      assignedTo: [uid],
      isSubtask: false,
      isArchived: false,
      subtask: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      projectId: data.projectId,
      projectOwner: data.projectOwner
    }
  }

  const labels = {
    en: {
      development: 'development',
      learning: 'learning',
      research: 'research',
      planning: 'planning',
      organization: 'organization',
      meeting: 'meeting',
      design: 'design'
    },
    es: {
      development: 'desarrollo',
      learning: 'aprendizaje',
      research: 'investigación',
      planning: 'planificación',
      organization: 'organización',
      meeting: 'reunión',
      design: 'diseño'
    }
  }

  const taskTitles = {
    en: [
      'Learn the new JavaScript framework',
      'Project planification',
      'Setup workspace',
      'Project meeting',
      'Make the app design',
      'Change the login button background color'
    ],
    es: [
      'Aprender el nuevo framework de JavaScript',
      'Planificación del proyecto',
      'Configurar el espacio de trabajo',
      'Reunión del proyecto',
      'Crear el diseño de la aplicación',
      'Cambiar el color de fondo del botón de inicio de sesión'
    ]
  }

  const projectTitle = {
    en: 'Web App Project',
    es: 'Proyecto de Aplicación Web'
  }

  const projectDesc = {
    en: 'Development project for a web application, including planning, design, and implementation',
    es: 'Proyecto de desarrollo para una aplicación web, incluyendo planificación, diseño e implementación'
  }

  const commentText = {
    en: "I'm broke... I can't continue with the project.",
    es: 'Estoy arruinado... No puedo seguir con el proyecto.'
  }

  const tasks = [
    createTask({
      title: taskTitles[lang][0],
      status: 'todo',
      priority: 'medium',
      dueDate: createDueDate(2),
      rawDate: 'twodays',
      labels: [labels[lang].learning, labels[lang].development]
    }),
    createTask({
      title: taskTitles[lang][1],
      status: 'doing',
      priority: 'urgent',
      dueDate: createDueDate(1),
      rawDate: 'tomorrow',
      labels: [labels[lang].research, labels[lang].planning]
    }),
    createTask({
      title: taskTitles[lang][2],
      status: 'done',
      completedDate: todayDateISOString,
      priority: 'medium',
      dueDate: createDueDate(-1),
      labels: [labels[lang].organization]
    }),
    createTask({
      title: taskTitles[lang][3],
      status: 'cancelled',
      cancelledDate: todayDateISOString,
      priority: 'high',
      dueDate: createDueDate(-1),
      labels: [labels[lang].meeting]
    })
  ]

  const subtasks = [
    createTask({
      title: taskTitles[lang][4],
      status: 'done',
      completedDate: todayDateISOString,
      priority: 'high',
      dueDate: createDueDate(0),
      rawDate: 'today',
      labels: [labels[lang].development, labels[lang].design]
    }),
    createTask({
      title: taskTitles[lang][5],
      status: 'todo',
      priority: 'low',
      dueDate: createDueDate(1),
      rawDate: 'tomorrow',
      labels: [labels[lang].development]
    })
  ]

  try {
    // Create user profile
    const userRef = doc(db, 'users', uid)

    batch.set(userRef, {
      profile: {
        username: user.displayName,
        email: user.email,
        avatar: user.photoURL
      },
      preferences: {
        ...preferences,
        previewer: 'list'
      },
      metadata: {
        lastEditedProject: '',
        lastEditedProjectOwner: '',
        lastUsedFilter: 'default',
        lastUsedMetricFilter: 'project',
        lastActive: serverTimestamp()
      }
    })

    const projectCol = collection(db, 'users', uid, 'projects')
    const projectRef = doc(projectCol)
    const projectId = projectRef.id

    batch.set(projectRef, {
      name: projectTitle[lang],
      description: projectDesc[lang],
      createdAt: serverTimestamp(),
      createdBy: uid,
      members: [uid],
      labels: [],
      isTemplate: true,
      isPublicTemplate: false,
      isArchived: false,
      id: projectId
    })

    const tasksCol = collection(
      db,
      'users',
      uid,
      'projects',
      projectId,
      'tasks'
    )

    for (const task of tasks) {
      const taskRef = doc(tasksCol)
      const taskId = taskRef.id

      batch.set(taskRef, {
        ...task,
        projectId: projectId,
        projectOwner: uid,
        id: taskId
      })

      // add a comment to the cancelled task
      if (task.status === 'cancelled') {
        batch.update(taskRef, {
          comment: commentText[lang]
        })
      }

      // add the subtasks to the "Project planification task"
      if (task.status === 'doing') {
        const subtasksCol = collection(
          db,
          'users',
          uid,
          'projects',
          projectId,
          'tasks',
          taskId,
          'subtasks'
        )

        for (const subtask of subtasks) {
          const subtaskRef = doc(subtasksCol)
          const subtaskId = subtaskRef.id

          batch.set(subtaskRef, {
            ...subtask,
            projectId: projectId,
            projectOwner: uid,
            id: subtaskId,
            subtask: taskId,
            isSubtask: true
          })
        }
      }
    }

    await batch.commit()

    return projectId
  } catch (error) {
    console.error(error)
    throw error
  }
}
