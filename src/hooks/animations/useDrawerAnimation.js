import useProject from '@hooks/useProject'
import useApp from '@hooks/useApp'
import { useParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'

import { DRAWER_CONFIG } from '@/constants'
import { setItem } from '@utils/storage'
import gsap from 'gsap'

export default function useDrawerAnimation(drawerRef) {
  const { contextSafe } = useGSAP({ scope: drawerRef })
  const { projectId } = useParams()
  const { isMobile } = useApp()

  const animate = contextSafe((isOpening) => {
    if (!drawerRef.current) return

    const targetWidth = DRAWER_CONFIG[isOpening ? 'widthOpen' : 'widthClosed']
    const currentWidth = drawerRef.current.offsetWidth

    const icons = ['.drawer-action .MuiSvgIcon-root']
    const labels = ['.nav-action-text']

    // check before adding the lasts items to animate
    if (projectId) labels.push('.nav-folder-text')

    // last items to animate
    labels.push('.profile-btn-text')
    icons.push('.profile-btn-avatar')

    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
        duration: 0.4,
        overwrite: 'auto'
      }
    })

    const widthDuration = isOpening ? 0.4 : 0.2
    if (!isMobile) {
      tl.fromTo(drawerRef.current, { width: currentWidth },
        {
          transition: `width ${widthDuration}s ease-in-out`,
          width: targetWidth,
          duration: widthDuration,
          ease: 'power3.out',
          // avoid the scrollbar on the initial animation
          onComplete() { gsap.set(drawerRef.current, { overflowX: 'hidden' }) }
        }, 'start')
    }

    if (isOpening) {
      tl.fromTo(icons,
        { opacity: 0, x: -20, scale: 0.8 },
        { opacity: 1, x: 0, scale: 1, stagger: 0.05, clearProps: 'all' },
        'start+=0.4')
        .fromTo(labels,
          { x: -15, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.075 }, '<0.25')
    } else {
      tl.to(labels,
        { opacity: 0, x: -15, duration: 0.15, stagger: 0.03 }, 'start')
        .fromTo(icons,
          { opacity: 0, scale: 0.8, y: 20 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            clearProps: 'all'
          }, 'start+=0.4')
    }

    setItem('drawerOpen', isOpening)
  })

  return animate
}
