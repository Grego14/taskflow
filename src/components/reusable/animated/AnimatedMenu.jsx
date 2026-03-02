import { useState, useEffect, useRef } from 'preact/hooks'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const ANIM_CONFIG = {
  duration: 0.25,
  stagger: 0.05,
  ease: 'power2.inOut'
}

// calculate speed based on item count
const getDynamicStagger = (count) => {
  if (count <= 3) return 0.12
  if (count <= 7) return 0.08
  return 0.05
}

export default function AnimatedMenu({ children, open, onExitComplete }) {
  const [menuElement, setMenuElement] = useState(null)
  const [shouldRender, setShouldRender] = useState(open)
  const isInitialRender = useRef(true)

  useEffect(() => {
    if (open) setShouldRender(true)
  }, [open])

  const { contextSafe } = useGSAP({ scope: menuElement })

  const triggerExit = contextSafe(() => {
    if (!menuElement) return

    const targets = menuElement.children
    const stagger = getDynamicStagger(targets.length)

    const tl = gsap.timeline({
      onComplete: () => {
        setShouldRender(false)
        onExitComplete?.()
      }
    })

    tl.to(targets, {
      opacity: 0,
      y: -15,
      stagger: stagger * 0.5,
      duration: 0.2,
      ease: 'power2.in'
    })

    tl.to(menuElement.parentElement, {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.in'
    }, '<0.1')
  })

  useGSAP(() => {
    if (!menuElement || !menuElement?.children?.length || !open) return

    const targets = menuElement.children
    const stagger = getDynamicStagger(targets.length)
    const tl = gsap.timeline()

    tl.fromTo(menuElement.parentElement,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    )

    tl.fromTo(targets,
      { opacity: 0, y: 15, scale: 0.8 },
      {
        ...ANIM_CONFIG,
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'back.out(2)',
        stagger,
        overwrite: 'auto'
      },
      '>'
    )

    isInitialRender.current = false
  }, { scope: menuElement, dependencies: [open, menuElement] })

  return children(shouldRender, setMenuElement, triggerExit)
}
