// returns a key from the translation object
export default function validateUsername(username) {
  const usernameRegex = /^[\p{L}\s\.'0-9-]+$/iu
  const usernameInvalidCharsRegex =
    /[<>\*\(\)\[\]\{\};:,\?_\+\\=¿¡!@#$%&\|~`"^]/g

  // empty and short/long validations are made using react-hook-form

  if (usernameInvalidCharsRegex.test(username)) {
    const chars = username.match(usernameInvalidCharsRegex)

    // show the invalid characters inside the message
    return {
      key: 'usernameInvalidChars',
      chars: Array.from(new Set(chars)).join(', '),
      invalid: true
    }
  }

  // verify if the username starts or ends with . or -
  if (/^[.-]|[.-]$/.test(username))
    return { key: 'usernameStartsOrEnds', invalid: true }

  // verify if the username has multiple . or -
  if (/[.-]{2,}/.test(username))
    return { key: 'usernameMultipleChars', invalid: true }

  if (!usernameRegex.test(username))
    return { key: 'invalidUsername', invalid: true }

  if (username.length > 20) return { key: 'too-big', invalid: true }

  return { invalid: false }
}
