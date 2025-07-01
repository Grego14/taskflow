const translations = {
  en: {
    auth: {
      labels: {
        username: 'Username:',
        email: 'Email:',
        password: 'Password:'
      },

      errors: {
        emptyFields: 'All fields are required',
        emptyEmail: 'Email is required',
        emptyUsername: 'Username is required',
        emptyPassword: 'Password is required',
        emailStructure: 'Email must follow this format:: username@domain.tld',
        shortEmail: 'Email username (before @) must be at least 6 characters',
        atSigns: 'Email can only have one @',
        shortTLD: 'Domain extension must be at least 2 characters long',
        shortPassword: 'Password must be at least 8 characters long',
        shortUsername: 'Username must be at least 2 characters long',
        usernameInvalidChars: 'Disallowed characters:',
        invalidUsername: 'Invalid username. Try using a different one',
        usernameStartsOrEnds:
          "Username can't start or end with a dot or hyphen",
        usernameMultipleChars:
          'Username cannot contain consecutive dots or hyphens'
      },

      separatorText: 'or',

      githubButton: 'Continue with GitHub',
      googleButton: 'Continue with Google',

      signup: {
        title: ['Join us', 'Create a TaskFlow account'],
        text: 'Start organizing your ideas!',
        authButton: 'Create account',
        accountText: 'Already have an account?'
      },

      login: {
        title: ['Welcome back!', 'Login to your account'],
        text: ['Continue organizing your ideas', 'again!'],
        remember: 'Remember me',
        recoverPassword: 'Forgot password?',
        authButton: 'Log In',
        accountText: "Don't have an account?"
      }
    },
    common: {
      login: 'Log In',
      signup: 'Sign up'
    }
  },
  es: {
    auth: {
      labels: {
        username: 'Nombre de usuario:',
        email: 'Correo electrónico:',
        password: 'Contraseña:'
      },

      errors: {
        emptyFields: 'Los campos no pueden estar vacios',
        emptyEmail: 'Se requiere un correo eléctronico',
        emptyUsername: 'Se requiere un nombre de usuario',
        emptyPassword: 'Se requiere una contraseña',
        emailStructure:
          'El correo electrónico debe tener el formato: usuario@dominio.tld',
        shortEmail: 'El correo eléctronico debe ser de al menos 6 caracteres',
        atSigns: 'El correo eléctronico debe contener solo un signo arroba',
        shortTLD:
          'La extensión del dominio debe contener al menos 2 caracteres',
        shortPassword: 'La contraseña debe contener al menos 8 caracteres',
        shortUsername: 'El usuario debe contener al menos 2 caracteres',
        usernameInvalidChars: 'El usuario contiene caracteres no permitidos:',
        invalidUsername: 'Usuario inválido. Intente usando uno diferente',
        usernameStartsOrEnds:
          'El usuario no puede empezar ni terminar con un punto o guion',
        usernameMultipleChars:
          'El usuario no puede tener puntos o guiones consecutivos'
      },

      separatorText: 'o',

      githubButton: 'Continuar con GitHub',
      googleButton: 'Continuar con Google',

      signup: {
        title: ['Unetenos', 'Crea una cuenta en TaskFlow'],
        text: 'Comienza a organizar tus ideas',
        authButton: 'Crear cuenta',
        accountText: '¿Ya tienes cuenta?'
      },

      login: {
        title: ['Bienvenido de vuelta', 'Inicia sesión a tu cuenta'],
        text: ['Continua organizando tus ideas', 'de nuevo!'],
        remember: 'Guardar sesión',
        recoverPassword: 'Olvide mi contraseña',
        authButton: 'Iniciar sesión',
        accountText: '¿No tienes cuenta?'
      }
    },
    common: {
      login: 'Iniciar sesión',
      signup: 'Crear cuenta'
    }
  }
}

export default translations
