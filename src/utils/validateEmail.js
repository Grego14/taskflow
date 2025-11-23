export default function validateEmail(
  email,
  // if username is true it means the email username (string before the @...) is
  // not going to be validated
  noValidate = {
    username: false
  }
) {
  // splittedEmail[0] = email username
  // splittedEmail[1] = email domain
  // splittedEmail[2] = email TLD
  const splittedEmail = email.split(/[@.]/)
  const atSigns = Array.from(email.matchAll(/@/g))

  const errorKey = (() => {
    // verify username is at least 6 chars
    if (splittedEmail[0].length < 6 && !noValidate.username) return 'shortEmail'

    if (!atSigns.length || splittedEmail.length < 3) return 'emailStructure'

    if (atSigns.length > 1) return 'atSigns'

    if (splittedEmail[2].length < 2) return 'shortTLD'

    return ''
  })()

  return { error: !!errorKey, key: errorKey }
}
