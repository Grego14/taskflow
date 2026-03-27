import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import useApp from '../useApp'
import { APPBAR_HEIGHT } from '@/constants'

export default function useAppBarAnimation(appBarRef, options = {}) {
  const { isMobile } = useApp()
  const { enabled = true, noRotate = false, top = false } = options
  const height = APPBAR_HEIGHT[isMobile ? 'mobile' : 'other']

  useGSAP(() => {
    if (!enabled || !appBarRef.current) return

    const items =
      gsap.utils.toArray(
        '.nav-action__icon, .MuiButtonBase-root, .MuiButton-root, [role="button"]'
      )

    if (items.length < 1) return

    const tl = gsap.timeline()
    const fromY = `${top ? '-' : ''}${height}`

    tl.fromTo(appBarRef.current, { autoAlpha: 0, y: fromY },
      { autoAlpha: 1, y: 0 }
    ).fromTo(items,
      {
        autoAlpha: 0,
        scale: 0.75,
        rotateZ: noRotate ? 0 : -45,
        y: fromY
      },
      {
        autoAlpha: 1,
        scale: 1,
        rotateZ: 0,
        y: 0,
        stagger: 0.12,
        ease: 'expo.out',
        duration: 1
      }, '<0.35')
      .fromTo('.nav-action__text',
        { x: -10, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, stagger: 0.12 }, '<0.5')
  }, { dependencies: [enabled, noRotate], scope: appBarRef })
}
