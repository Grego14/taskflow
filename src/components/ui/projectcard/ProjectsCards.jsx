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

const dividerStyles = { mt: 2, width: 0, opacity: 0 }

const projectCardsContainerStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 3
}

export default function ProjectsCards({ data, animate, setAnimateButtons }) {
  const { t } = useTranslation('projects')
  const { isMobile } = useApp()
  const { metadata, userLoaded } = useUser()
  const containerRef = useRef(null)

  const lastId = metadata?.lastEditedProject

  const projects = useMemo(() => {
    if (!data) return { other: [], last: null }

    return {
      other: data
        .filter(p => p.id !== lastId)
        .sort((a, b) => (a.isArchived === b.isArchived ? 0
          : a.isArchived ? 1 : -1)),
      last: data.find(p => p.id === lastId)
    }
  }, [data, lastId])

  useGSAP(() => {
    if (!userLoaded || !data || !animate) return

    // wait until the last is ready
    if (lastId && !projects.last && data.length > 0) return

    const cards = gsap.utils.toArray('.card', containerRef.current)

    if (projects.other.length) {
      gsap.to('#divider', {
        width: '100%',
        opacity: 1,
        ease: 'power4.out',
        duration: 2,
        delay: 0.5
      })
    }

    const CARD_STYLES = { x: -50, autoAlpha: 0 }
    const CARD_ANIM_SET = { autoAlpha: 1, x: 0, ease: 'power3.out' }
    const TITLE_ANIM_SET = { 
      x: -15, 
      rotateZ: 45, 
      y: 15, 
      opacity: 0, 
      stagger: 0.02
    }
    const DESC_ANIM_SET = {
      x: -15, 
      rotateZ: -45, 
      y: 15, 
      opacity: 0, 
      stagger: 0.01
    }
    const ID_SCRAMBLE_CONFIG = {
      text: '{original}',
      chars: 'abcdefghifj1234567890',
      revealDelay: 0.3
    }

    const splits = []

    for (const card of cards) {
      const titleEl = card.querySelector('.project-title')
      const descEl = card.querySelector('.project-description')
      const idEl = card.querySelector('.project-id')

      const title = SplitText.create(titleEl, { smartWrap: true, type: 'chars' })
      const description = SplitText.create(descEl, { smartWrap: true, type: 'chars' })

      gsap.set('.project-title, .project-description', { autoAlpha: 1 })

      splits.push(title, description)

      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        defaults: { ease: 'expo.out' }
      })

      gsap.set(card, CARD_STYLES)

      // make the non initial cards appear
      const position = 0.1 * cards.indexOf(card)

      cardTl.to(card, CARD_ANIM_SET, position)
        .from(title.chars, TITLE_ANIM_SET, '<0.2')
        .to(idEl, { autoAlpha: 1, scrambleText: ID_SCRAMBLE_CONFIG }, '<0.3')
        .from(description.chars, DESC_ANIM_SET, '<0.2')
    }

    setAnimateButtons(true)

    return () => {
      for (const split of splits) {
        split.revert()
      }
    }
  }, {
    dependencies: [userLoaded, lastId, projects.other.length, animate],
    scope: containerRef
  })

  const hasOtherProjects = projects.other?.length > 0

  return (
    <Box
      ref={containerRef}
      className={`flex flex-column ${isMobile ? 'flex-center' : ''}`}
      gap={4}
      my={3}
      id='cards'>
      {projects.last && (
        <ProjectsSection title={t('recentProject')}>
          <ProjectCard data={projects.last} isRecent />
          {hasOtherProjects &&
            <Divider id='divider' sx={dividerStyles} />
          }
        </ProjectsSection>
      )}

      {hasOtherProjects > 0 && (
        <ProjectsSection title={t('lastProjects')}>
          <Box
            sx={projectCardsContainerStyles}>
            {projects.other.map(project => (
              <ProjectCard data={project} key={project.id} />
            ))}
          </Box>
        </ProjectsSection>
      )}
    </Box>
  )
}
