import { RESOURCES } from '@/constants'
import i18n from '../i18n.js'

const resourcesMap = import.meta.glob('/src/locales/(en|es)/**.json')

export async function loadResources(lng, resources = ['common']) {
  try {
    if (!resources) return

    const multipleResources = Array.isArray(resources)
    const resourceList = multipleResources ? resources : [resources]

    for (const resource of Object.values(resourceList)) {
      if (!RESOURCES.includes(resource)) {
        console.warn('Trying to load invalid resource: "%s"', resource)
        return
      }
    }

    const resourcesConverted = resourceList.map(resource => ({
      module: resourcesMap[`/src/locales/${lng}/${resource}.json`],
      key: resource
    }))

    const loadedResources = await Promise.allSettled(
      resourcesConverted.map(resource =>
        resource
          .module()
          .catch(err =>
            console.error(
              'Error loading resource %s ->',
              `${resource.key}, (${resource.module})`,
              err
            )
          )
      )
    )
      .catch(err => console.error("Couldn't get all the resources:", resourceList))

    // add the resources
    for (const [index, result] of Object.entries(loadedResources)) {
      if (result.value) {
        console.log(lng, resourcesConverted[index].key, result.value)
        i18n.addResourceBundle(lng, resourcesConverted[index].key, result.value)
      }
    }
  } catch (err) {
    console.error('Error when fetching and adding the resources:', err)
  }
}

export function resourceExists(lang, resources) {
  const _resources = Array.isArray(resources) ? resources : [resources]
  const loadedResources = i18n.getDataByLanguage(lang)
  let exists = true

  for (const resource of _resources) {
    if (!loadedResources?.[resource]) {
      exists = false
      break
    }
  }

  return exists
}
