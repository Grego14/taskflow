import db from '@/db'
import { doc, setDoc } from 'firebase/firestore'

export default async function createUserDoc(user, preferences = []) {
  if (!user || !user.uid || preferences?.length < 1) return

  const uid = user.uid

  const projectTitle = {
    en: 'Web App Project',
    es: 'Proyecto de Aplicación Web'
  }

  const projectDesc = {
    en: 'Development project for a web application, including planning, design, and implementation',
    es: 'Proyecto de desarrollo para una aplicación web, incluyendo planificación, diseño e implementación'
  }

  try {
    // Create user profile
    const userRef = doc(db, 'users', uid)

    await setDoc(userRef, {
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
        lastUsedMetricFilter: 'project'
      }
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}
