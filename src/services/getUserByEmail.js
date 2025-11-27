import db from '@/db'
import i18n from '@/i18n'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'

export default async function getUserByEmail(email) {
  if (!email) return []

  try {
    const usersCol = collection(db, 'users')
    const q = query(usersCol, where('profile.email', '==', email))
    const usersSnapshot = await getDocs(q)

    if (!usersSnapshot.empty) {
      return usersSnapshot.docs.map(doc => ({
        ...doc.data()?.profile,
        id: doc.id
      }))?.[0]
    }

    return null
  } catch (err) {
    console.error(err)
    throw getFriendlyAuthError('searchUsers', err.message, i18n.language)
  }
}
