import { db } from '@/firebase/firebase-config'
import i18n from '@/i18n'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError.js'
import {
  collection,
  documentId,
  getDocs,
  query,
  where
} from 'firebase/firestore'

export default async function getProjectMembers({ queryKey }) {
  const [_, { members = [] }] = queryKey

  if (members.length < 1) return null

  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where(documentId(), 'in', members))
    const membersSnapshot = await getDocs(q)

    const exists = !membersSnapshot.empty

    if (!exists) return null

    return membersSnapshot.docs.map(snap => {
      const data = snap.data()

      return {
        id: snap.id,
        ...data.profile,
        lastActive: data.metadata.lastActive
      }
    })
  } catch (error) {
    console.error(error)
    throw getFriendlyAuthError(error.message, i18n.language)
  }
}
