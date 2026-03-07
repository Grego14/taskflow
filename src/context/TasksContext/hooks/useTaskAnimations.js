import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function useTaskAnimations(tasks) {
  const { contextSafe } = useGSAP()

  const getElements = (taskIds) => {
    const elements = []
    for (const id of taskIds) {
      let task = tasks?.find(t => t.id === id)

      if (!task) {
        task = tasks.flatMap(t => t.subtasks)?.find(s => s.id === id)
      }

      if (task?.ref?.current) elements.push(task.ref.current)
    }
    return elements
  }

  const animateOut = contextSafe((taskIds, type = 'archive') => {
    return new Promise((resolve) => {
      const targets = getElements(taskIds)

      if (targets.length === 0) return resolve()

      const targetParents = targets?.map(target => target.parentElement)

      const config = {
        archive: { y: -100, x: 100, scale: 0.8 },
        delete: { x: 100, scale: 0.9 }
      }

      const settings = config[type] || config.archive
      const tl = gsap.timeline()

      for (const parent of targetParents) {
        parent.classList.add('removing')
      }

      tl.to(targets, {
        x: settings.x,
        y: settings.y,
        autoAlpha: 0,
        scale: settings.scale,
        height: 0,
        border: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: resolve
      })
    })
  })

  return { animateOut }
}
