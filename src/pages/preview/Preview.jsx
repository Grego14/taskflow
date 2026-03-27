import { useState, Suspense, lazy, useEffect } from 'preact/compat'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import AnimatedTitle from '@components/reusable/texts/AnimatedTitle'

const MockProvider = lazy(() => import('@context/MockContext'))
const DemoWrapper = lazy(() => import('./DemoDashboard'))

import { useTranslation } from 'react-i18next'
import useLoadResources from '@hooks/useLoadResources'
import { useGSAP } from '@gsap/react'

import { getItem, setItem } from '@utils/storage'
import gsap from 'gsap'
import { username, userId } from '@context/MockContext/utils'
import useAuth from '@hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const bulletPoints = [
  'localStorageInfo',
  'noSessionRequired',
  'limitedFeatures',
  'privateData'
]

export default function Preview() {
  const { t } = useTranslation(['common', 'preview'])
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const previewData = getItem('preview', { playInitialAnim: true })

  const [showIntro, setShowIntro] = useState(
    previewData.playInitialAnim === true)
  const [titleDone, setTitleDone] = useState(!showIntro)

  const loadingResources = useLoadResources([
    'preview',
    'tasks',
    'projects',
    'ui'
  ])

  // do not allow users with account enter this page
  useEffect(() => {
    if (currentUser?.uid) navigate('/home')
  }, [currentUser?.uid])

  useGSAP(() => {
    if (!titleDone || !showIntro) return

    const tl = gsap.timeline()

    gsap.set('.preview-bullet', { x: -20, y: 20 })
    gsap.set('#start-demo-btn', { y: 10 })

    tl.to('.preview-bullet', {
      opacity: 1,
      x: 0,
      y: 0,
      stagger: 0.15,
      ease: 'power2.out'
    })
      .to('#start-demo-btn', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      }, '-=0.2')
  }, { dependencies: [titleDone] })

  if (loadingResources)
    return <CircleLoader text={t('common:loading')} />

  if (!showIntro) return (
    <Suspense fallback={null}>
      <MockProvider>
        <DemoWrapper />
      </MockProvider>
    </Suspense>
  )

  const handleStart = () => {
    setItem('preview', {
      playInitialAnim: false,
      tasks: [],
      projects: [{
        id: 'demo-project-id',
        name: 'My Project (Demo)',
        members: [{
          id: userId,
          username: username,
          avatar: '',
          email: null
        }],
        isArchived: false,
        createdBy: userId
      }]
    })

    setShowIntro(false)
  }

  return (
    <Box
      component='main'
      className='flex flex-column flex-center'
      sx={{ px: 3, gap: 3 }}
      height='100dvh'>

      {showIntro && (
        <AnimatedTitle
          id='preview-title'
          onComplete={() => setTitleDone(true)}
          className='text-center'>
          {t('preview:welcome')}
        </AnimatedTitle>
      )}

      <Box className='flex flex-column flex-center text-center'
        sx={{ gap: 2, minHeight: '160px', mx: 'auto' }}>
        {bulletPoints.map(point => (
          <Typography
            className='flex preview-bullet'
            key={point}
            variant='body1'
            color='textSecondary'
            sx={{
              opacity: 0,
              fontWeight: 500,
              gap: 1
            }}>
            <Box
              component='span'
              sx={{ color: 'primary.main', fontSize: '1.2rem' }}>
              •
            </Box>
            <Box component='span' maxWidth='40ch'>
              {t(`preview:points.${point}`)}
            </Box>
          </Typography>
        ))}
      </Box>

      <Button
        id='start-demo-btn'
        variant='contained'
        size='large'
        onClick={handleStart}
        sx={{ mt: 2, borderRadius: 2, py: 1.5, px: 4, opacity: 0 }}>
        {t('preview:startAction')}
      </Button>
    </Box>
  )
}
