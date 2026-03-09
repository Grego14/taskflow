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
      gsap.utils.toArray('.MuiButtonBase-root, .MuiButton-root, [role="button"], .MuiLink-root')

    if (items.length < 1) return

    const tl = gsap.timeline()

    tl.to(appBarRef.current, { autoAlpha: 1, y: 0 })
      .from(items, {
        autoAlpha: 0,
        scale: 0.75,
        stagger: 0.12,
        ease: 'expo.out',
        rotateZ: noRotate ? 0 : -45,
        y: top ? -height : height
      }, '<0.35')
  }, { dependencies: [enabled, noRotate], scope: appBarRef })
}
