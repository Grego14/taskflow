import i18n from '@/i18n'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'
import db from '@/db'

export default async function dbManipulationWrapper(
  service,
  manipulator,
  onError
) {
  try {
    await manipulator(db)
  } catch (err) {
    console.error(err)
    onError?.(err.message)
    throw getFriendlyErrorFormatted(service, err.message, i18n.language)
  }
}
