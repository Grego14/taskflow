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

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useLoadResources from '@hooks/useLoadResources'
import { useGSAP } from '@gsap/react'
import { useRef } from 'preact/hooks'

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

const hidden = { opacity: 0, visibility: 'hidden' }

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

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  useGSAP(() => {
    if (loadingResources) return

    const title = SplitText.create('#newProjectTitle', {
      type: 'chars',
      smartWrap: true
    })

    gsap.set('#newProjectTitle', { autoAlpha: 1 })
    gsap.set('#newProjectForm', { x: -300 })
    gsap.set('#newProjectCreate', { y: 75 })

    const tl = gsap.timeline({
      defaults: {
        ease: 'back.out(2)',
        duration: 1
      }
    })

    tl.from(title.chars, {
      opacity: 0,
      x: -25,
      y: -40,
      rotateZ: -90,
      stagger: 0.3 / title.chars.length,
      duration: 1.5,
    }).to('#newProjectForm', { autoAlpha: 1, x: 0, ease: 'expo.out' }, '<0.5')
      .to(
        '#newProjectCreate',
        { autoAlpha: 1, y: 0 },
        '-=0.5'
      )
  }, { scope: containerRef, dependencies: [loadingResources] })

  const alignment = { xs: 'center', tablet: 'start' }

  if (loadingResources)
    return <CircleLoader text={t('common:loading')} />

  return (
    <Box
      className='flex-grow flex flex-column flex-center'
      width='100%'
      alignItems={alignment}
      py={5}
      px={{ xs: 1.5, mobile: 4 }}
      gap={5}
      ref={containerRef}>
      <Box
        className='flex flex-column flex-center'
        alignItems={alignment}
        gap={3}>
        <Typography
          variant='h1'
          sx={[theme => ({
            ...theme.typography.h3,
            ...hidden,
            perspective: '1000px',
            transformOrigin: '0 50% -50',
          })]}
          id='newProjectTitle'>
          {t('projects:createProject')}
        </Typography>

        <Paper
          className='flex flex-column'
          variant='outlined'
          sx={{
            px: { xs: 1, mobile: 3 },
            py: { xs: 2, mobile: 4 },
            gap: 3,
            ...hidden
          }}
          id='newProjectForm'>
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
        </Paper>

        <Box className='flex flex-column'
          flexDirection={{ xs: 'column', tablet: 'row' }}
          justifyContent={{ xs: 'start', tablet: 'space-between' }}
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
