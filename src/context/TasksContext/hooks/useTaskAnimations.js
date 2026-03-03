import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function useTaskAnimations(tasks) {
  const { contextSafe } = useGSAP()

  const getElements = (taskIds) => {
    const elements = []
    for (const id of taskIds) {
      const task = tasks?.find(t => t.id === id)
      if (task?.ref?.current) elements.push(task.ref.current)
    }
    return elements
  }

  const animateOut = contextSafe((taskIds, type = 'archive') => {
    return new Promise((resolve) => {
      const targets = getElements(taskIds)
      if (targets.length === 0) return resolve()

      const config = {
        archive: { y: -100, x: 100, scale: 0.8 },
        delete: { x: 100, scale: 0.9 }
      }

      const settings = config[type] || config.archive

      gsap.to(targets, {
        x: settings.x,
        y: settings.y,
        autoAlpha: 0,
        scale: settings.scale,
        height: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: 'power2.in',
        onStart: () => {
          // play the sound
        },
        onComplete: resolve
      })
    })
  })

  return { animateOut }
}
