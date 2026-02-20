import { TEXT_REGEX } from '@constants/regex'

/**
 * Validates project fields based on value and rules
 * Returns { hasError: boolean, errorMsg: string }
 */
export default function validateProjectField(value, { t, isRequired = false, type }) {
  const trimmedValue = value?.trim()

  if (isRequired && !trimmedValue) {
    return {
      hasError: true,
      errorMsg: t(`inputs.errors.${type}IsEmpty`)
    }
  }

  if (trimmedValue && !TEXT_REGEX.test(trimmedValue)) {
    return {
      hasError: true,
      errorMsg: t(`inputs.errors.${type}IsInvalid`)
    }
  }

  return { hasError: false, errorMsg: '' }
}
