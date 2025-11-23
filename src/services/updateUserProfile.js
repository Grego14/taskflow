import lazyImport from '@utils/lazyImport'

export default async function updateUserProfile({ currentUser, data }) {
  if (!currentUser?.uid) throw Error('updateUserProfile: Invalid user id')

  // update user firebase document
  const updateUser = await lazyImport('/src/services/updateUser')
  const dbStatus = await updateUser(currentUser?.uid, data)
  if (dbStatus?.error) {
    return { success: false, message: dbStatus.message }
  }

  // update firebase auth user
  const updateProfile = await import('firebase/auth').then(
    mod => mod.updateProfile
  )
  await updateProfile(currentUser, { displayName: data.username })

  return { success: true, message: 'profileUpdated' }
}
