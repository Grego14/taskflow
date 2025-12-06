import { useState } from 'react'

// components
import Link from '@components/reusable/Link'
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// hooks
import { useGSAP } from '@gsap/react'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

// utils
import { getItem } from '@utils/storage.js'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(useGSAP, ScrambleTextPlugin)

const linkHoverStyles = {
  '&:hover': {
    opacity: 0.8
  }
}

export default function Home() {
  const { t } = useTranslation(['common', 'ui'])
  const [open, setOpen] = useState(getItem('drawerOpen', false))

  const { profile, metadata, userLoaded } = useUser()

  const lastEditedProject = metadata?.lastEditedProject
  const lastEditedProjectOwner = metadata?.lastEditedProjectOwner
  const username = profile?.username

  useGSAP(
    () => {
      document.fonts.ready.then(() => {
        if (username && userLoaded) {
          gsap.set('#username', { opacity: 1 })

          gsap.to('#username', {
            duration: 1,
            scrambleText: {
              text: username,
              chars: 'User',
              speed: 0.75,
              revealDelay: 0.5
            }
          })
        }
      })
    },
    { dependencies: [username, userLoaded] }
  )

  if (!userLoaded)
    return (
      <CircleLoader height='100dvh' text={t('loadingUser', { ns: 'ui' })} />
    )

  return (
    <Box className='flex flex-column flex-center text-center' m='auto'>
      <Typography variant='h4'>
        {t('welcome', { ns: 'common' })}{' '}
        <Typography variant='span' sx={{ opacity: 0 }} id='username'>
          {username}
        </Typography>
      </Typography>

      <Link to='/projects' marginTop={4} sx={linkHoverStyles}>
        <Typography>{t('projects.goToProjects', { ns: 'ui' })}</Typography>
      </Link>

      {lastEditedProject && (
        <Link
          to={`/projects/${lastEditedProject}?o=${lastEditedProjectOwner}`}
          marginTop={2}
          sx={linkHoverStyles}>
          <Typography>
            {t('projects.lastEditedProject', { ns: 'ui' })}
          </Typography>
        </Link>
      )}

      <Link to='/projects/new' marginTop={2} sx={linkHoverStyles}>
        <Typography>{t('projects.createProject', { ns: 'ui' })}</Typography>
      </Link>
    </Box>
  )
}
