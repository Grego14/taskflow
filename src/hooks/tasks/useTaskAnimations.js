import { useGSAP } from '@gsap/react'
import useTasks from '@hooks/useTasks'
import useLayout from '@hooks/useLayout'
import getTaskRef from '@utils/tasks/getTaskRef'
import gsap from 'gsap'
import { useRef } from 'preact/hooks'
import { taskRegistry } from '@stores/task'

export default function useTaskAnimations() {
  const { taskRefs } = useTasks()
  const { filter } = useLayout()
  const { contextSafe } = useGSAP()

  const animatedFilter = useRef(null)

  // --- items entrance on wrappers/filter change ---
  const animateEntrance = contextSafe((
    wrapperRef,
    itemIds,
    { addDelay = false, subtasks = false } = {}
  ) => {
      if (!itemIds?.length || !wrapperRef.current) return
      if (animatedFilter.current === filter) return

      const targets = itemIds
      .map(id => {
        const taskData = taskRegistry.value.get(id)
        if (!taskData) return null

        return getTaskRef(taskRefs, id)?.parentElement
      })
      .filter(Boolean)

      if (targets.length === 0) return

      animatedFilter.current = filter

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top+=35% bottom',
          once: true
        },
        defaults: { stagger: 0.15 }
      })

      const startDelay = addDelay || subtasks ? 0.3 : 0

      const icons = targets
      .map(t => t.querySelector('.MuiCardHeader-action'))
      .filter(Boolean)

      gsap.killTweensOf(targets)

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
          }, '-=0.3')
    })

  // --- individual entrance (new task/task promotion) ---
  const animateItemEntrance = contextSafe((id) => {
    const el = getTaskRef(taskRefs, id)?.parentElement

    if (!el) return

    gsap.set(el, { willChange: 'transform, opacity' })

    setTimeout(() => {
      gsap.fromTo(el,
        { autoAlpha: 0, y: -25, scale: 0.95, x: -50 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          x: 0,
          ease: 'power2.out',
          force3D: true,
          lazy: true,
          clearProps: 'transform, will-change'
        }
      )
    }, 50)
  })

  // --- exit (archive/delete) ---
  const animateOut = contextSafe((elements, type = 'delete') => {
    return new Promise((resolve) => {
      const targets = Array.isArray(elements) ? elements : [elements]
      const validTargets = targets.filter(Boolean)

      if (validTargets.length === 0) return resolve()

      const config = {
        archive: { x: 100, y: -20, rotate: 5, scale: 0.9 },
        delete: { x: 120, scale: 0.8, rotate: -5 },
      }

      const settings = config[type] || config.delete

      validTargets.forEach(t => t.classList.add('removing'))

      gsap.to(validTargets, {
        ...settings,
        autoAlpha: 0,
        height: 0,
        marginBottom: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          resolve()
        },
        clearProps: 'transform'
      })
    })
  })

  return { animateEntrance, animateItemEntrance, animateOut }
}
