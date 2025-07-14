export default function getFriendlyAuthError(errorCode, language = 'en') {
  const errorMap = {
    en: {
      'auth/invalid-email': 'The email address is invalid',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'This email is already registered',
      'auth/operation-not-allowed': 'This operation is not allowed',
      'auth/weak-password': 'Password is too weak (minimum 6 characters)',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/account-exists-with-different-credential':
        'An account already exists with this email. Try using another provider',
      'auth/credential-already-in-use': 'These credentials are already in use',
      'auth/invalid-credential': 'Invalid credentials',
      'auth/invalid-verification-code': 'Invalid verification code',
      'auth/invalid-verification-id': 'Invalid verification ID',
      'auth/missing-verification-code': 'Missing verification code',
      'auth/missing-verification-id': 'Missing verification ID',
      'auth/network-request-failed':
        'Network error. Please check your connection',
      'auth/requires-recent-login':
        'This operation requires recent authentication. Please log in again',
      'auth/provider-already-linked':
        'This provider is already linked to your account',
      'auth/no-such-provider': 'No such authentication provider',
      default: 'An error occurred. Please try again'
    },
    es: {
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No existe una cuenta con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/operation-not-allowed': 'Esta operación no está permitida',
      'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres)',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/account-exists-with-different-credential':
        'Ya existe una cuenta con este email. Intenta usar otro provedor',
      'auth/credential-already-in-use': 'Estas credenciales ya están en uso',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/invalid-verification-code': 'Código de verificación inválido',
      'auth/invalid-verification-id': 'ID de verificación inválido',
      'auth/missing-verification-code': 'Falta el código de verificación',
      'auth/missing-verification-id': 'Falta el ID de verificación',
      'auth/network-request-failed': 'Error de red. Verifica tu conexión',
      'auth/requires-recent-login':
        'Esta operación requiere autenticación reciente. Inicia sesión nuevamente',
      'auth/provider-already-linked':
        'Este proveedor ya está vinculado a tu cuenta',
      'auth/no-such-provider': 'No existe este proveedor de autenticación',
      default: 'Ocurrió un error. Por favor intenta nuevamente'
    }
  }

  const lang = errorMap[language] ? language : 'en'

  // Remove the text "Firebase: Error"
  const normalizedErrorCode = errorCode.match(/\(.+\)/)?.[0]

  for (const [key, value] of Object.entries(errorMap[lang])) {
    if (normalizedErrorCode && key.match(normalizedErrorCode)) {
      return { code: key, message: value }
    }
  }

  return { code: 'default', message: errorMap[lang].default }
}
