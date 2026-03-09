import { useState } from 'preact/compat'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function useCounterAnimation(targetValue, options = {}) {
  const {
    duration = 1.2,
    decimals = 0,
    trigger,
    delay = 0,
    revert = false
  } = options

  const [count, setCount] = useState(0)

  useGSAP(() => {
    if (!trigger?.current) return

    const obj = { val: 0 }

    gsap.to(obj, {
      val: targetValue,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: trigger.current,
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        const formattedValue = decimals > 0
          ? Number(obj.val.toFixed(decimals))
          : Math.floor(obj.val)
        setCount(formattedValue)
      },
    })
  }, {
    dependencies: [targetValue, trigger],
    scope: trigger,
    revertOnUpdate: revert
  })

  return count
}
