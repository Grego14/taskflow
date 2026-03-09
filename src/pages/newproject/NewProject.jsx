import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import DescriptionInput from '@components/reusable/projects/DescriptionInput'
import NameInput from '@components/reusable/projects/NameInput'
import AddMembers from '@components/ui/projects/AddMembers'
import CreateProject from './components/CreateProject'
import MakeTemplate from './components/MakeTemplate'
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import CreateFromTemplate from '@components/reusable/projects/CreateFromTemplate'
import AnimatedTitle from '@components/reusable/texts/AnimatedTitle'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useLoadResources from '@hooks/useLoadResources'
import { useGSAP } from '@gsap/react'
import { useRef } from 'preact/hooks'

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

// used on the animations
const hidden = { opacity: 0, visibility: 'hidden' }

const alignment = { xs: 'center', tablet: 'start' }

// used on the enter animation box and the container box
const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: alignment,
  flexGrow: 1
}

export default function NewProject() {
  const { t } = useTranslation(['projects', 'common'])
  const loadingResources = useLoadResources('projects')
  const containerRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    isTemplate: false,
    publicTemplate: false,
    members: []
  })

  const [errors, setErrors] = useState(null)
  const [animateForm, setAnimateForm] = useState(false)

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  useGSAP(() => {
    if (loadingResources || !animateForm) return

    gsap.set('#newProjectForm', { x: -300 })
    gsap.set('#newProjectCreate', { y: 75 })

    const tl = gsap.timeline()

    tl.fromTo('#newProjectForm',
      { rotateX: -35 },
      { autoAlpha: 1, x: 0, ease: 'power4.out', rotateX: 0 })
      .to('#newProjectCreate', { autoAlpha: 1, y: 0 })
  }, { scope: containerRef, dependencies: [loadingResources, animateForm] })

  if (loadingResources)
    return <CircleLoader text={t('common:loading')} />

  return (
    <Box
      sx={containerStyles}
      py={5}
      px={{ xs: 1.5, mobile: 4 }}
      gap={5}
      justifyContent={{ xs: 'center', laptop: 'start' }}
      ref={containerRef}>
      <Box sx={containerStyles} gap={3} justifyContent='start'>
        <AnimatedTitle
          id='new-project-title'
          onComplete={() => setAnimateForm(true)}>
          {t('projects:createProject')}
        </AnimatedTitle>

        <Paper
          className='flex flex-column'
          variant='outlined'
          sx={t => ({
            px: { xs: 1, mobile: 3 },
            py: { xs: 2, mobile: 4 },
            gap: { xs: 2, tablet: 3 },
            ...hidden,
            width: '100%',
            backgroundColor: 'transparent',
            backgroundImage: `linear-gradient(135deg, 
              ${t.alpha(t.palette.primary.main, 0.1)}, 
              ${t.alpha(t.palette.secondary.main, 0.2)})`,
            perspective: '1000px',
            transformOrigin: '25% 100%',
            maxWidth: 'fit-content'
          })}
          id='newProjectForm'>
          <Box className='flex flex-grow flex-column' gap='inherit'>
            <NameInput
              isOwner
              name={form.name}
              setName={val => updateField('name', val)}
              setErrors={setErrors}
            />

            <DescriptionInput
              isOwner
              description={form.description}
              setDescription={val => updateField('description', val)}
              setErrors={setErrors}
            />
          </Box>

          <Box className='flex flex-column' gap='inherit'>
            <MakeTemplate
              template={form.isTemplate}
              setTemplate={val => updateField('isTemplate', val)}
              publicTemplate={form.publicTemplate}
              setPublicTemplate={val => updateField('publicTemplate', val)}
            />

            <Divider sx={{ borderBottomWidth: '2px' }} />

            <AddMembers
              members={form.members}
              setMembers={val => updateField('members', val)}
              isOwner
            />
          </Box>
        </Paper>

        <Box className='flex flex-column'
          flexDirection={{ xs: 'column', tablet: 'row' }}
          justifyContent={{ xs: 'start', mobile: 'space-between', tablet: 'start' }}
          alignItems='center'
          minWidth='100%'
          id='newProjectCreate'
          {...hidden}
          gap={2}>
          <CreateProject {...form} errors={errors} sx={{ m: 0 }} />
          <CreateFromTemplate sx={{ flexDirection: 'inherit' }} />
        </Box>
      </Box>
    </Box>
  )
}
