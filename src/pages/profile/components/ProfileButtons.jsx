import LogoutButton from '@components/reusable/buttons/LogoutButton'
import Box from '@mui/material/Box'
import DeleteAccountButton from './buttons/DeleteAccountButton'
import SaveProfileButton from './buttons/SaveProfileButton'

import { useRef } from 'preact/hooks'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function ProfileButtons({ saveBtnDisabled }) {
  const containerRef = useRef(null)

  useGSAP(() => {
    const buttons = containerRef.current.children

    gsap.from(buttons, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power4.out',
      delay: 1.2,
      clearProps: 'all'
    })
  }, { scope: containerRef })

  return (
    <Box
      className='flex flex-column flex-center'
      gap={4}
      ref={containerRef}>
      <SaveProfileButton disabled={saveBtnDisabled} />
      <LogoutButton />
      <DeleteAccountButton />
    </Box>
  )
}
