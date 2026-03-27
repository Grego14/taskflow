export default function getTaskRef(refs, id) {
  if (!refs?.current || !id) return

  const target = refs.current?.[id]
  return target
}
