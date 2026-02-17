import ProjectCard from '@components/ui/projectcard/ProjectCard'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import { useRef, useMemo } from 'preact/hooks'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(SplitText, ScrollTrigger, ScrambleTextPlugin)

const ProjectsSection = ({ title, children }) => (
  <Box className='flex flex-column' gap={1.5} minWidth='100%'>
    <Typography variant='overline' color='textSecondary' sx={{ fontSize: '0.85rem' }}>
      {title}
    </Typography>
    {children}
  </Box>
)

export default function ProjectsCards({ data }) {
  const { t } = useTranslation('ui')
  const { isMobile } = useApp()
  const { metadata, userLoaded } = useUser()
  const containerRef = useRef(null)

  const lastId = metadata?.lastEditedProject

  const projects = useMemo(() => {
    if (!data) return { other: [], last: null }

    return {
      other: data
        .filter(p => p.id !== lastId)
        .sort((a, b) => (a.isArchived === b.isArchived ? 0 : a.isArchived ? 1 : -1)),
      last: data.find(p => p.id === lastId)
    }
  }, [data, lastId])

  useGSAP(() => {
    if (!userLoaded || !data) return

    // wait until the last is ready
    if (lastId && !projects.last && data.length > 0) return

    const cards = gsap.utils.toArray('.card', containerRef.current)
    gsap.set('.project-title, .project-description', { autoAlpha: 1 })

    if (projects.other.length) {
      gsap.to('#divider', {
        width: '100%',
        opacity: 1,
        ease: 'power4.out',
        duration: 2,
        delay: 0.5
      })
    }

    for (const card of cards) {
      const titleEl = card.querySelector('.project-title')
      const descEl = card.querySelector('.project-description')
      const idEl = card.querySelector('.project-id')

      const title = SplitText.create(titleEl, { smartWrap: true, type: 'chars' })
      const description = SplitText.create(descEl, { smartWrap: true, type: 'chars' })

      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        defaults: { ease: 'expo.out' }
      })

      gsap.set(card, { x: -50, autoAlpha: 0 })
      gsap.set(title.chars, { x: -15, rotateZ: 45, y: 15, opacity: 0 })
      gsap.set(description.chars, { x: -15, rotateZ: -45, y: 15, opacity: 0 })

      // make the non initial cards appear
      const position = 0.1 * cards.indexOf(card)

      cardTl.to(card, {
        autoAlpha: 1,
        x: 0,
        ease: 'back.out(2)',
        duration: 1.25,
        delay: 0.35
      }, position)
        .to(title.chars, {
          x: 0,
          rotateZ: 0,
          y: 0,
          opacity: 1,
          stagger: 0.02
        }, '<0.2')
        .to(idEl, {
          autoAlpha: 1,
          scrambleText: {
            text: '{original}',
            chars: 'abcdefghifj1234567890',
            revealDelay: 0.3
          }
        }, '<0.3')
        .to(description.chars, {
          x: 0,
          rotateZ: 0,
          y: 0,
          opacity: 1,
          stagger: 0.01
        }, '<0.2')
    }
  }, { dependencies: [userLoaded, lastId, projects.other.length], scope: containerRef })

  return (
    <Box
      ref={containerRef}
      className={`flex flex-column ${isMobile ? 'flex-center' : ''}`}
      gap={4}
      my={3}
      id='cards'
    >
      {projects.last && (
        <ProjectsSection title={t('projects.recentProject')}>
          <ProjectCard data={projects.last} isRecent />
          {projects.other.length > 0 &&
            <Divider
              id='divider'
              sx={{
                mt: 2,
                width: 0,
                opacity: 0
              }}
            />
          }
        </ProjectsSection>
      )}

      {projects.other.length > 0 && (
        <ProjectsSection title={t('projects.lastProjects')}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 3
            }}
          >
            {projects.other.map(project => (
              <ProjectCard data={project} key={project.id} />
            ))}
          </Box>
        </ProjectsSection>
      )}
    </Box>
  )
}
