export function setItem(item, value) {
  try {
    // check against undefined to allow falsy values
    if (!value === undefined)
      throw Error("Storage setItem error: value can't be undefined")

    localStorage.setItem(item, JSON.stringify(value))
  } catch (err) {
    console.error(err)
  }
}

export function getItem(item, defaultValue) {
  try {
    const itemValue = localStorage.getItem(item)

    if (itemValue && itemValue !== 'undefined') return JSON.parse(itemValue)

    // set the item if it doesn't exists
    setItem(item, defaultValue)
    return defaultValue
  } catch (err) {
    console.error(err)
  }
}
