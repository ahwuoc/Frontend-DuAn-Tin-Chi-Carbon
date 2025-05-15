"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface ImageComparisonProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  height?: number
}

export default function ImageComparison({
  beforeImage,
  afterImage,
  beforeLabel = "Trước",
  afterLabel = "Sau",
  height = 400,
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  const handleMouseDown = () => {
    isDraggingRef.current = true
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const containerWidth = containerRect.width
    const mouseX = e.clientX - containerRect.left

    const newPosition = Math.max(0, Math.min(100, (mouseX / containerWidth) * 100))
    setSliderPosition(newPosition)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return

    // Prevent default to avoid scrolling while dragging
    e.preventDefault()

    const containerRect = containerRef.current.getBoundingClientRect()
    const containerWidth = containerRect.width
    const touchX = e.touches[0].clientX - containerRect.left

    const newPosition = Math.max(0, Math.min(100, (touchX / containerWidth) * 100))
    setSliderPosition(newPosition)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleMouseMove(e)
      }
    }

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current) {
        handleTouchMove(e)
      }
    }

    window.addEventListener("mouseup", handleGlobalMouseUp)
    window.addEventListener("mousemove", handleGlobalMouseMove)
    window.addEventListener("touchmove", handleGlobalTouchMove, { passive: false })

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp)
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      window.removeEventListener("touchmove", handleGlobalTouchMove)
    }
  }, [])

  // Placeholder image with dimensions
  const placeholderImage = "/placeholder.svg?height=400&width=600"

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg shadow-lg cursor-col-resize select-none touch-none"
      style={{
        height: `${height}px`,
        backgroundColor: "#f0f0f0",
        touchAction: "none",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {/* Before Image (Full width) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gray-200" /> {/* Placeholder background */}
        <Image
          src={beforeImage || placeholderImage}
          alt="Before"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          unoptimized
          style={{ maxWidth: "100%", objectFit: "cover" }}
          draggable="false"
        />
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {beforeLabel}
        </div>
      </div>

      {/* After Image (Partial width based on slider) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          width: `${sliderPosition}%`,
          willChange: "width",
        }}
      >
        <div className="absolute inset-0 bg-gray-200" /> {/* Placeholder background */}
        <Image
          src={afterImage || placeholderImage}
          alt="After"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          unoptimized
          style={{ maxWidth: "100%", objectFit: "cover" }}
          draggable="false"
        />
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {afterLabel}
        </div>
      </div>

      {/* Slider */}
      <div
        className="absolute inset-y-0 z-10"
        style={{
          left: `${sliderPosition}%`,
          willChange: "left",
        }}
      >
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-white"></div>
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <div className="absolute w-full h-full rounded-full animate-ping bg-white opacity-30"></div>
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 text-center text-white text-xs bg-black/50 py-1">
        Kéo để so sánh
      </div>
    </div>
  )
}
