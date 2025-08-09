import { useEffect, useCallback, useRef } from 'react'

export default function useDebounce(callback, delay) {
  const timeoutRef = useRef(null)
  const latestCallback = useRef(callback)
  const cancelRef = useRef(() => {
    clearTimeout(timeoutRef.current)
  })

  latestCallback.current = callback

  // clear on unmount
  useEffect(() => {
    return cancelRef.current
  }, [])

  const debouncedCallback = useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        latestCallback.current(...args)
      }, delay)
    },
    [delay]
  )

  // function to cancel the timeout
  const cancel = useCallback(() => {
    clearTimeout(timeoutRef.current)
  }, [])

  return [debouncedCallback, cancelRef.current]
}
