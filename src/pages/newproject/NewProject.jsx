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
import Link from '@components/reusable/Link'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useLoadResources from '@hooks/useLoadResources'
import { useGSAP } from '@gsap/react'
import { useRef } from 'preact/hooks'
import useApp from '@hooks/useApp'

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

const hidden = { opacity: 0, visibility: 'hidden' }

export default function NewProject() {
  const { isMobile, isOnlyMobile } = useApp()
  const { t } = useTranslation(['ui', 'common'])
  const loadingResources = useLoadResources('ui')
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
    gsap.set('#newProjectcreate', { y: 75 })

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
        '#newProjectcreate',
        { autoAlpha: 1, y: 0 },
        '-=0.5'
      )
  }, { scope: containerRef, dependencies: [loadingResources] })

  const alignment = isMobile ? 'center' : ' start'

  if (loadingResources)
    return <CircleLoader text={t('loading', { ns: 'common' })} />

  return (
    <Box
      className='flex-grow flex flex-column flex-center'
      width='100%'
      alignItems={alignment}
      py={5}
      px={isOnlyMobile ? 1.5 : 4}
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
          {t('projects.createProject', { ns: 'ui' })}
        </Typography>

        <Paper
          className='flex flex-column'
          variant='outlined'
          sx={{
            px: isOnlyMobile ? 1 : 3,
            py: isOnlyMobile ? 2 : 4,
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
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent={isMobile ? 'start' : 'space-between'}
          alignItems='center'
          minWidth='100%'
          id='newProjectcreate'
          {...hidden}
          gap={2}>
          <CreateProject
            {...form}
            errors={errors}
            sx={{ m: 0 }}
          />
          <Box
            className='flex flex-column flex-center'
            flexDirection='inherit'
            gap={isMobile ? 1 : 2}>
            <Typography color='textSecondary' sx={[theme => ({ ...theme.typography.subtitle2 })]}>
              {t('or', { ns: 'common' })}
            </Typography>
            <Link to='/templates'>Create from template</Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
