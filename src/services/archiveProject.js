import db from '@/db'
import i18n from '@/i18n'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError'
import { doc, updateDoc } from 'firebase/firestore'

export default async function archiveProject({ user, project }) {
  if (
    !user ||
    typeof user !== 'string' ||
    !project ||
    typeof project !== 'string'
  )
    throw Error('archiveProject: Invalid params')

  try {
    const projectRef = doc(db, 'users', user, 'projects', project)
    await updateDoc(projectRef, {
      isArchived: true,
      archivedDate: new Date(Date.now()).toISOString()
    })
  } catch (err) {
    console.error(err)
    throw getFriendlyAuthError(err.message, i18n.language)
  }
}
