import { useEffect, useState, useRef } from 'preact/hooks'
import { useGSAP } from '@gsap/react'
import useLayout from '../useLayout'
import useTasks from '../useTasks'

import gsap from 'gsap'
import getTaskRef from '@utils/tasks/getTaskRef'

export default function useTaskEntranceAnimation(
  wrapperRef,
  items = [],
  { subtasks = false, addDelay = false }
) {
  const { taskRefs } = useTasks()
  const { filter } = useLayout()

  const filterAnimated = useRef(null)

  useGSAP(() => {
    if (!items?.length ||
      !wrapperRef.current ||
      filterAnimated.current === filter) return

    const getCard = ({ id }) => getTaskRef(taskRefs, id)?.parentElement
    const targets = items.map(getCard).filter(Boolean)

    if (targets.length === 0) return

    filterAnimated.current = filter

    const rafId = requestAnimationFrame(() => {
      const tl = gsap.timeline({
        // add the scrollTrigger only if we aren't animating a new task
        ...(targets.length > 1 && {
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top+=35% bottom',
            once: true
          }
        }),
        defaults: { stagger: 0.15 }
      })

      // only animate the icons of the current targets
      const icons = targets
        .map(t => t.querySelector('.MuiCardHeader-action'))
        .filter(Boolean)

      const startDelay = addDelay || subtasks ? 0.3 : 0

      tl.fromTo(targets, {
        autoAlpha: 0,
        y: -10,
        x: -25,
        force3D: true
      }, {
        autoAlpha: 1,
        y: 0,
        x: 0,
        delay: startDelay,
        ease: 'power2.out',
        overwrite: 'auto'
      })
        .fromTo(icons, {
          autoAlpha: 0,
          x: 15,
          ease: 'expo.out'
        }, {
          autoAlpha: 1,
          x: 0
        }, '-=0.2')
    })

    return () => cancelAnimationFrame(rafId)
  }, { scope: wrapperRef, dependencies: [items?.length, filter, subtasks] })
}
