"use client"

import { useEffect, useRef } from "react"

interface ConfettiEffectProps {
  isActive: boolean
  duration?: number
}

export default function ConfettiEffect({ isActive, duration = 3000 }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const confettiRef = useRef<any[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create confetti particles
    const colors = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"]
    const shapes = ["circle", "square", "triangle"]

    confettiRef.current = []

    for (let i = 0; i < 200; i++) {
      confettiRef.current.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        speed: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      confettiRef.current.forEach((confetti, index) => {
        ctx.save()
        ctx.translate(confetti.x, confetti.y)
        ctx.rotate((confetti.rotation * Math.PI) / 180)

        ctx.fillStyle = confetti.color

        if (confetti.shape === "circle") {
          ctx.beginPath()
          ctx.arc(0, 0, confetti.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (confetti.shape === "square") {
          ctx.fillRect(-confetti.size / 2, -confetti.size / 2, confetti.size, confetti.size)
        } else if (confetti.shape === "triangle") {
          ctx.beginPath()
          ctx.moveTo(0, -confetti.size / 2)
          ctx.lineTo(confetti.size / 2, confetti.size / 2)
          ctx.lineTo(-confetti.size / 2, confetti.size / 2)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()

        // Update position
        confetti.y += confetti.speed
        confetti.rotation += confetti.rotationSpeed

        // Remove confetti if it's off-screen
        if (confetti.y > canvas.height + 20) {
          confettiRef.current.splice(index, 1)
        }
      })

      if (confettiRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    // Stop after duration
    timeoutRef.current = setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }, duration)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isActive, duration])

  if (!isActive) return null

  return <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none" />
}
