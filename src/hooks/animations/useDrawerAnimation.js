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
    const icons = ['.drawer-action .MuiSvgIcon-root']
    const labels = ['.nav-action-text']

    // check before adding the lasts items to animate
    if (projectId) labels.push('.nav-folder-text')

    // last items to animate
    labels.push('.profile-btn-text')
    icons.push('.profile-btn-avatar')

    const tl = gsap.timeline({
      defaults: {
        ease: 'expo.inOut',
        duration: 0.5,
        overwrite: 'auto'
      }
    })

    if (!isMobile) {
      tl.fromTo(drawerRef.current, { xPercent: isOpening ? -100 : 100 },
        {
          xPercent: 0,
          width: targetWidth,
          duration: isOpening ? 0.3 : 0.2,
          ease: 'power3.out'
        })
        .addLabel('items')

      setItem('drawerOpen', isOpening)
    }

    if (isOpening) {
      return tl.fromTo(icons,
        { opacity: 0, x: -8, scale: 0.8 },
        { opacity: 1, x: 0, scale: 1, stagger: 0.05, clearProps: 'all' },
        'items')
        .fromTo(labels,
          { x: -15, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.075 }, '<0.15')
    }

    tl.to(labels,
      { opacity: 0, x: -15, duration: 0.15, stagger: 0.03 }, 'items-=0.4')
      .to(icons, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.3,
        clearProps: 'all'
      }, 'items')
  })

  return animate
}
