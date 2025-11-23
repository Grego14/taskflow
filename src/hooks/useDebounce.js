import { useCallback, useEffect, useRef } from 'react'

export default function useDebounce(callback, delay) {
  const timeoutRef = useRef(null)
  const latestCallback = useRef(callback)
  const cancelRef = useRef(() => {
    clearTimeout(timeoutRef.current)
  })

  latestCallback.current = callback

  // function to cancel the timeout
  const cancel = useCallback(() => {
    clearTimeout(timeoutRef.current)
  }, [])

  // clear on unmount
  useEffect(() => {
    return () => cancel()
  }, [cancel])

  const debouncedCallback = useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        latestCallback.current(...args)
      }, delay)
    },
    [delay]
  )

  return [debouncedCallback, cancel]
}
