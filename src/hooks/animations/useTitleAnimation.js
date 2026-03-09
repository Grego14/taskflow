import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

export default function useTitleAnimation(id, options) {
  const { loading, onComplete } = options

  useGSAP(() => {
    const element = document.getElementById(id)
    if (!element || loading) return

    const split = new SplitText(element, { type: 'chars' })

    gsap.set(element, { perspective: 500 })

    gsap.from(split.chars, {
      duration: 1,
      opacity: 0,
      y: 70,
      rotationX: -90,
      transformOrigin: '50% 50% -50',
      ease: 'expo.out',
      stagger: 0.03,
      onComplete: () => {
        split.revert()
        onComplete?.()
      },
    })

  }, { dependencies: [id, loading] })
}
