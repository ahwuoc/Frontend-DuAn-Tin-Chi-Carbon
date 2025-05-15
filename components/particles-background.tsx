"use client"

import { useEffect, useRef } from "react"

interface ParticlesBackgroundProps {
  particleColor?: string
  particleCount?: number
  particleSize?: number
  interactive?: boolean
  sensitivity?: number
}

export default function ParticlesBackground({
  particleColor = "rgba(255, 255, 255, 0.5)",
  particleCount = 150,
  particleSize = 2,
  interactive = true,
  sensitivity = 1,
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    const particles: Particle[] = []
    let mouseX = 0
    let mouseY = 0
    let animationFrameId: number
    let time = 0

    // Mouse move handler
    function handleMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    class Particle {
      x: number
      y: number
      size: number
      baseX: number
      baseY: number
      density: number
      speed: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * particleSize + 0.1
        this.baseX = this.x
        this.baseY = this.y
        this.density = Math.random() * 30 + 1
        this.speed = Math.random() * 0.5 + 0.1

        // Randomly assign slightly different colors to create depth
        const opacity = Math.random() * 0.3 + 0.2
        this.color = particleColor.replace(/[\d.]+\)$/, `${opacity})`)
      }

      update(mouseX: number, mouseY: number, time: number) {
        // Continuous motion
        this.x += Math.sin(time * this.speed) * 0.5
        this.y += Math.cos(time * this.speed) * 0.5

        if (interactive) {
          // Calculate distance between particle and mouse
          const dx = mouseX - this.x
          const dy = mouseY - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150 * sensitivity // Increased from 100 to 150 and added sensitivity multiplier

          // Create movement based on mouse position
          if (distance < maxDistance) {
            const forceDirectionX = dx / distance
            const forceDirectionY = dy / distance
            const force = (maxDistance - distance) / maxDistance
            const directionX = forceDirectionX * force * this.density * 0.9 * sensitivity // Increased from 0.6 to 0.9
            const directionY = forceDirectionY * force * this.density * 0.9 * sensitivity // Increased from 0.6 to 0.9

            this.x -= directionX
            this.y -= directionY
          } else {
            // Gently return particles towards their base position
            this.x += (this.baseX - this.x) * 0.01
            this.y += (this.baseY - this.y) * 0.01
          }
        }

        // Wrap around screen edges
        this.x = (this.x + canvas.width) % canvas.width
        this.y = (this.y + canvas.height) % canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function initParticles() {
      particles.length = 0
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    initParticles()

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      time += 0.01

      for (const particle of particles) {
        particle.update(mouseX, mouseY, time)
        particle.draw()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }

    window.addEventListener("resize", handleResize)

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove)

      // Touch support for mobile devices
      function handleTouchMove(e: TouchEvent) {
        if (e.touches.length > 0) {
          mouseX = e.touches[0].clientX
          mouseY = e.touches[0].clientY
        }
      }

      window.addEventListener("touchmove", handleTouchMove)

      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("touchmove", handleTouchMove)
        cancelAnimationFrame(animationFrameId)
      }
    } else {
      return () => {
        window.removeEventListener("resize", handleResize)
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [particleColor, particleCount, particleSize, interactive, sensitivity])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}
