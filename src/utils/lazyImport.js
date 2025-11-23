const modulesMap = import.meta.glob('/src/(utils|pages|services)/**/*.js')

export default async function lazyImport(absolutePath) {
  const loader = modulesMap[`${absolutePath}.js`]

  if (!loader) throw Error('lazyImport: Module not found')

  let data = null

  try {
    const lazyModule = await loader()
    data = lazyModule.default
  } catch (err) {
    console.error(`Error while loading module ${absolutePath}:`, err)
    throw err
  }

  return data
}
