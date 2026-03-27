import useProject from '@hooks/useProject'
import useApp from '@hooks/useApp'
import { useParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'

import { DRAWER_CONFIG } from '@/constants'
import { setItem } from '@utils/storage'
import gsap from 'gsap'

const icons = ['.nav-action__icon', '.profile-btn-avatar']
const toolbarSelect = '.toolbar-select'

export default function useDrawerAnimation(drawerRef, {
  onStart,
  onComplete,
  animate
}) {
  const { contextSafe } = useGSAP({ scope: drawerRef, dependencies: [animate] })
  const { projectId } = useParams()
  const { isMobile } = useApp()

  const animateDrawer = contextSafe((isOpening) => {
    if (!drawerRef.current || !animate) return

    const width = DRAWER_CONFIG[isOpening ? 'widthOpen' : 'widthClosed']
    const currentWidth = drawerRef.current.offsetWidth

    const labels = ['.nav-action__text']

    // check before adding the lasts items to animate
    if (projectId) labels.push('.nav-folder-text')

    // last items to animate
    labels.push('.profile-btn-text')

    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
        duration: 0.4,
        overwrite: 'auto'
      }
    })

    const widthDuration = isOpening ? 0.25 : 0.3
    tl.fromTo(drawerRef.current,
      {
        x: `-${width}px`,
        width: currentWidth,
      },
      {
        transition: `width ${widthDuration}s ease-in-out`,
        duration: widthDuration,
        width,
        ease: 'power3.out',
        x: 0,
        onStart,

        // avoid the scrollbar on the initial animation
        onComplete: () => gsap.set(drawerRef.current, { overflowX: 'hidden' }),
      }, 'start')

    if (isOpening) {
      tl.fromTo(
        [
          ...icons,
          // we only animate this button on enter 
          toolbarSelect
        ],
        { autoAlpha: 0, x: -20, scale: 0.8, width: 0 },
        { autoAlpha: 1, x: 0, scale: 1, stagger: 0.05, width: 'auto' },
        'start+=0.4')
        .fromTo(labels,
          { x: -15, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, stagger: 0.075, onComplete }, '<0.25')
    } else {
      tl.to(labels,
        { autoAlpha: 0, x: -15, duration: 0.15, stagger: 0.03 }, 'start')
        .to(toolbarSelect, {
          width: 0,
          autoAlpha: 0,
          scale: 0.8,
          x: -100
        }, 'start')
        .fromTo(icons,
          { autoAlpha: 0, scale: 0.8, y: 20 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.5,
            onComplete
          },
          'start+=0.4'
        )
    }

    setItem('drawerOpen', isOpening)
  })

  return animateDrawer
}
