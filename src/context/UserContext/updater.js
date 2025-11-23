import lazyImport from '@utils/lazyImport'

export default async function updater(user, value) {
  if (value === undefined || !user)
    throw Error('updater: User or value is undefined')

  const updateUser = await lazyImport('/src/services/updateUser')

  // value must follow updateUser service data handling... example: instead of
  // { preferences: {lang: 'es'} } we simply pass {lang: 'es'}
  const updateStatus = await updateUser(user, value)
  return updateStatus
}
