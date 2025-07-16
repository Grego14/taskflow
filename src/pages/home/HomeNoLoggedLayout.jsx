import { useAppState } from '@/context/AppContex'
import LoginButton from '@components/reusable/buttons/LoginButton'
import SignUpButton from '@components/reusable/buttons/SignUpButton'
import useTranslations from '@hooks/useTranslations'
import Button from '@mui/material/Button'
import { useRef } from 'react'

export default function HomeNoLoggedLayout() {
  const { user } = useAppState()
  const homeContent = useRef(null)

  const t = useTranslations()
  const homeTexts = t.home

  return (
    <div className='home'>
      <div className='home__content' ref={homeContent}>
        <div className='content__start'>
          <h1 className='home__title'>TaskFlow your task manager.</h1>
          <p className='home__text'>
            {homeTexts.title[0]}
            <span className='home__text__taskflow'>TaskFlow</span>
            {homeTexts.title[1]}
            <span className='home__text__later'>{homeTexts.title[2]}</span>
          </p>
          <Button
            type='button'
            onClick={() =>
              homeContent.current.scrollBy({
                top: document.documentElement.clientHeight * 2,
                behavior: 'smooth'
              })
            }>
            Continue
          </Button>
        </div>
        <div className='content__preview'>
          <div>INSERT TASKS PREVIEW</div>
          <Button
            type='button'
            onClick={() =>
              homeContent.current.scrollBy({
                top: document.documentElement.clientHeight * 3,
                behavior: 'smooth'
              })
            }>
            Continue
          </Button>
        </div>
        <div className='content__login'>
          <p>{homeTexts.login}</p>
          <div className='home__auth-buttons'>
            <LoginButton />
            <span>or</span>
            <SignUpButton />
          </div>
        </div>
      </div>
    </div>
  )
}
