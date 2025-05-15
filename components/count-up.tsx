"use client"

import { useState, useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"

interface CountUpProps {
  end: number
  start?: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export default function CountUp({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CountUpProps) {
  const [count, setCount] = useState(start)
  const countRef = useRef(start)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number
    let currentCount = countRef.current

    if (inView) {
      setTimeout(() => {
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

          currentCount = start + Math.floor(progress * (end - start))
          setCount(currentCount)
          countRef.current = currentCount

          if (progress < 1) {
            animationFrame = requestAnimationFrame(step)
          } else {
            setCount(end)
            countRef.current = end
          }
        }

        animationFrame = requestAnimationFrame(step)
      }, delay)

      return () => cancelAnimationFrame(animationFrame)
    }
  }, [inView, start, end, duration, delay])

  const formatNumber = (num: number) => {
    return num.toLocaleString("vi-VN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  return (
    <span ref={ref}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}
