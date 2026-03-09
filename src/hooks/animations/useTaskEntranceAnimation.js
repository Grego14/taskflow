import { useState } from 'preact/hooks'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useTaskEntranceAnimation(
  wrapperRef,
  items = [],
  subtasks
) {
  const [initialPlay, setInitialPlay] = useState(false)

  useGSAP(() => {
    if (items.length === 0 || !wrapperRef.current || initialPlay) return

    const targets = []
    for (const item of items) {
      if (item?.ref?.current) {
        // get the parent container of the MUI Card
        targets.push(item.ref.current.parentElement)
      }
    }

    if (targets.length === 0) return

    ScrollTrigger.refresh()

    const tl = gsap.timeline({
      scrollTrigger: {
        start: 'top+=35% bottom',
        trigger: wrapperRef.current,
        once: true
      },
      defaults: {
        stagger: 0.15,
        onComplete: () => setInitialPlay(true)
      }
    })

    const icons = gsap.utils.toArray('.MuiCardHeader-action', wrapperRef.current)

    tl.fromTo(targets, {
      autoAlpha: 0,
      y: -10,
      x: -25,
      ease: 'back.out(2)'
    }, {
      autoAlpha: 1,
      y: 0,
      x: 0,
      delay: subtasks ? 0.5 : 0
    })
      .fromTo(icons, {
        autoAlpha: 0,
        x: 15,
        ease: 'expo.out'
      }, {
        autoAlpha: 1,
        x: 0
      }, '<')

  }, { scope: wrapperRef, dependencies: [items.length, subtasks, initialPlay] })
}
