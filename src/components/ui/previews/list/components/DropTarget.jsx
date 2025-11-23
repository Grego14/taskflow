import TasksWrapper from './TasksWrapper'

import { useEffect, useRef, useState } from 'react'

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export default function DropTarget({ dropId, render, canMove, onMove }) {
  const [dropState, setDropState] = useState('idle')
  const dropRef = useRef(null)

  useEffect(() => {
    const element = dropRef.current

    return dropTargetForElements({
      element,
      canDrop: ({ source }) => canMove(dropId, source),
      onDragStart: args =>
        setDropState(canMove(dropId, args.source) ? 'is-over' : 'idle'),
      onDragEnter: args =>
        setDropState(canMove(dropId, args.source) ? 'is-over' : 'idle'),
      onDragLeave: () => setDropState('idle'),
      onDrop: args => {
        setDropState('idle')
        onMove(args)
      }
    })
  }, [dropId, canMove, onMove])

  return render({ dragState: dropState, ref: dropRef })
}
