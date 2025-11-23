export default function substringLongText(str, len = 15) {
  if (!str) return ''

  return str.length > len ? `${str.substring(0, len)}...` : str
}
