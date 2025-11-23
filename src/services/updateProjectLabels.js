import { db } from '@/firebase/firebase-config'
import i18n from '@/i18n'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'

export default async function updateProjectLabels({
  project,
  user,
  labels,
  currentLabels
}) {
  if (!project || !user) return

  const newLabels = []

  for (const label of labels) {
    if (currentLabels.includes(label)) continue

    newLabels.push(label)
  }

  if (newLabels.length < 1) return

  try {
    const projectRef = doc(db, 'users', user, 'projects', project)

    await updateDoc(projectRef, { labels: arrayUnion(...newLabels) })
  } catch (err) {
    console.error(err)
    throw getFriendlyErrorFormatted(
      'updateProjectLabels',
      err.message,
      i18n.language
    )
  }
}
