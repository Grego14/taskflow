import getFriendlyAuthError, {
  getFriendlyErrorFormatted
} from '@utils/getFriendlyAuthError.js'
import { getItem } from '@utils/storage.js'
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  documentId
} from 'firebase/firestore'
import { db } from './firebase/firebase-config'

function projectsAdapter(projects) {
  const projectsAdapted = {}

  for (const project of projects) {
    projectsAdapted[project.id] = project
  }

  return projectsAdapted
}

export async function getUserDocument(user) {
  if (!user) return

  const userDocRef = doc(db, 'users', user)

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      userDocRef,
      docSnap => {
        const exists = docSnap.exists()
        const data = docSnap.data()

        if (exists) {
          resolve({ data, unsubscribe })
        } else {
          reject(new Error("User document doesn't exists"))
        }
      },
      error => {
        reject(getFriendlyErrorFormatted('getUserDocument', error.message))
      }
    )
  })
}

export async function getUserProjects(user) {
  if (!user) return

  const projectsRef = collection(db, 'users', user, 'projects')

  try {
    const q = query(projectsRef)
    const projectsSnap = await getDocs(q)
    const exists = !projectsSnap.empty

    if (!exists)
      throw new Error("Subcollection 'projects' doesn't exist or is empty!")

    return projectsAdapter(projectsSnap.docs.map(doc => doc.data()))
  } catch (error) {
    throw getFriendlyErrorFormatted('getUserProjects', error.message)
  }
}

export async function getProjectMembersData({ user, project, members }) {
  if (!user || !project || Object.keys(members).length < 1) return

  try {
    const usersRef = collection(db, 'users')

    const q = query(usersRef, where(documentId(), 'in', members))
    const membersSnapshot = await getDocs(q)

    const exists = !membersSnapshot.empty

    if (!exists) {
      throw new Error("Couldn't find project members. Query is empty")
    }

    const membersProfiles = membersSnapshot.docs.map(snap => ({
      id: snap.id,
      ...snap.data().profile
    }))

    return membersProfiles
  } catch (error) {
    throw getFriendlyErrorFormatted('getUserDocument', error.message)
  }
}
