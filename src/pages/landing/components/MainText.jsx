import { useEffect, useState } from 'preact/compat'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Section from './Section'
import Box from '@mui/material/Box'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useUser from '@hooks/useUser'

import { SplitText } from 'gsap/SplitText'
import { APPBAR_HEIGHT } from '@/constants'

const images = {
  task: 'list_task_preview',
  metric: 'metric',
  notification: 'notification',
  project: 'project_card'
}

export default function MainText({
  setAnimationEnded,
  prefetchAuth,
  animationEnded
}) {
  const { t, i18n } = useTranslation('landing')
  const { preferences } = useUser()
  const lang = preferences?.lang
  const theme = preferences?.theme
  const navigate = useNavigate()

  const resourceExists = i18n.getResourceBundle(lang, 'landing')

  useGSAP(() => {
    if (!resourceExists) return

    const bigSplit = new SplitText('#bigText', { type: 'words' })
    const shortSplit = new SplitText('#shortText', {
      type: 'chars',
      smartWrap: true
    })

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        gsap.fromTo('#startBtn', 
          { '--shine-left': '-100%'},
          {
            '--shine-left': '200%',
            duration: 2.5,
            repeat: -1,
            ease: 'sine.inOut',
            repeatDelay: 1
          })
      }
    })

    gsap.set(['#bigText', '#shortText'], { opacity: 1 })
    gsap.set(['#startBtn', '#previewBtn'], { y: 40, scale: 0.9 })

    tl.from(bigSplit.words, {
      y: 50,
      autoAlpha: 0,
      stagger: 0.8 / bigSplit.words.length,
      ease: 'back.out(2.5)',
      rotateZ: -45,
      transformOrigin: '0 50% -50',
    })
      .from(shortSplit.chars, {
        opacity: 0,
        y: 15,
        rotateX: -80,
        stagger: 0.85 / shortSplit.chars.length
      }, '-=0.4')
      .to(['#startBtn', '#previewBtn'], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        stagger: 0.3,
        onComplete: setAnimationEnded
      }, '-=0.5')

    return () => {
      bigSplit.revert()
      shortSplit.revert()
    }
  }, { dependencies: [lang, resourceExists], revertOnUpdate: true })

  const getPaddingTop = (ammount) => `calc(${APPBAR_HEIGHT.other} * ${ammount})`

  return (
    <Section className='landing-section-main relative flex' id='main-text'>
      <div className='landing-bg-overlay absolute' />

    <div className='hero-main flex flex-column'>
      <div className='relative'>
        <Typography
          key={`big-${lang}`}
          id='bigText'
          variant='h1'
          className='main-title text-balance'
          aria-hidden='true'>
          {t('title0')}
        </Typography>

        <span className='sr-only'>
          {t('title0')}
        </span>
      </div>

      <div className='relative'>
        <Typography
          key={`short-${lang}`}
          variant='body1'
          id='shortText'
          className='main-subtitle'
          aria-hidden='true'>
          {t('title1')}
        </Typography>

        <span className='sr-only'>
          {t('title1')}
        </span>
      </div>

      <div className='flex hero-actions-container'>
        <Button
          variant='contained'
          className='btn-hero btn-hero--primary hide-element relative'
          onMouseEnter={prefetchAuth}
          id='startBtn'
          onClick={() => navigate('signup')}>
          {t('startForFree')}
        </Button>

        <Button
          variant='outlined'
          className='btn-hero btn-hero--secondary hide-element'
          id='previewBtn'
          onClick={() => navigate('preview')}>
          {t('livePreview')}
        </Button>
      </div>
    </div>

    <div className='hero-visual-container flex flex-center relative'>
      {Object.values(images).map(image => (
        <img 
          className={`hero-visual-image ${image} absolute`}
          src={`/images/landing/${image}_${theme}.png`} 
          alt={`${image.replace('_', ' ')} preview`}
        />
      ))}
    </div>
    </Section>
  )
}
