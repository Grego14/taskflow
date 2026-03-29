/**
 * @param {string} ids 
 * @param {import("preact/hooks").MutableRef} refs 
 * @returns {DOMElement[]} - The card(s) container(s)
*/
export default function getContainers(refs, ids) {
  const idArray = Array.isArray(ids) ? ids : [ids]

  return idArray
    .map(id => refs.current[id]?.parentElement)
    .filter(Boolean)
}

