// Creates a canvas with the image and resizes/lowers the quality
export default async function compressImage(file, options = {}) {
  const { quality, maxWidth, maxHeight, outputType } = options

  if (!quality || !maxWidth || !maxHeight)
    throw Error('compressImage error: Parameters are required!')

  return new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = e => {
      const img = new Image()
      img.src = e.target.result

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // calculate new sizes only if image width/height are larger than the
        // max options
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)

          width = Math.floor(width * ratio)
          height = Math.floor(height * ratio)
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const newFileType = outputType || file.type

        canvas.toBlob(
          blob =>
            resolve(
              new File([blob], file.name, {
                type: newFileType,
                lastModified: Date.now()
              })
            ),
          newFileType,
          quality
        )
      }
    }

    reader.readAsDataURL(file)
  })
}
