import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export default function DropTarget({ dropId, render, canMove, onMove }) {
  const [dropState, setDropState] = useState('idle')
  const dropRef = useRef(null)

  useEffect(() => {
    const element = dropRef.current
    if (!element) return

    return dropTargetForElements({
      element,
      canDrop: ({ source }) => canMove(dropId, source),
      onDragEnter: () => setDropState('is-over'),
      onDragLeave: () => setDropState('idle'),
      onDrop: (args) => {
        setDropState('idle')
        onMove(args)
      }
    })
  }, [dropId, canMove, onMove])

  return render({ dragState: dropState, ref: dropRef })
}
