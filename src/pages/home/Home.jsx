import { useRef, useMemo } from 'preact/hooks'

import Link from '@components/reusable/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useGSAP } from '@gsap/react'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrambleTextPlugin)

const linkStaticStyles = {
  position: 'relative',
  display: 'inline-block',

  willChange: 'translate',
  transition: 'translate 0.25s ease-in-out',

  '&:hover, &:focus-visible': {
    translate: '5px',
    textDecorationColor: 'currentColor',
    outline: 'none'
  },

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
  '&:hover::after, &:focus-visible::after': { width: '100%' }
}

const getUsernameStyles = theme => ({
  color: 'primary.main',
  textShadow: `0 0 10px ${theme.palette.primary.main}75`,
  ...theme.typography.h4,
  fontWeight: 700
})

const HOME_LINKS_SCHEMA = [
  { to: '/projects', key: 'goToProjects' },
  { to: '/projects/new', key: 'createProject' },
  { to: 'DYNAMIC_LAST_EDITED', key: 'lastEditedProject' }
]

export default function Home() {
  const { t } = useTranslation('ui')
  const { profile, metadata, userLoaded } = useUser()
  const containerRef = useRef(null)

  const username = profile?.username
  const lastEdited = metadata?.lastEditedProject
  const owner = metadata?.lastEditedProjectOwner

  const links = useMemo(() => {
    return HOME_LINKS_SCHEMA.map(link => {
      if (link.to === 'DYNAMIC_LAST_EDITED') {
        return lastEdited 
          ? { ...link, to: `/projects/${owner}/${lastEdited}` } 
          : null 
      }
      return link
    })
  }, [owner, lastEdited])

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
          },
          clearProps: 'all'
        }, '<')

      tl.fromTo('.home-link', { y: 15 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'expo.out',
          clearProps: 'transform'
        }, '<0.25')
    })
  }, { dependencies: [username, userLoaded], scope: containerRef })

  return (
    <Box
      className='flex flex-column flex-center text-center'
      m='auto'
      ref={containerRef}>
      <Typography
        variant='h4'
        className='hide-element'
        id='welcome'
        aria-hidden='true'>
        {t('common:welcome')}{' '}
        <Typography
          component='span'
          sx={getUsernameStyles}
          id='username'>
          {username}
        </Typography>
      </Typography>

      <span className='sr-only'>
        {t('common:welcome')}{' '}{username}
      </span>

      <Box className='flex flex-column flex-center' gap={2} mt={3}>
        {links.map((link) => link && (
          <Link
            key={link.to}
            to={link.to}
            className='home-link hide-element'
            sx={linkStaticStyles}
            color='primary.contrast'>
            <Typography>
              {t(`home.${link.key}`)}
            </Typography>
          </Link>
        ))}
      </Box>
    </Box>
  )
}
