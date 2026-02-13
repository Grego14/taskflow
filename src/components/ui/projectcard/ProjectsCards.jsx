// components
import ProjectCard from '@components/ui/projectcard/ProjectCard'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// hooks
import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import { useRef, useMemo } from 'preact/hooks'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(SplitText, ScrollTrigger)

export default function ProjectsCards({ data }) {
  const { t } = useTranslation('ui')
  const { isMobile } = useApp()
  const { metadata, userLoaded } = useUser()
  const containerRef = useRef(null)

  const lastId = metadata?.lastEditedProject

  // filter out the last project and sort the rest
  const projects = useMemo(() => ({
    other: data
      ?.filter(p => p.id !== lastId)
      ?.sort((a, b) => (a.isArchived === b.isArchived ? 0 : a.isArchived ? 1 : -1)),
    last: data?.find(p => p.id === lastId)
  }),
    [data, metadata])

  useGSAP(() => {
    if (!userLoaded || userLoaded && !lastId) return

    const cards = gsap.utils.toArray('.card', containerRef.current)

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    gsap.set('.project-title', { autoAlpha: 1 })

    gsap.set([...cards], { x: -300 })
    tl.to([...cards], { autoAlpha: 1, x: 0, ease: 'back.out(2)', duration: 1.25, stagger: 0.25 }, 'start')

    const title = SplitText.create('.project-title', {
      smartWrap: true, type: 'chars', onSplit(self) {
        gsap.set(self.chars, { x: -15, rotateZ: 45, y: 15, opacity: 0 })

        tl.to(self.chars, {
          x: 0,
          rotateZ: 0,
          y: 0,
          opacity: 1,
          stagger: 0.02
        }, 'start+=0.5')
      }
    })
  }, { dependencies: [userLoaded, lastId] })

  if (!userLoaded) return

  return (
    <Box
      ref={containerRef}
      className={`flex flex-column${isMobile ? ' flex-center' : ''}`}
      gap={4}
      my={3}
      id='cards'>
      {projects.last && (
        <ProjectsSection title={t('projects.recentProject')}>
          <ProjectCard data={projects.last} isRecent />

          {projects.other.length > 0 && <Divider sx={{ mt: 2 }} />}
        </ProjectsSection>
      )}

      {projects.other.length > 0 && (
        <ProjectsSection title={t('projects.lastProjects')}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, 1fr)',
              gap: 3,
            }}>
            {projects.other.map(project => (
              <ProjectCard data={project} key={project.id} />
            ))}
          </Box>
        </ProjectsSection>
      )}
    </Box>
  )
}

function ProjectsSection({ title, children }) {
  return (
    <Box className='flex flex-column' gap={1.5} minWidth='100%'>
      <Typography variant='overline' color='textSecondary' sx={{ fontSize: '0.85rem' }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}
