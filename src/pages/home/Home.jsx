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

const homeLinks = (owner, lastEdited) => [
  { to: '/projects', keyTranslation: 'goToProjects' },
  { to: '/projects/new', keyTranslation: 'createProject' },
  { to: `/projects/${owner}/${lastEdited}`, keyTranslation: 'lastEditedProject' }
]

export default function Home() {
  const { t } = useTranslation(['common', 'ui'])
  const { profile, metadata, userLoaded } = useUser()
  const containerRef = useRef(null)

  const username = profile?.username
  const lastEdited = metadata?.lastEditedProject
  const owner = metadata?.lastEditedProjectOwner

  const links = homeLinks(owner, lastEdited)

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
      <Typography
        variant='h4'
        sx={{ opacity: 0, visibility: 'hidden' }}
        id='welcome'
        aria-hidden='true'>
        {t('welcome', { ns: 'common' })}{' '}
        <Typography
          variant='span'
          sx={theme => ({
            color: 'primary.main',
            fontWeight: 700,
            textShadow: `0 0 10px ${theme.palette.primary.main}75`,
          })}
          id='username'>
          {username}
        </Typography>
      </Typography>

      <span className='sr-only'>
        {t('common:welcome')}{' '}{username}
      </span>

      <Box className='flex flex-column flex-center' gap={2} mt={3}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className='home-link'
            sx={linkStyles}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}>
            <Typography>
              {t(`home.${link.keyTranslation}`, { ns: 'ui' })}
            </Typography>
          </Link>
        ))}
      </Box>
    </Box>
  )
}
