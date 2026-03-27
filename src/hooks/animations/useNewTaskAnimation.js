import { useGSAP } from '@gsap/react'
import useTasks from '../useTasks'

import getTaskRef from '@utils/tasks/getTaskRef'
import gsap from 'gsap'

export default function useNewTaskAnimation(id, isNew) {
  const { taskRefs } = useTasks()

  useGSAP(() => {
    const cardContainer = getTaskRef(taskRefs, id)?.parentElement

    if (!cardContainer || !isNew) return

    gsap.fromTo(cardContainer,
      { autoAlpha: 0, y: -10, x: -25 },
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        ease: 'power2.out',
      }
    )
  }, { dependencies: [isNew] })
}
