'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseTimerReturn {
  time: number
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
  formatTime: () => string
}

export function useTimer(initialTime: number = 0, countDown: boolean = false): UseTimerReturn {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (countDown) {
            if (prev <= 0) {
              setIsRunning(false)
              return 0
            }
            return prev - 1
          }
          return prev + 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, countDown])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback(() => {
    setIsRunning(false)
    setTime(initialTime)
  }, [initialTime])

  const formatTime = useCallback(() => {
    const mins = Math.floor(time / 60)
    const secs = time % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [time])

  return { time, isRunning, start, pause, reset, formatTime }
}
