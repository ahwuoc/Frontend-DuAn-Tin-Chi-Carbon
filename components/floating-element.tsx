"use client"

import { type ReactNode, useRef, useEffect } from "react"

interface FloatingElementProps {
  children: ReactNode
  speed?: number
  offset?: number
  className?: string
}

export default function FloatingElement({ children, speed = 1, offset = 15, className = "" }: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(Date.now() + Math.random() * 1000)

  useEffect(() => {
    const animate = () => {
      if (!elementRef.current) return

      const elapsedTime = (Date.now() - startTimeRef.current) / 1000
      const translateY = Math.sin(elapsedTime * speed) * offset

      elementRef.current.style.transform = `translateY(${translateY}px)`

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [speed, offset])

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-150 hover:scale-110 hover:rotate-3 ${className}`}
      style={{ transformOrigin: "center" }}
    >
      {children}
    </div>
  )
}
