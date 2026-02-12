import { useRef } from 'react'

// components
import Link from '@components/reusable/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// hooks
import { useGSAP } from '@gsap/react'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

// utils
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrambleTextPlugin)

const linkStyles = {
  position: 'relative',
  opacity: 0,
  translate: '0 20px',
  visibility: 'hidden',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -2,
    left: 0,
    width: '0%',
    height: '1px',
    backgroundColor: 'currentColor',
    transition: 'width 0.3s ease'
  },
  '&:hover::after': {
    width: '100%'
  }
}

export default function Home() {
  const { t } = useTranslation(['common', 'ui'])
  const { profile, metadata, userLoaded } = useUser()
  const containerRef = useRef(null)

  const username = profile?.username
  const lastEdited = metadata?.lastEditedProject
  const owner = metadata?.lastEditedProjectOwner

  const navLinks = [
    { to: '/projects', text: t('projects.goToProjects', { ns: 'ui' }) },
    { to: '/projects/new', text: t('projects.createProject', { ns: 'ui' }) },
    ...(lastEdited ? [{
      to: `/projects/${lastEdited}?o=${owner}`,
      text: t('projects.lastEditedProject', { ns: 'ui' })
    }] : [])
  ]

  const { contextSafe } = useGSAP({ scope: containerRef })

  const handleHover = contextSafe((e, isEnter) => {
    gsap.to(e.currentTarget, {
      x: isEnter ? 5 : 0,
      duration: 0.3,
      ease: 'power2.out'
    })
  })

  useGSAP(() => {
    if (!userLoaded || !username) return

    document.fonts.ready.then(() => {
      const tl = gsap.timeline()

      tl.to('#welcome', { autoAlpha: 1 })
        .to('#username', {
          duration: 1.2,
          autoAlpha: 1,
          scrambleText: {
            text: username,
            chars: 'upperCase',
            speed: 0.4,
            revealDelay: 0.2
          }
        }, '<')

      tl.to('.home-link', {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      }, '-=0.5')
    })
  }, { dependencies: [username, userLoaded], scope: containerRef })

  return (
    <Box
      className='flex flex-column flex-center text-center'
      m='auto'
      ref={containerRef}>
      <Typography variant='h4' sx={{ opacity: 0, visibility: 'hidden' }} id='welcome'>
        {t('welcome', { ns: 'common' })}{' '}
        <Typography variant='span' sx={{ color: 'primary.main', fontWeight: 700 }} id='username'>
          {username}
        </Typography>
      </Typography>

      <Box className='flex flex-column flex-center' gap={2} mt={3}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className='home-link'
            sx={linkStyles}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}>
            <Typography>{link.text}</Typography>
          </Link>
        ))}
      </Box>
    </Box>
  )
}
