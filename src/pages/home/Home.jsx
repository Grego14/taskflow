import { useUser } from '@/App.jsx'
import { useAuth } from '@/firebase/AuthContext'
import LogOutButton from '@components/reusable/buttons/LogOutButton'
import LoginButton from '@components/reusable/buttons/LoginButton'
import SignUpButton from '@components/reusable/buttons/SignUpButton'
import { useRef } from 'react'

export default function Home() {
  const { isOffline, currentUser } = useAuth()
  const { lang } = useUser()

  const homeContent = useRef(null)

  const texts = {
    en: [
      'Tired of notes lost in the sea of forgetfulness? With ',
      ', your ideas stay safe, searchable, and ready for action. Say goodbye to ',
      'I’ll do it later!'
    ],
    es: [
      '¿Notas perdidas en el mar del olvido? Con ',
      ', tus ideas siempre estarán seguras, accesibles y listas para convertirse en acción. Di adiós al ',
      'lo haré después'
    ]
  }

  const loginText = {
    en: 'Don’t let your best ideas slip away. Capture instantly, organize effortlessly, and delete with ease. Your productivity will thank you!',
    es: 'No dejes que tus mejores ideas se pierdan. Anota al instante, organiza sin esfuerzo y borra fácilmente. ¡Tu productividad te lo agradecerá!'
  }

  return currentUser ? (
    <div>
      LogOut: <LogOutButton />
    </div>
  ) : (
    <div className='home'>
      <div className='home__content' ref={homeContent}>
        <div className='content__start'>
          <h1 className='home__title'>TaskFlow your task manager.</h1>
          <p className='home__text'>
            {texts[lang][0]}
            <span className='home__text__taskflow'>TaskFlow</span>
            {texts[lang][1]}
            <span className='home__text__later'>{texts[lang][2]}</span>
          </p>
          <button
            type='button'
            onClick={() =>
              homeContent.current.scrollBy({
                top: document.documentElement.clientHeight * 2,
                behavior: 'smooth'
              })
            }>
            Continue
          </button>
        </div>
        <div className='content__preview'>
          <div>INSERT TASKS PREVIEW</div>
          <button
            type='button'
            onClick={() =>
              homeContent.current.scrollBy({
                top: document.documentElement.clientHeight * 3,
                behavior: 'smooth'
              })
            }>
            Continue
          </button>
        </div>
        <div className='content__login'>
          <p>{loginText[lang]}</p>
          <div className='home__auth-buttons'>
            <LoginButton />
            <span>or</span>
            <SignUpButton />
          </div>
        </div>
      </div>

      {isOffline && <div>You are using the app offline.</div>}
    </div>
  )
}
