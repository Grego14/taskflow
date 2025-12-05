import convertToBase64 from '@utils/convertToBase64.js'
import imageCompressor from '@utils/imageCompressor.js'

// compress and returns a base64 string of the avatar
/**
 * @param avatar File object to compress
 * @returns [Compressed file, Compressed avatar]
 */
async function getCompressedFiles(avatar) {
  try {
    const compressedFile = await imageCompressor(avatar, {
      quality: 0.9,
      maxWidth: 300,
      maxHeight: 300,
      outputType: 'image/webp'
    })

    const base64String = await convertToBase64(compressedFile)
    const convertedAvatar = `data:${compressedFile.type};base64,${base64String}`

    return [compressedFile, convertedAvatar]
  } catch (e) {
    return { error: true, message: 'convert-error' }
  }
}

/**
 * @param file File object to validate
 * @returns Compressed avatar
 * @throws if the file is too big or is not one of the allowed file types (jpeg,
 * png or webp)
 */
export default async function validateAvatarFile(file) {
  if (!file) return

  const MAX_FILE_SIZE_KB = 250
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  if (!ALLOWED_FILE_TYPES.includes(file.type))
    return { error: true, message: 'invalid' }

  const [compressedFile, compressedAvatar] = await getCompressedFiles(file)

  if (compressedFile.size > MAX_FILE_SIZE_KB * 1024)
    return { error: true, message: 'too-big' }

  return compressedAvatar
}
